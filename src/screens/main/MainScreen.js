import _, { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BleManager, ScanMode } from 'react-native-ble-plx';
import { Col, Grid } from 'react-native-easy-grid';
// import prompt from 'react-native-prompt-android';
import RNRestart from 'react-native-restart';
// import FontAwesome from 'react-native-vector-icons/FontAwesome5';
// import IconButton from '../../components/buttons/IconButton';
import TopNav from '../../components/TopNav';
import {
  AVAILABLE_SERVICE_UUIDS,
  getDeviceMonitorInstance,
} from '../../../src/services/BLE';
import {
  TELE_HOST,
  BLUETOOTH_CONFIG_ACCESS_PASSWORD,
  NEW_COLOR,
  TRANSLATE_BUTTON_IMAGES,
} from '../../utils/constants';
import {
  colorBox,
  colorField,
  formatField,
  healthForm,
  initHealthFormState,
  isSelectableField,
} from '../../utils/healthForm';
import ModalDynamicView from './ModalDynamicView';
import ModalUploadSubmitView from './ModalUploadSubmitView';
import * as dbconfig from '../../utils/dbconfig';
import { Thumbnail } from 'native-base';

import DeviceInfo from 'react-native-device-info';
import Parse from 'parse/react-native';
import ComponentDataBox from './ComponentDataBox';
import { SafeAreaView } from 'react-navigation';
import {
  bgimgVertical,
  esasPage_th,
  facePage_th,
  imgBtnTele,
  posPage_th,
  ppsPage_th,
} from '../../utils/assetsURL';
import { ActivityIndicator } from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';
// import { arrayPush } from 'redux-form';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class HomeScreen extends Component {
  _interval = undefined;
  constructor(props) {
    super();
    this.state = {
      info: '', // text message
      modalVisible: false,
      submitModalVisible: false,
      modalType: 'sbp',
      modalValue: '',
      formState: initHealthFormState(),
      bleEnable: {},
      feature: [],
      count: 1,
      dimensions: {
        window: {
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
        },
        screen: screenDimensions,
      },
      isloading: false,
    };

    this.saveData = this.saveData.bind(this);
  }
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };
  async componentDidMount() {
    const { t, config } = this.props;
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );
    this.manager = new BleManager();
    this.scanAndConnect();

    this.setState({
      feature: dbconfig.mainScreenActionButtons(config),
    });

    await this.getStaff();
    await this.getData();
  }

  async getStaff() {
    const DeviceObject = Parse.Object.extend('Device');
    const UserObject = Parse.Object.extend('UserDetail');
    const DeviceQuery = new Parse.Query(DeviceObject);
    const UserQuery = new Parse.Query(UserObject);

    DeviceQuery.equalTo('deviceId', DeviceInfo.getUniqueId());
    const Device = await DeviceQuery.first();
    const staff = await Device.get('staffId');
    const deviceKey = Device.get('deviceKey');

    UserQuery.equalTo('idcard', staff);
    const UserDetail = await UserQuery.first();
    const staffDetail = UserDetail.get('user');

    if (deviceKey) {
      const nameDevice = Device.get('name');
      this.setState({ deviceName: nameDevice });
    }

    this.setState({
      staff: staff,
      staffDetail: { ...staffDetail, idcard: staff, is_logged_in: true },
    });
  }

  async getData() {
    const { currentuser } = this.props;

    const RTUserDataObject = Parse.Object.extend('RealTimeClinicUserData');
    const RTUserDataQuery = new Parse.Query(RTUserDataObject);

    RTUserDataQuery.descending('createdAt');
    RTUserDataQuery.equalTo('userid', currentuser.userid);

    const RTUserData = await RTUserDataQuery.find();

    const tempData = [
      'spo2',
      'resp1',
      'temp',
      'sbp1',
      'dbp1',
      'hr1',
      'wei1',
      'bgc',
      'hei1',
    ];
    const valueArr = [];
    for (let k in tempData) {
      const dataArr = [];
      for (let i in RTUserData) {
        const obj = RTUserData[i];
        const temp = obj.get('value');
        const data = JSON.stringify(temp?.[tempData[k]]?.value);
        if (dataArr.length < 3) {
          if (data) {
            dataArr.push(data);
          }
        }
      }
      valueArr.push({ [tempData[k]]: dataArr });
    }
    this.setState({
      rtData: valueArr,
    });
  }

  componentWillUnmount() {
    if (this.manager) {
      this.manager.destroy();
    }
    this.dimensionsSubscription?.remove();
  }

  info(message) {
    this.setState({ info: message });
  }

  error(message) {
    this.setState({ info: 'ERROR:' + message });
    // console.log('ERROR:' + message);
  }

  async saveData() {
    const { t, saveHealthRecord, currentuser } = this.props;
    this.setState({ isloading: true });
    console.log(this.state.isloading);
    const { ok, reason, record } = await saveHealthRecord();
    // console.log('ok', ok);
    // await this.sendLineNotification(JSON.stringify(record));
    if (record?.sbp && record?.dbp) {
      record.bp = record?.sbp + '/' + record?.dbp;
    }
    // console.log('record', record);

    const formattedMessage = Object.entries(record)
      .filter(([key, value]) => value !== 0)
      .map(([key, value]) => {
        let label = key;
        switch (key) {
          case 'spo2':
            label = 'ออกซิเจนในเลือด';
            break;
          case 'temp':
            label = 'อุณหภูมิ';
            break;
          case 'resp':
            label = 'อัตราการหายใจ';
            break;
          case 'hr':
            label = 'อัตราการเต้นของหัวใจ';
            break;
          case 'bp':
            label = 'ความดันโลหิต';
            break;
          case 'weight':
            label = 'น้ำหนัก';
            break;
          case 'height':
            label = 'ส่วนสูง';
            break;
          case 'bgc':
            label = 'ระดับน้ำตาลในเลือด';
            break;
        }
        if (!['sbp', 'dbp'].includes(key)) {
          return `${label}: ${value}`;
        }
      })
      .join('\n\t')
      .trim();

    await this.sendLineNotification(formattedMessage);
    await this.sendLineOA(formattedMessage);
    if (ok) {
      this.setState({ isLoading: false, submitModalVisible: true });
      this.getData();
    } else {
      if (reason === 'noInternet') {
        Alert.alert(t('common:alert'), t('mainScreen:noInternetConnection'));
      } else {
        Alert.alert(t('common:alert'), t('mainScreen:sendDataFail'));
      }
    }
  }
  sendLineNotification = async (message) => {
    const { currentuser, t } = this.props;
    const UserObject = Parse.Object.extend('UserDetail');
    const UserQuery = new Parse.Query(UserObject);
    UserQuery.equalTo('idcard', currentuser.idcard);
    const UserDetail = await UserQuery.first();
    const staffDetail = UserDetail.get('linegroup');
    try {
      const lineNotifyToken = staffDetail;
      const url = 'https://notify-api.line.me/api/notify';

      const formData = new FormData();
      formData.append(
        'message',
        `myhealthcare\nผลการตรวจร่างกายของคุณ${currentuser.user.fullname_th}\n\t${message}`,
      );

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${lineNotifyToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      // console.log(result);
    } catch (error) {
      console.error('Error sending Line notification:', error);
    }
  };
  sendLineOA = async (message) => {
    const { currentuser, t } = this.props;
    const UserObject = Parse.Object.extend('UserDetail');
    const UserQuery = new Parse.Query(UserObject);
    UserQuery.equalTo('idcard', currentuser.idcard);
    const UserDetail = await UserQuery.first();
    const lineID = UserDetail.get('lineID');
    // console.log('lineID', lineID);
    try {
      const lineNotify = lineID;
      const Authorization =
        'dlmMJIDuAnFTOrIxt1IjvGRihrCyyINAXB2QaTDGEUaikjefh2dZ7CFOk3hpBGSXNqCClqCGkeMULxN3tfC4DAYl/5c15dL1rTEhZ9AwyF7XSx2A7Cs4/pJhlQQWISwT2bWsyzxc9lxK8vDbAj8YnAdB04t89/1O/w1cDnyilFU=';
      const url = 'https://api.line.me/v2/bot/message/push';

      const formData = new FormData();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Authorization}`,
        },
        body: JSON.stringify({
          to: `${lineNotify}`,
          messages: [
            {
              type: 'text',
              text: `myhealthcare\nผลการตรวจร่างกายของคุณ${currentuser.user.fullname_th}\n\t${message}`,
            },
          ],
        }),
      });

      const result = await response.json();
      // console.log(result);
    } catch (error) {
      console.error('Error sending Line notification:', error);
    }
  };

  scanAndConnect() {
    const { setHealthRecord, availableDeviceTypes } = this.props;
    this.info('start Device Scan!');

    const bleAvailable = Object.values(availableDeviceTypes)
      .filter((d) => d != null)
      .reduce((acc, d) => {
        return { ...acc, [d.id]: d.name };
      }, {});

    const isRunning = {};
    this.manager.startDeviceScan(
      AVAILABLE_SERVICE_UUIDS,
      {
        scanMode: ScanMode.LowLatency,
      },
      (error, device) => {
        if (error) {
          this.error(error);
          return;
        }

        // Check if in available ids.
        if (!bleAvailable[device.id]) {
          return;
        }

        this.info(`found Device: ${device.name}`);

        if (isRunning[device.id]) {
          return;
        }

        isRunning[device.id] = true;

        const monitorInstance = getDeviceMonitorInstance(
          device,
          availableDeviceTypes,
        );
        if (!monitorInstance) {
          delete isRunning[device.id];
          return;
        }

        this.setState((prevState) => ({
          ...prevState,
          bleEnable: { ...prevState.bleEnable, [monitorInstance.type]: true },
        }));

        const onDisconnectedSubscription = this.manager.onDeviceDisconnected(
          device.id,
          () => {
            delete isRunning[device.id];
            this.setState((prevState) => ({
              ...prevState,
              bleEnable: {
                ...prevState.bleEnable,
                [monitorInstance.type]: false,
              },
            }));
            onDisconnectedSubscription.remove();
          },
        );
        // console.log('device', device);
        // console.log('monitorInstance', monitorInstance);
        monitorInstance.monitor(device, availableDeviceTypes).subscribe(
          (data) => {
            const { payload } = data;
            const { formState } = this.state;
            const fieldKeys = _.flatMap(
              _.values(healthForm),
              (form) => form.fields,
            ).map((field) => field.name);

            const healthData = Object.keys(payload).reduce((acc, key) => {
              if (fieldKeys.includes(key)) {
                if (isSelectableField(key)) {
                  return {
                    ...acc,
                    [healthForm[key].fields[formState[key].choices].name]:
                      payload[key],
                  };
                }
                return { ...acc, [key]: payload[key] };
              }
              return acc;
            }, {});
            setHealthRecord(healthData);
          },
          (err) => {
            this.error(err);
          },
          () => this.info('send Data completed'),
        );
      },
    );
  }

  handleInputChange = (type) => {
    this.setState({ modalVisible: true, modalType: type });
  };

  handleClearInput = (type) => {
    const { t, setHealthRecord } = this.props;
    Alert.alert(
      t('mainScreen:confirmResetDataHeader'),
      t('mainScreen:confirmResetDataConfirm', {
        fieldName: t(`healthForm:${type}.name`),
      }),
      [
        {
          text: t('common:cancel'),
          style: 'cancel',
        },
        {
          text: t('common:confirm'),
          onPress: () => {
            const { formState } = this.state;
            const form = healthForm[type];
            if (form.selectable) {
              const fieldIdx = formState[type]?.choices ?? 0;
              const fieldName = form.fields[fieldIdx].name;
              setHealthRecord({ [fieldName]: 0 });
            } else {
              const fieldNames = form.fields.map((field) => field.name);
              const newData = fieldNames.reduce(
                (data, fieldName) => ({ ...data, [fieldName]: 0 }),
                {},
              );
              setHealthRecord(newData);
            }
          },
        },
      ],
    );
  };
  handleChoiceSelect = (type, idx) => {
    this.setState({ formState: { [type]: { choices: idx } } });
  };

  handleModalSubmit = (isSubmit) => {
    this.setState({
      submitModalVisible: false,
      isloading: false,
    });
    if (!isSubmit) {
      RNRestart.Restart();
    }
  };

  // datablock
  // renderDataComponent() {
  //   const { t } = this.props;
  //   const {
  //     dimensions: { window },
  //   } = this.state;
  //   const {
  //     sbp,
  //     dbp,
  //     hr,
  //     weight,
  //     temp,
  //     spo2,
  //     // spo2before,
  //     // spo2after,
  //     bgc,
  //     resp,
  //     height,
  //   } = this.props.healthdata.record;
  //   const { loading } = this.props.healthdata;

  //   const hasAnyData =
  //     sbp ||
  //     dbp ||
  //     hr ||
  //     weight ||
  //     temp ||
  //     spo2 ||
  //     // spo2before ||
  //     // spo2after ||
  //     bgc ||
  //     resp ||
  //     height;
  //   const uploadBtnEnable = hasAnyData && !loading;

  //   return (
  //     <>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           height: (SCREEN_HEIGHT - 115) / 2.4,
  //         }}>
  //         {this.renderDataComponentLine('spo2')}
  //         {this.renderDataComponentLine('resp')}
  //         {this.renderDataComponentLine('temp')}
  //         {this.renderDataComponentLine('bp')}
  //       </View>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           height: (SCREEN_HEIGHT - 115) / 2.4,
  //         }}>
  //         {this.renderDataComponentLine('hr')}
  //         {this.renderDataComponentLine('weight')}
  //         {this.renderDataComponentLine('bgc')}
  //         {this.renderDataComponentLine('height')}
  //       </View>

  //       <TouchableOpacity
  //         style={[
  //           carouselStyle.button,
  //           !uploadBtnEnable && carouselStyle.buttonInactive,
  //         ]}
  //         onPress={this.saveData}
  //         // onPress={this.handleClearData}
  //         disabled={!uploadBtnEnable}>
  //         <Text style={carouselStyle.buttonText}>
  //           {t('mainScreen:sendDataBtn')}
  //         </Text>
  //       </TouchableOpacity>
  //     </>
  //   );
  // }

  // datablockline
  renderDataComponentLine(type, last = false) {
    const { t, healthdata } = this.props;
    const {
      formState,
      bleEnable,
      rtData,
      dimensions: { window, screen },
    } = this.state;

    if (!healthForm[type]) {
      return null;
    }
    const form = healthForm[type];
    const state = formState[type];
    let mapKey = {
      spo2: 'spo2',
      resp: 'resp1',
      temp: 'temp',
      bp: ['sbp1', 'dbp1'],
      hr: 'hr1',
      weight: 'wei1',
      bgc: 'bgc',
      height: 'hei1',
    };

    const values = form.fields.map((field) => {
      return {
        value: formatField(field, healthdata.record[field.name]),
        title: field?.title,
        color: colorField(field, healthdata.record[field.name]),
        backgroundColor: colorBox(field, healthdata.record[field.name]),
      };
    });

    // map data 3 row
    let mapData = {};
    let bpData = {};

    const formatBp = (data) => {
      const key = Object.keys(data)?.[0];
      if (data?.[key].length > 0) {
        bpData = { ...bpData, [key]: data?.[key] };
      }
    };

    rtData
      ? rtData.map((data) => {
          type == 'bp'
            ? Object.keys(data)?.[0] === 'sbp1' ||
              Object.keys(data)?.[0] === 'dbp1'
              ? formatBp(data)
              : null
            : mapKey?.[type] && Object.keys(data)?.[0] == mapKey?.[type]
            ? (mapData = data)
            : null;
        })
      : null;

    type == 'bp' && !isEmpty(bpData)
      ? (mapData = {
          ...mapData,
          bp: [
            bpData?.sbp1?.[0] && bpData?.dbp1?.[0]
              ? `${bpData?.sbp1?.[0]} / ${bpData?.dbp1?.[0]}`
              : null,
            bpData?.sbp1?.[1] && bpData?.dbp1?.[1]
              ? `${bpData?.sbp1?.[1]} / ${bpData?.dbp1?.[1]}`
              : null,
            bpData?.sbp1?.[2] && bpData?.dbp1?.[2]
              ? `${bpData?.sbp1?.[2]} / ${bpData?.dbp1?.[2]}`
              : null,
          ],
        })
      : null;

    return values.map((value, i) => [
      i > 0 ? null : (
        <TouchableOpacity
          key={type}
          style={{
            backgroundColor: value.backgroundColor,
            // width: window.width > window.height ? '23%' : '98%',
            flexBasis: window.width > window.height ? '23%' : '98%',
            borderRadius: 30,
            marginTop:
              window.width > window.height ? -(window.width * 0.05) : 10,
            marginLeft:
              window.width > window.height ? window.width * 0.005 : 10,
            marginBottom:
              window.width > window.height ? window.width * 0.06 : 10,
            marginRight:
              window.width > window.height ? window.width * 0.005 : 10,
            // marginVertical: 5,
            padding: window.width > window.height ? window.width * 0.014 : 15,
          }}
          onPress={() => this.handleInputChange(type)}>
          <ComponentDataBox
            img={form.img}
            title={t(form.iconTitle)}
            isEdit={form.editable}
            dataCurrent={
              form.selectable ? (
                <Text style={{ color: values[state.choices].color }}>
                  {values[state.choices].value}
                </Text>
              ) : (
                values.map((value, i) => [
                  i > 0 && (
                    <Text
                      style={{
                        fontSize: window.width * 0.06,
                      }}>
                      /
                    </Text>
                  ),
                  <Text style={{ color: value.color }}>{value.value}</Text>,
                ])
              )
            }
            data={mapData}
            unit={t(form.unit)}
          />
        </TouchableOpacity>
      ),
    ]);
  }

  renderFormWebLink(url, link) {
    const { navigation } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            <TouchableOpacity
              style={FormWebLink.container}
              onPress={() => {
                navigation.navigate(link.mode, link.params);
              }}>
              <Image source={{ uri: url }} style={FormWebLink.img} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={{
                padding: 10,
                width: width > 400 ? width * 0.4 : width * 0.38,
                height: width > 400 ? height * 0.2 : height * 0.18,
              }}
              onPress={() => {
                navigation.navigate(link.mode, link.params);
              }}>
              <Image
                source={{ uri: url }}
                style={[
                  FormWebLink.img,
                  {
                    borderRadius: 20,
                  },
                ]}
              />
            </TouchableOpacity>
          </>
        )}
      </>
    );
  }
  renderCameraUploadBtn(mode, params, imgLink) {
    const { navigation } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    // console.log('params',[params,mode]);
    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            <TouchableOpacity
              style={FormWebLink.container}
              onPress={() => {
                navigation.navigate(mode, params);
              }}>
              <Image
                source={{
                  uri: 'https://file.myhealthgroup.net/public/mhc/uploadcamera.png',
                }}
                style={FormWebLink.img}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={{
                padding: 10,
                width: width > 400 ? width * 0.4 : width * 0.38,
                height: width > 400 ? height * 0.2 : height * 0.18,
              }}
              onPress={() => {
                navigation.navigate(mode, params);
              }}>
              <Image
                source={{
                  uri: 'https://file.myhealthgroup.net/public/mhc/uploadcamera.png',
                }}
                style={[
                  FormWebLink.img,
                  {
                    borderRadius: 20,
                  },
                ]}
              />
            </TouchableOpacity>
          </>
        )}
      </>
    );
  }
  renderFormBtns() {
    const { t, config, currentuser } = this.props;
    const {
      staff,
      staffDetail,
      dimensions: { window },
    } = this.state;
    const features = dbconfig.mainScreenActionButtons(config);
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    const tele = features.map((feature) => {
      if (feature.type === 'teleclinic') {
        // console.log(config);
        // console.log(config?.features?.teleclinic);
        const { navigation } = this.props;
        return (
          <>
            {WidthMoreThenHeight ? (
              <TouchableOpacity
                key={feature.type}
                style={carouselStyle.imgContainer}
                onPress={() => {
                  // navigation.navigate('Pretele');
                  navigation.navigate('TeleProcess', {
                    isHeaders: true,
                    url: config?.features?.teleclinic,
                  });
                }}>
                <Image
                  source={{ uri: config?.images?.[t('images:mainPage2')] }}
                  style={FormWebLink.img}
                />
              </TouchableOpacity>
            ) : (
              <View style={{}}>
                <TouchableOpacity
                  key={feature.type}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width * 0.8,
                    height: height * 0.2,
                  }}
                  onPress={() => {
                    // navigation.navigate('Pretele');
                    navigation.navigate('TeleProcess', {
                      isHeaders: true,
                      url: config?.features?.teleclinic,
                    });
                  }}>
                  <Image
                    source={{ uri: imgBtnTele }}
                    style={{
                      borderRadius: 50,
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      }
      return null;
    });

    const data = features.map((feature) => {
      //อาการโควิด แบบประเมินสุขภาพจิต
      if (feature.type === 'covidRecord') {
        return (
          <>
            <View key={feature.type + '_health'} style={carouselStyle.img}>
              {this.renderFormWebLink(
                config?.images?.[t('images:covidHealthPage')],
                {
                  mode: 'CovidHealthForm',
                },
              )}
            </View>
            <View key={feature.type + '_mental'} style={carouselStyle.img}>
              {this.renderFormWebLink(
                config?.images?.[t('images:covidMentalPage')],
                {
                  mode: 'CovidMentalHealthForm',
                },
              )}
            </View>
          </>
        );
      }
      if (feature.type === 'teleBooking') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(
              config?.images?.[t('images:teleBookingPage')],
              {
                mode: 'TeleClinicBooking',
              },
            )}
          </View>
        );
      }
      //วิเคราะห์ข้อมูลสุขภาพ
      if (feature.type === 'healthAnalytic') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(
              config?.images?.[t('images:healthAnalyticPage')],
              {
                mode: 'AnalyticScreen',
              },
            )}
          </View>
        );
      }
      //แบบประเมินคัดกรอง adl
      if (feature.type === 'adl') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(config?.images?.[t('images:adlPage')], {
              mode: 'AdlScreen',
            })}
          </View>
        );
      }
      // คัดกรองสุขภาพผู้สูงอายุ
      if (feature.type === 'eldH') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(config?.images?.[t('images:eldHPage')], {
              mode: 'EldHMainScreen',
            })}
          </View>
        );
      }
      // console.log(config?.images?.[t('images:eldHPage')]);
      //แบบบันทึกการปฎิบัติงาน ดูแลผู้ที่มีภาวะพึ่งพึง
      if (feature.type === 'caregiver') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(
              config?.images?.[t('images:caregiverPage')],
              {
                mode: 'CareGiverScreen',
                params: {
                  staffDetail,
                },
              },
            )}
          </View>
        );
      }
      //แบบประเมินอาการ esas
      if (feature.type === 'esasPage') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(config?.images?.[t('images:esasPage')], {
              mode: 'EsasScreen',
            })}
          </View>
        );
      }
      //แบบประเมินความเจ็บปวด face pain scale revised
      if (feature.type === 'facePain') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(facePage_th, {
              mode: 'FaceScreen',
            })}
          </View>
        );
      }
      //แบบประเมิน pps score
      if (feature.type === 'ppsPage') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(ppsPage_th, {
              mode: 'PpsScreen',
            })}
          </View>
        );
      }
      //แบบประเมิน pos
      if (feature.type === 'posPage') {
        return (
          <View key={feature.type} style={carouselStyle.img}>
            {this.renderFormWebLink(posPage_th, {
              mode: 'PosScreen',
            })}
          </View>
        );
      }

      return null;
    });
    const url = `${TELE_HOST}/camera/form/${currentuser.userid}/${config?.partner?.partnerid}`;
    return (
      <>
        {window.width > window.height ? (
          <>
            <View style={carouselStyle.formContainer}>
              {tele}
              <ScrollView pagingEnabled>
                <View style={carouselStyle.flexWrap}>
                  {data}
                  {this.renderCameraUploadBtn(
                    'CameraUpload',
                    {
                      isHeaders: true,
                      url: url,
                    },
                    'http://file.myhealthgroup.net/public/mhc/formPage/face_th.jpg)',
                  )}
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {tele}
              <ScrollView pagingEnabled>
                <View
                  style={{
                    flex: 4,
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {data}
                  {this.renderCameraUploadBtn(
                    'CameraUpload',
                    {
                      isHeaders: true,
                      url: url,
                    },
                    'http://file.myhealthgroup.net/public/mhc/formPage/face_th.jpg)',
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </>
    );
  }

  renderAction() {
    // console.log('SCREEN_WIDTH', SCREEN_WIDTH);
    const {
      dimensions: { window },
      isloading,
    } = this.state;
    const { t } = this.props;
    const {
      sbp,
      dbp,
      hr,
      weight,
      temp,
      spo2,
      // spo2before,
      // spo2after,
      bgc,
      resp,
      height,
    } = this.props.healthdata.record;
    const { loading } = this.props.healthdata;
    // console.log('width', window.width);
    const hasAnyData =
      sbp ||
      dbp ||
      hr ||
      weight ||
      temp ||
      spo2 ||
      // spo2before ||
      // spo2after ||
      bgc ||
      resp ||
      height;
    const uploadBtnEnable = hasAnyData && !loading;
    return (
      <SafeAreaView>
        <ScrollView
          style={{
            height:
              window.width > window.height
                ? '86%'
                : window.width > 400
                ? '85%'
                : '80%',
            top: -(window.height * 0.02),
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            // scroll animation ended
            // console.log('e', e.nativeEvent.contentOffset.x);
            e.nativeEvent.contentOffset.x >= window.width - 500
              ? this.setState({ count: 2 })
              : this.setState({ count: 1 });
          }}>
          {window.width > window.height ? (
            <View>
              {isloading && (
                <Modal
                  presentationStyle={'overFullScreen'}
                  animationType={'fade'}
                  transparent
                  visible={isloading}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        padding: 20,
                        borderRadius: 20,
                      }}>
                      <ActivityIndicator size="large" color="blue" />
                    </View>
                  </View>
                </Modal>
              )}
              <View
                style={[
                  carouselStyle.container,
                  {
                    width: window.width * 0.97,
                    height: '100%',
                  },
                ]}>
                {this.renderDataComponentLine('spo2')}
                {this.renderDataComponentLine('resp')}
                {this.renderDataComponentLine('temp')}
                {this.renderDataComponentLine('bp')}
                {this.renderDataComponentLine('hr')}
                {this.renderDataComponentLine('weight')}
                {this.renderDataComponentLine('bgc')}
                {this.renderDataComponentLine('height')}
                {/* {this.renderDataComponent()} */}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -(window.height * 0.075),
                }}>
                <TouchableOpacity
                  style={[
                    {
                      alignItems: 'center',
                      backgroundColor: NEW_COLOR['blue'],
                      paddingVertical: window.height * 0.014,
                      borderRadius: 30,
                      width: window.width * 0.9,
                    },
                    !uploadBtnEnable && carouselStyle.buttonInactive,
                  ]}
                  onPress={() => {
                    this.saveData();
                    this.setState({ isLoading: true });
                  }}
                  // onPress={this.handleClearData}
                  disabled={!uploadBtnEnable}>
                  <Text style={carouselStyle.buttonText}>
                    {t('mainScreen:sendDataBtn')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <ScrollView>
              {isloading && (
                <Modal
                  presentationStyle={'overFullScreen'}
                  animationType={'fade'}
                  transparent
                  visible={isloading}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        padding: 20,
                        borderRadius: 20,
                      }}>
                      <ActivityIndicator size="large" color="blue" />
                    </View>
                  </View>
                </Modal>
              )}
              <View
                style={[
                  carouselStyle.container,
                  {
                    width: window.width - 40,
                    height: '100%',
                  },
                ]}>
                {this.renderDataComponentLine('spo2')}
                {this.renderDataComponentLine('resp')}
                {this.renderDataComponentLine('temp')}
                {this.renderDataComponentLine('bp')}
                {this.renderDataComponentLine('hr')}
                {this.renderDataComponentLine('weight')}
                {this.renderDataComponentLine('bgc')}
                {this.renderDataComponentLine('height')}
                {/* {this.renderDataComponent()} */}
                <View
                  style={{
                    bottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={[
                      carouselStyle.button,
                      !uploadBtnEnable && carouselStyle.buttonInactive,
                      {
                        width: window.width * 0.8,
                      },
                    ]}
                    onPress={() => {
                      this.saveData();
                      this.setState({ isLoading: true });
                    }}
                    // onPress={this.handleClearData}
                    disabled={!uploadBtnEnable}>
                    <Text style={carouselStyle.buttonText}>
                      {t('mainScreen:sendDataBtn')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}

          <View
            style={[
              carouselStyle.container,
              {
                width: window.width - 40,
                height: window.width > window.height ? '93%' : '100%',
              },
            ]}>
            {this.renderFormBtns()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  manualValueSetting(res) {
    const { setHealthRecord } = this.props;
    setHealthRecord(res);
  }

  renderStaffBlock() {
    const { staff, staffDetail } = this.state;
    return !isEmpty(staff) ? (
      <View style={staffBlockStyle.userBlock}>
        <Grid>
          <Col style={staffBlockStyle.userBlockIcon}>
            <Thumbnail
              style={staffBlockStyle.profileThumbnail}
              source={{
                uri:
                  'https://www.myhealthgroup.net/files/avatar_120/' +
                  staffDetail?.avatar,
              }}
            />
          </Col>
          <Col style={staffBlockStyle.userBlockText}>
            <Text style={staffBlockStyle.userRNameLine} numberOfLines={1}>
              Staff : {staffDetail?.fullname_th}
            </Text>
            <Text style={staffBlockStyle.userDNameLine} numberOfLines={1}>
              <Text style={staffBlockStyle.userDNameBoldLine}>ID Number :</Text>
              {staff}
            </Text>
            <Text style={staffBlockStyle.userDNameLine} numberOfLines={1}>
              <Text style={staffBlockStyle.userDNameBoldLine}>User Name :</Text>
              {staffDetail?.username}
            </Text>
          </Col>
        </Grid>
      </View>
    ) : null;
  }

  render() {
    const { navigation, user, authentication, currentuser, config, t } =
      this.props;
    const {
      modalVisible,
      submitModalVisible,
      modalType,
      deviceName,
      dimensions: { window },
    } = this.state;
    const loginStaffFeature = config?.features?.staff;

    // console.log('currentuser', currentuser);

    return (
      <ImageBackground
        // source={{ uri: config?.images?.[t('images:loginPage')] }}
        style={styles.container}>
        <TopNav
          leftComponent={loginStaffFeature ? this.renderStaffBlock() : null}
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          deviceName={deviceName}
        />

        {window.width > window.height
          ? this.renderAction()
          : this.renderAction()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            top: window.width > window.height ? -40 : 5,
          }}>
          <View style={carouselStyle.dotBox}>
            {this.state.count === 1 ? (
              <>
                <Text style={carouselStyle.dotActive}></Text>
                <Text style={carouselStyle.dotInactive}></Text>
              </>
            ) : (
              <>
                <Text style={carouselStyle.dotInactive}></Text>
                <Text style={carouselStyle.dotActive}></Text>
              </>
            )}
          </View>
        </View>
        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'slide'}
          transparent
          visible={modalVisible}>
          <ModalDynamicView
            type={modalType}
            maxLength={6}
            onCancel={() => this.setState({ modalVisible: false })}
            onSubmit={(res) => {
              this.manualValueSetting(res);
              this.setState({ modalVisible: false });
            }}
          />
        </Modal>

        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'fade'}
          transparent
          visible={submitModalVisible}>
          <ModalUploadSubmitView
            onCancel={() => this.handleModalSubmit(false)}
            onSubmit={() => this.handleModalSubmit(true)}
          />
        </Modal>
      </ImageBackground>
    );
  }
}

const BLK_HEIGHT = SCREEN_HEIGHT - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEW_COLOR['light_gray'],
  },
  fullImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
});

const dataBlk = StyleSheet.create({
  blkContainer: {
    height: BLK_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  container: {
    marginHorizontal: 15,
  },
  webContainer: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  webZone: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  topHeaderLine: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  lineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  lineLeft: {},
  lineRight: {
    width: 170,
  },
  lineValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoLineContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 5,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  infoNumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  infoPrevNumTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b0bec5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b0bec5',
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  infoNumBig: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  infoUnitText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 15,
    marginLeft: 5,
  },
  infoSmallText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
  },
  infoContainer: {
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'rgba(250,183,165,0.3)',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcons: {
    fontSize: 26,
  },
  infoInnerBtn: {
    borderColor: 'white',
    borderWidth: 2,
    color: 'white',
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'grey',
  },
  infoInnerBtnActive: {
    backgroundColor: '#70AF85',
  },
  titleTextN: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.8)',
  },
  submitBtn: {
    marginBottom: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(250,183,165,1)',
  },
  submitBtnActive: {
    backgroundColor: 'rgba(250,183,165,0.3)',
  },
  submitText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBlk: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
  },
  horizontalScroll: {
    height: SCREEN_HEIGHT,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

const staffBlockStyle = StyleSheet.create({
  userBlock: {
    height: 80,
    margin: 15,
    marginLeft: 110,
    borderRadius: 50,
    paddingVertical: 10,
    paddingRight: 20,
    backgroundColor: NEW_COLOR['light_blue'],
  },
  userBlockIcon: {
    width: 90,
    height: 60,
    alignItems: 'center',
  },
  userBlockText: {
    justifyContent: 'center',
  },
  userRightIcon: {
    width: 120,
    height: 60,
  },
  profileThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
  },
  rightBtnBlk: {
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  logoutBlk: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 40,
    height: 70,
    paddingHorizontal: 35,
    borderRadius: 35,
    backgroundColor: NEW_COLOR['red'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userRNameLine: {
    fontSize: 18,
    color: NEW_COLOR['blue'],
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  userDNameLine: {
    fontSize: 12,
    color: NEW_COLOR['blue'],
    fontFamily: 'LINESeedSansTH_A_Rg',
  },
  userDNameBoldLine: {
    fontSize: 12,
    color: NEW_COLOR['blue'],
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  topAdsBlk: {
    height: 80,
    margin: 10,
    borderRadius: 10,
    // backgroundColor: '#eceff1'
  },
  img: {
    width: 40,
    height: 40,
  },
});

const carouselStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: SCREEN_WIDTH - 40,
    borderRadius: 30,
    marginHorizontal: 20,
    padding: 10,
    // paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (SCREEN_WIDTH - 40) / 4.2,
    padding: 10,
  },
  img: {
    borderRadius: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  dotBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '5%',
  },
  dotActive: {
    height: 10,
    width: 10,
    backgroundColor: 'gray',
    borderRadius: 30,
  },
  dotInactive: {
    height: 10,
    width: 10,
    backgroundColor: 'lightgray',
    borderRadius: 30,
  },
  button: {
    alignItems: 'center',
    backgroundColor: NEW_COLOR['blue'],
    paddingVertical: 10,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.9,
  },
  buttonInactive: {
    backgroundColor: NEW_COLOR['light_blue'],
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  flexWrap: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dataBlk: {
    width: '23%',
    borderRadius: 30,
    margin: 10,
    // marginVertical: 5,
    padding: 15,
  },
  componentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: (SCREEN_HEIGHT - 115) / 2.4,
  },
});

const FormWebLink = StyleSheet.create({
  container: {
    padding: 10,
    width: (SCREEN_WIDTH - 40) / 4.2,
    height: (SCREEN_HEIGHT - 165) / 2,
  },
  img: {
    borderRadius: 30,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});

HomeScreen.propTypes = {
  authentication: PropTypes.shape({
    avatar: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  user: PropTypes.object.isRequired,
  notification: PropTypes.any.isRequired,
};

export default HomeScreen;
