import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageButton from '../../components/buttons/ImageButton';
import SOSModalView from './SOSModalView';
import i18n from '../../i18n';
import {
  BLUETOOTH_CONFIG_ACCESS_PASSWORD,
  FILE_SERVER,
  NEW_COLOR,
  SilverCareBearer,
  TRANSLATE_BUTTON_IMAGES,
} from '../../utils/constants';
import cardReaderEvent, {
  CARD_STATUS,
} from '../../utils/custom/cardReaderEvent';
import * as dbconfig from '../../utils/dbconfig';

import DeviceInfo from 'react-native-device-info';
import Parse from 'parse/react-native';
import { StaffBlock } from '../form/component/FormItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { bgimgVertical } from '../../utils/assetsURL';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      haveError: false,
      SOSModalVisible: false,
      staffModal: false,
      isLoading: false,
      dimensions: {
        window: {
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
        },
        screen: screenDimensions,
      },
    };
  }
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };

  componentDidMount() {
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );

    this.eventListener = cardReaderEvent.addListener(
      'DeviceEvent',
      ({ status, payload }) => {
        const { handleSubmit, currentuser } = this.props;
        // Because this event listener still working even changing page,
        // It's should run by checking global state instead.
        if (
          status === CARD_STATUS.CARD_DETECTED &&
          typeof payload?.id === 'string' &&
          typeof currentuser?.idcard === 'string' &&
          currentuser?.idcard.length === 0
        ) {
          handleSubmit(payload.id);
        }
      },
    );

    this.getStaff();
  }

  componentDidUpdate(prevProps) {
    const { errorMsg } = this.props;
    if (prevProps.errorMsg !== errorMsg) {
      this._errMessageHandler();
    }

    const { staffModal, citizenID, messageFromSilverCare } = this.state;
    if (
      prevProps.errorMsg !== staffModal &&
      !staffModal &&
      (citizenID || messageFromSilverCare)
    ) {
      this.setState({ messageFromSilverCare: '', citizenID: '' });
    }
  }

  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
    if (this.eventListener) {
      this.eventListener.remove();
      this.eventListener = null;
    }
    this.setState({
      id: 0,
      haveError: false,
    });
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

    //check silvercare staff status
    let is_logged_in = false;
    if (!!staff) {
      const url = `https://silvercare.io/api/v1/domain/session/info?staff_citizen_id=${staff}`;

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + SilverCareBearer,
        },
      };

      try {
        const response = await fetch(url, options);
        const res = await response.json();
        if (response.ok) {
          is_logged_in = res?.is_logged_in;
        }
      } catch (e) {
        is_logged_in = false;
      }
    }
    //==============================

    this.setState({
      Device: Device,
      staff: staff,
      deviceKey: deviceKey,
      staffDetail: {
        ...staffDetail,
        idcard: staff,
        is_logged_in: is_logged_in,
      },
    });

    is_logged_in
      ? this.setState({ staffModal: false })
      : this.setState({ staffModal: true });
  }

  _hex2string(hexx) {
    let tempHexx = hexx;
    if (tempHexx.length > 4) tempHexx = tempHexx.slice(0, -4);
    const patt = /^[a-zA-Z0-9&@.$%\-,():`# \/]+$/;
    const hex = tempHexx.toString();
    let str = '';
    let tmp = '';
    for (let i = 0; i < hex.length; i += 2) {
      tmp = String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      if (!tmp.match(patt)) {
        tmp = String.fromCharCode(parseInt(hex.substr(i, 2), 16) + 3424);
      }
      str += tmp;
    }
    str = str.replace(/#/g, ' ');
    return str;
  }

  _errMessageHandler = () => {
    const { errorMsg } = this.props;
    if (errorMsg) {
      this.setState({ haveError: true });
    }
  };

  // เรียกใช้ sos
  handleSendSOS = () => {
    this.setState({ SOSModalVisible: true });
  };
  // แสดงปุ่ม sos
  renderSOSBtn() {
    const { config, t } = this.props;
    const {
      dimensions: { window },
    } = this.state;

    const features = dbconfig.homeScreenActionButtons(config);
    const sosFeature = features.find((f) => f.type === 'sos');
    if (sosFeature != null) {
      return (
        // <View style={sosBtn.emergencyBtnPostion}>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            top: 15,
            left:
              window.width > window.height
                ? 110
                : window.width > 400
                ? 110
                : 90,
            zIndex: 1,
            borderRadius: 50,
          }}>
          <View style={sosBtn.emergencyBtnBorder}>
            <ImageButton
              width={window.width > 400 ? 75 : 60}
              height={window.width > 400 ? 75 : 60}
              source={TRANSLATE_BUTTON_IMAGES[t('buttons:sos2')]}
              onPress={this.handleSendSOS}
            />
          </View>
        </View>
      );
    }
    return null;
  }

  renderErrMessage() {
    const { haveError } = this.state;
    const { errorMsg } = this.props;

    if (haveError) {
      return (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={25} color="#dc3545" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      );
    }
    return null;
  }

  renderStaffLoginModal() {
    const { config, t } = this.props;
    const {
      staff,
      citizenID,
      staffModal,
      messageFromSilverCare,
      staffDetail,
      dimensions: { window },
    } = this.state;
    const width = window.width;
    const height = window.height;
    const WidthMoreThenHeight = width > height;
    const _onSubmit = async (action) => {
      const { staff, deviceKey, Device } = this.state;
      const { citizenID } = this.state;

      const url = `https://silvercare.io/api/v1/domain/session/${action}`;
      const formData = new FormData();
      formData.append('citizen_id', action === 'in' ? citizenID : staff);
      formData.append('tablet_id', deviceKey);

      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + SilverCareBearer,
        },
        body: formData,
      };

      try {
        const response = await fetch(url, options);
        const res = await response.json();
        if (response.ok) {
          // Alert.alert(`Staff Log${action}`, 'sucess');

          if (action === 'in') {
            Device.set('staffId', citizenID);
            Device.save();
          } else {
            Device.set('staffId', '');
            Device.save();
          }

          //re-state
          await this.getStaff();

          if (action === 'out') {
            this.setState({
              staffModal: false,
              citizenID: '',
            });
          } else {
            setTimeout(() => {
              this.setState({
                staffModal: false,
                citizenID: '',
              });
            }, 100);
          }
        }
        this.setState({ messageFromSilverCare: res?.message });
      } catch (e) {
        // Alert.alert('Staff Login', 'fail');
      }
    };
    // back button
    const renderStaffModalBackBtn = () => {
      return (
        <>
          {WidthMoreThenHeight ? (
            <>
              <View style={staffModalStyles.closeContainer}>
                <TouchableOpacity
                  style={staffModalStyles.closeBtn}
                  onPress={() => this.setState({ staffModal: false })}>
                  <FontAwesome
                    name="chevron-left"
                    style={styles.icon}
                    size={30}
                    color="#cfd8dc"
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* <View style={staffModalStyles.closeContainer}> */}
              <View
                style={{
                  position: 'absolute',
                  left: 25,
                  top: width > 400 ? 25 : 10,
                  zIndex: 2,
                }}>
                <TouchableOpacity
                  // style={staffModalStyles.closeBtn}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 50,
                    height: width > 400 ? 70 : 60,
                    width: width > 400 ? 70 : 60,
                    padding: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.setState({ staffModal: false })}>
                  <FontAwesome
                    name="chevron-left"
                    style={styles.icon}
                    size={30}
                    color="#cfd8dc"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      );
    };

    const renderStaffTextInput = () => {
      return (
        <>
          {WidthMoreThenHeight ? (
            <>
              <TextInput
                style={staffModalStyles.textBox}
                ref={(input) => {
                  this.usernameTextInput = input;
                }}
                placeholder={'IDcard'}
                placeholderTextColor="#25316d99"
                returnKeyType="ok"
                onSubmitEditing={() => _onSubmit('in')}
                maxLength={13}
                keyboardType={'number-pad'}
                onChangeText={(text) => this.setState({ citizenID: text })}
                value={citizenID}
              />
            </>
          ) : (
            <>
              <TextInput
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  paddingHorizontal: 30,
                  fontFamily: 'NotoSansThaiUI-Regular',
                  fontSize: width > 400 ? 22 : 16,
                  borderWidth: 1,
                  borderRadius: 25,
                  borderColor: 'rgba(0,0,0,0.1)',
                  marginBottom: 20,
                  color: '#25316D',
                }}
                ref={(input) => {
                  this.usernameTextInput = input;
                }}
                placeholder={'IDcard'}
                placeholderTextColor="#25316d99"
                returnKeyType="ok"
                onSubmitEditing={() => _onSubmit('in')}
                maxLength={13}
                keyboardType={'number-pad'}
                onChangeText={(text) => this.setState({ citizenID: text })}
                value={citizenID}
              />
            </>
          )}
        </>
      );
    };

    const renderResponseMessage = () => {
      return messageFromSilverCare ? (
        <>
          <View style={[styles.errorBox, { paddingLeft: 10 }]}>
            <MaterialIcons name="error-outline" size={25} color="#dc3545" />
            <Text style={[styles.errorText, { fontSize: 18 }]}>
              {messageFromSilverCare}
            </Text>
          </View>
        </>
      ) : null;
    };

    return (
      <Modal animationType="slide" transparent={true} visible={staffModal}>
        <ImageBackground
          source={{ uri: config?.images?.[t('images:loginPage')] }}
          style={staffModalStyles.container}>
          {renderStaffModalBackBtn()}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={staffModalStyles.centerOfRow}>
              <View
                // style={staffModalStyles.loginCard}
                style={{
                  width: WidthMoreThenHeight ? '50%' : '80%',
                  top: WidthMoreThenHeight ? 0 : 20,
                  borderRadius: 30,
                  padding: 20,
                  height: WidthMoreThenHeight ? '90%' : '70%',
                  backgroundColor: 'rgba(250,250,250,0.3)',
                }}>
                <View style={staffModalStyles.animatedView}>
                  <View></View>

                  {!staffDetail?.is_logged_in ? (
                    <>
                      <Text
                        style={[
                          staffModalStyles.TextB30,
                          {
                            fontSize: WidthMoreThenHeight
                              ? 40
                              : width > 400
                              ? 40
                              : 30,
                          },
                        ]}>
                        STAFF LOGIN
                      </Text>
                      <KeyboardAvoidingView
                        behavior="padding"
                        style={{
                          width: WidthMoreThenHeight
                            ? '70%'
                            : width > 400
                            ? '70%'
                            : '90%',
                        }}>
                        {renderStaffTextInput()}

                        {renderResponseMessage()}
                      </KeyboardAvoidingView>

                      <TouchableOpacity
                        onPress={() => _onSubmit('in')}
                        style={staffModalStyles.submitButton}>
                        <Text
                          style={[
                            staffModalStyles.TextB30,
                            {
                              fontSize: WidthMoreThenHeight
                                ? 30
                                : width > 400
                                ? 30
                                : 20,
                            },
                          ]}>
                          Login
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text
                        style={[staffModalStyles.TextB30, { fontSize: 40 }]}>
                        STAFF LOGOUT
                      </Text>

                      <TouchableOpacity
                        onPress={() => _onSubmit('out')}
                        style={staffModalStyles.submitButton}>
                        <Text
                          style={[
                            staffModalStyles.TextB30,
                            {
                              fontSize: WidthMoreThenHeight
                                ? 30
                                : width > 400
                                ? 30
                                : 20,
                            },
                          ]}>
                          Logout
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <View></View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      </Modal>
    );
  }

  // ล็อคอิน บัตรประชาชน
  handleLogin = () => {
    const { navigation, users } = this.props;
    if (users?.length > 0) {
      navigation.navigate('UserLogin', { device: this.state.deviceName });
    } else {
      navigation.navigate('CardIdLogin', { device: this.state.deviceName });
    }
  };
  renderLoginBtn() {
    const { navigation, t } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    return (
      <>
        {window.width > window.height ? (
          <>
            {/* กรอกเลขบัตรแนวนอน */}
            <View style={loginBtn.logInMethodPosition}>
              <TouchableOpacity
                style={[
                  loginBtn.btnBox,
                  { backgroundColor: NEW_COLOR['blue'] },
                ]}
                onPress={this.handleLogin}>
                <Text style={loginBtn.btnText}>
                  {t('buttons:idcard3')}
                  <Text style={loginBtn.btnTextBold}> {t('buttons:here')}</Text>
                </Text>
                <View style={loginBtn.btnBoxImg}>
                  <ImageButton
                    width={40}
                    height={40}
                    source={require('../../assets/buttons/dc_1.png')}
                    onPress={this.handleLogin}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* สแกน qr */}
            <View style={loginBtn.QRCodePosition}>
              <TouchableOpacity
                style={[loginBtn.btnBox, { backgroundColor: NEW_COLOR['red'] }]}
                onPress={() =>
                  navigation.push('Camera', { device: this.state.deviceName })
                }>
                <Text style={loginBtn.btnText}>
                  {t('buttons:qrcode3')}
                  <Text style={loginBtn.btnTextBold}> {t('buttons:here')}</Text>
                </Text>
                <View style={loginBtn.btnBoxImg}>
                  <TouchableOpacity
                    style={imgBtn.btn}
                    onPress={() =>
                      navigation.push('Camera', {
                        device: this.state.deviceName,
                      })
                    }>
                    <Image
                      style={imgBtn.img}
                      source={require('../../assets/buttons/qr-code-3.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 30,
                width: window.width > window.height ? '25%' : '50%',
                right: window.width > window.height ? 30 : '25%',
                zIndex: 1,
              }}>
              <Text style={loginBtn.devicesText}>
                Device Name : {this.state.deviceName}
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* กรอกเลขบัตรแนวตั้ง */}
            {/* <View style={loginBtn.logInMethodPosition}> */}
            <View
              style={{
                position: 'absolute',
                top: window.height * 0.35,
                right: window.width * 0.1,
                width: window.width * 0.8,
                zIndex: 1,
              }}>
              <TouchableOpacity
                // style={[
                //   loginBtn.btnBox,
                //   { backgroundColor: NEW_COLOR['blue'] },
                // ]}
                style={{
                  backgroundColor: NEW_COLOR['blue'],
                  flex: 1,
                  flexDirection: 'row-reverse',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 50,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
                onPress={this.handleLogin}>
                {/* <Text style={loginBtn.btnText}> */}
                <Text
                  style={{
                    marginLeft: window.width * 0.03,
                    marginRight: window.width * 0.08,
                    fontSize: 20,
                    color: 'white',
                    fontFamily: 'LINESeedSansTH_A_Rg',
                  }}>
                  {t('buttons:idcard3')}
                  {/* <Text style={loginBtn.btnTextBold}> {t('buttons:here')}</Text> */}
                </Text>
                <View style={loginBtn.btnBoxImg}>
                  <ImageButton
                    width={window.width > 400 ? 40 : 30}
                    height={window.width > 400 ? 40 : 30}
                    source={require('../../assets/buttons/dc_1.png')}
                    onPress={this.handleLogin}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* สแกน qr */}
            {/* <View style={loginBtn.QRCodePosition}> */}
            <View
              style={{
                position: 'absolute',
                top: window.height * 0.4,
                paddingVertical: 35,
                right: window.width * 0.1,
                width: window.width * 0.8,
                zIndex: 1,
              }}>
              <TouchableOpacity
                // style={[loginBtn.btnBox, { backgroundColor: NEW_COLOR['red'] }]}
                style={{
                  backgroundColor: NEW_COLOR['red'],
                  flex: 1,
                  flexDirection: 'row-reverse',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 50,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
                onPress={() =>
                  navigation.push('Camera', { device: this.state.deviceName })
                }>
                {/* <Text style={loginBtn.btnText}> */}
                <Text
                  style={{
                    marginLeft: window.width * 0.03,
                    marginRight: window.width * 0.205,
                    fontSize: 20,
                    color: 'white',
                    fontFamily: 'LINESeedSansTH_A_Rg',
                  }}>
                  {t('buttons:qrcode3')}
                  {/* <Text style={loginBtn.btnTextBold}> {t('buttons:here')}</Text> */}
                </Text>
                <View style={loginBtn.btnBoxImg}>
                  <TouchableOpacity
                    style={{
                      width: window.width > 400 ? 40 : 30,
                      height: window.width > 400 ? 40 : 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.push('Camera', {
                        device: this.state.deviceName,
                      })
                    }>
                    <Image
                      style={{
                        width: '80%',
                        height: '80%',
                        resizeMode: 'stretch',
                      }}
                      source={require('../../assets/buttons/qr-code-3.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: window.height * 0.026,
                width: window.width * 0.55,
                right: window.width * 0.235,
                zIndex: 1,
              }}>
              <Text style={loginBtn.devicesText}>
                Device Name : {this.state.deviceName}
              </Text>
            </View>
          </>
        )}
      </>
    );
  }

  render() {
    const {
      navigation,
      t,
      config,
      sos,
      sendSOS,
      sendSOSClear,
      staffdetail,
    } = this.props;
    const {
      staff,
      staffDetail,
      dimensions: { window },
    } = this.state;

    const loginStaffFeature = config?.features?.staff;
    return (
      <View style={styles.container}>
        <View style={styles.webBlk}>
          <Image
            // source={{ uri: config.images?.[t('images:homePage')] }}
            source={
              window.width > window.height
                ? { uri: config.images?.[t('images:homePage')] }
                : { uri: bgimgVertical }
            }
            style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
          />
        </View>
        <View style={styles.menuBtnPosition}>
          {/* staff block */}
          {loginStaffFeature ? (
            <StaffBlock
              staffDetail={staffDetail}
              onPress={() => this.setState({ staffModal: true })}
            />
          ) : null}
        </View>
        {this.renderSOSBtn()}
        {this.renderLoginBtn()}
        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'slide'}
          transparent
          visible={this.state.SOSModalVisible}>
          <SOSModalView
            sos={sos}
            sosConfig={config?.features?.sos}
            onSendSOS={sendSOS}
            onClose={() => {
              this.setState({ SOSModalVisible: false });
              sendSOSClear();
            }}
          />
        </Modal>

        {/* staff modal */}
        {loginStaffFeature ? this.renderStaffLoginModal() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webBlk: {
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    marginTop: 5,
  },
  errorText: {
    fontFamily: 'LINESeedSansTH_A_Rg',
    marginLeft: 5,
    marginTop: 2,
    color: '#dc3545',
  },
  menuBtnPosition: {
    position: 'absolute',
    flexDirection: 'row',
    top: 15,
    left: 220,
    zIndex: 1,
  },
});

const staffModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: NEW_COLOR['blue'],
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backbutton: {
    position: 'absolute',
    top: 20,
    left: 30,
  },
  centerOfRow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginCard: {
    width: '50%',
    borderRadius: 30,
    padding: 20,
    height: '90%',
    backgroundColor: 'rgba(250,250,250,0.3)',
  },
  animatedView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  logoCover: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  actionZone: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  inputView: {
    width: '70%',
  },
  submitButton: {
    borderRadius: 30,
    width: 200,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    fontFamily: 'NotoSansThaiUI-Regular',
    fontSize: 22,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 20,
    color: '#25316D',
  },
  closeContainer: {
    position: 'absolute',
    left: 25,
    top: 25,
    zIndex: 2,
  },
  closeBtn: {
    backgroundColor: 'white',
    borderRadius: 50,
    height: 70,
    width: 70,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //text
  TextB30: {
    fontFamily: 'NotoSansThaiUI-Regular',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#25316D',
  },
});
const sosBtn = StyleSheet.create({
  emergencyBtnPostion: {
    position: 'absolute',
    flexDirection: 'row',
    top: 15,
    left: 110,
    zIndex: 1,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 50,
  },
  emergencyBtnBorder: {
    backgroundColor: '#FF0000',
    borderRadius: 50,
    padding: 5,
  },
});

const imgBtn = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});

const loginBtn = StyleSheet.create({
  logInMethodPosition: {
    position: 'absolute',
    top: 15,
    right: 25,
    zIndex: 1,
  },
  QRCodePosition: {
    position: 'absolute',
    top: 100,
    right: 25,
    zIndex: 1,
  },
  btnBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  btnBoxImg: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  btnText: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    color: 'white',
    fontFamily: 'LINESeedSansTH_A_Rg',
  },
  btnTextBold: {
    fontSize: 25,
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  devicePostition: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    zIndex: 1,
  },
  devicesText: {
    backgroundColor: NEW_COLOR['gray'],
    color: 'gray',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    fontFamily: 'LINESeedSansTH_A_Bd',
    textAlign: 'center',
  },
});
