import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Col, Row } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../../../components/buttons/BackButton';
import { CardBox, UserBlock } from '../component/FormItem';
import { colors } from '../../../styles';
//form
import EldHForm_1 from './eldHForm/EldHForm_1';
import EldHForm_2 from './eldHForm/EldHForm_2';
import EldHForm_3 from './eldHForm/EldHForm_3';
import EldHForm_4 from './eldHForm/EldHForm_4';
import EldHForm_5 from './eldHForm/EldHForm_5';
import EldHForm_6 from './eldHForm/EldHForm_6';
import EldHForm_6_1 from './eldHForm/EldHForm_6_1';
import EldHForm_7 from './eldHForm/EldHForm_7';
import EldHForm_7_1 from './eldHForm/EldHForm_7_1';
import EldHForm_8 from './eldHForm/EldHForm_8';
import EldHForm_9 from './eldHForm/EldHForm_9';
import EldHForm_10 from './eldHForm/EldHForm_10';
import { MHW_API_KEY, MHW_HOST, MHW_HOST_V2 } from '../../../utils/constants';
import { ActivityIndicator, Button, Modal } from 'react-native-paper';
import { fetchUser } from '../../../redux/actions/authentication';
import store from '../../../redux/stores';
import { async } from 'rxjs';
import moment from 'moment';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const partList = [
  { title: 'ส่วนที่ 1 ข้อมูลพื้นฐาน', id: 'EldHForm_1' },
  { title: 'ส่วนที่ 2 แบบคัดกรองสภาวะสุขภาพ', id: 'EldHForm_2' },
  { title: 'ส่วนที่ 3 ความเสี่ยงต่อโรคหัวใจและหลอดเลือด', id: 'EldHForm_3' },
  { title: 'ส่วนที่ 4 แบบคัดกรองสุขภาพตา', id: 'EldHForm_4' },
  { title: 'ส่วนที่ 5 การประเมินสุขภาพช่องปาก', id: 'EldHForm_5' },
  {
    title: 'ส่วนที่ 6 การประเมินความสามารถในการทํากิจวัตรประจําวัน',
    id: 'EldHForm_6',
  },
  { title: 'ส่วนที่ 7 การประเมินภาวะสมองเสื่อม', id: 'EldHForm_7' },
  { title: 'ส่วนที่ 8 การคัดกรองโรคซึมเศร้า', id: 'EldHForm_8' },
  { title: 'ส่วนที่ 9 สุขภาพกระดูกและกล้ามเนื้อ', id: 'EldHForm_9' },
  { title: 'ส่วนที่ 10 การคัดกรองการกลั้นปัสสาวะ', id: 'EldHForm_10' },
  {
    title: 'TAI Classified',
    id: 'EldHForm_6_1',
  },
  {
    title: 'MMSE-Thai 2002',
    id: 'EldHForm_7_1',
  },
  // { title: 'ดูผลการประเมิน' },
];

const initialState = {
  partId: partList[0].id,
  partName: partList[0].title,
};

class EldHScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      ...initialState,
      dimensions: {
        window: {
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
        },
        screen: screenDimensions,
        show: false,
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
  }

  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  }

  _handleFormChange = (value) => {
    this.setState({ [value.formName]: { value } });
  };

  _saveData = async (partId) => {
    const { authentication, currentuser, t, config } = this.props;

    const value = this.state?.[partId]?.value;
    // const validate = !!(
    //   value?.['EldHForm_1']?.value?.length &&
    //   value?.['EldHForm_2']?.value?.length &&
    //   value?.['EldHForm_3']?.value?.length &&
    //   value?.['EldHForm_4']?.value?.length &&
    //   value?.['EldHForm_5']?.value?.length &&
    //   value?.['EldHForm_6']?.value?.length &&
    //   value?.['EldHForm_7']?.value?.length &&
    //   value?.['EldHForm_8']?.value?.length &&
    //   value?.['EldHForm_9']?.value?.length &&
    //   value?.['EldHForm_10']?.value?.length
    // );
    // console.log(validate);
    if (!value) {
      Alert.alert('Save Data', 'กรุณาตอบแบบฟอร์มอย่างน้อย 1 ข้อ', [
        {
          text: 'ตกลง',
        },
      ]);
      return null;
    }

    delete value?.formName;
    delete value?.namePrefix_input_show;
    delete value?.job_input_show;
    delete value?.access_to_treatment_input_show;
    delete value?.mmse_2_1_show;
    delete value?.mmse_2_2_show;
    delete value?.mmse_4_1_choice_show;
    delete value?.mmse_4_2_choice_show;
    delete value?.education;
    delete value?.hasAbstainingFood_input_show;
    delete value?.walkingForm_input_show;
    delete value?.equipmentForm_show;
    delete value?.stiffnessFormSide_show;
    delete value?.crepitusFormSide_show;
    delete value?.bonyTendernessFormSide_show;
    delete value?.bonyEnlargementFormSide_show;
    delete value?.noPalpableWarmthFormSide_show;
    delete value?.congenital_disease_other_show;
    delete value?.Q9_show;
    delete value?.form_9_2_show;
    delete value?.form_9_3_show;
    delete value?.step;
    delete value?.temp;
    delete value?.specifyAddr;

    const url = `${MHW_HOST}/mobileservice/mhceldHadd`;
    const formData = new FormData();
    formData.append('idcard', currentuser?.idcard);
    formData.append('partnerid', config?.config?.partner?.partnerid);
    formData.append('formName', partId);
    formData.append('value', JSON.stringify(value));

    const options = {
      method: 'POST',
      headers: {
        Authorization: authentication?.token,
        'X-API-KEY': MHW_API_KEY,
      },
      body: formData,
    };

    Alert.alert('Save Data', 'ต้องการบันทึกข้อมูลหรือไม่', [
      {
        text: 'ยกเลิก',
        // onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'ตกลง',
        onPress: async () => {
          // loading true
          try {
            const response = await fetch(url, options);
            const resmessage = await response.json();
            resmessage.ok
              ? this.setState({ modalVisible: true, modalType: 'success' })
              : this.setState({ modalVisible: true, modalType: 'fail' });
          } catch (e) {
            console.error(e);
          }
          // loading false
        },
        style: 'confirm',
      },
    ]);
  };

  _updateUserDetail = async () => {
    const { currentuser, authentication } = this.props;
    const {
      idcard,
      namePrefix,
      name,
      surname,
      dob,
      gender,
      tel,
      addrID,
      alley,
      road,
      district,
      village,
      amphoe,
      province,
      addrID_current_cur,
      alley_current_cur,
      road_current_cur,
      district_current_cur,
      village_current_cur,
      amphoe_current_cur,
      province_current_cur,
      currentAddr,
    } = this.state?.EldHForm_1?.value;
    const addr = {
      no: addrID?.value,
      alley: alley?.value,
      road: road?.value,
      subdistrict: district?.value,
      village: village?.value,
      district: amphoe?.value,
      province: province?.value,
    };
    const cur_addr = {
      no: addrID_current_cur?.value,
      alley: alley_current_cur?.value,
      road: road_current_cur?.value,
      subdistrict: district_current_cur?.value,
      village: village_current_cur?.value,
      district: amphoe_current_cur?.value,
      province: province_current_cur?.value,
    };

    gender?.value === 'ชาย' ? (sex = 'male') : (sex = 'female');

    try {
      // const url = `${MHW_HOST_V2}/mobile/mhcgetuserdetail`;
      const url = `${MHW_HOST_V2}/mobile/mhcupdateuserdetail`;
      const formData = new FormData();
      formData.append('userid', currentuser?.userid);
      formData.append('idcard', idcard?.value);
      formData.append('prefix', namePrefix?.value);
      formData.append('fname', name?.value);
      formData.append('lname', surname?.value);
      formData.append('dob', moment(dob?.value).format('YYYY-MM-DD'));
      formData.append('gender', sex);
      formData.append('tel', tel?.value);
      formData.append('addr', JSON.stringify(addr));
      currentAddr?.value === 'ไม่ใช่' &&
        formData.append('cur_addr', JSON.stringify(cur_addr));

      const options = {
        method: 'POST',
        body: formData,
      };
      const response = await fetch(url, options);
      const resmessage = await response.json();
    } catch (e) {
      console.error(e);
    }
  };
  goBack = () => {
    const { navigation } = this.props;
    navigation.replace('MainScreen');
  };
  showCancel = () => {
    this.setState({ show: true });
  };
  renderTouchableHighlight() {
    if (this.state.show) {
      return <Text>Cancel</Text>;
    }
    return null;
  }
  renderHeader() {
    const { authentication, currentuser } = this.props;
    const {
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;

    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            <View style={styles.header}>
              <View style={styles.backButtonContainer}>
                <BackButton onPress={() => this.goBack()} />
              </View>
              <Text style={[commonStyles.textTitle, { color: '#fff' }]}>
                ระบบคัดกรองสุขภาพผู้สูงอายุ
              </Text>
              <UserBlock
                authentication={authentication}
                currentuser={currentuser}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <View
                style={{ position: 'absolute', left: 20, top: 0, zIndex: 1 }}>
                <BackButton onPress={() => this.goBack()} />
              </View>
              <View
                style={{
                  left: width * 0.05,
                  paddingHorizontal: 20,
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={[
                    commonStyles.textTitle,
                    { color: '#fff', width: width * 0.65 },
                  ]}>
                  ระบบคัดกรองสุขภาพผู้สูงอายุ
                </Text>
              </View>
            </View>
          </>
        )}
      </>
    );
  }

  renderForm() {
    const { partId } = this.state;
    const { config, user, currentuser, authentication } = this.props;
    let gender = this.state?.EldHForm_1?.value?.gender?.value;

    // if (user?.gender) {
    //   if (
    //     user?.gender === 'ชาย' ||
    //     user?.gender === 'male' ||
    //     user?.gender === 'Male'
    //   ) {
    //     gender = 'ชาย';
    //   } else if (
    //     user?.gender === 'หญิง' ||
    //     user?.gender === 'female' ||
    //     user?.gender === 'Female'
    //   ) {
    //     gender = 'หญิง';
    //   } else {
    //     console.log('no user gender');
    //   }
    // } else if (gender) {
    //   if (gender === 'ชาย' || gender === 'male') {
    //     gender = 'ชาย';
    //   } else if (gender === 'หญิง' || gender === 'female') {
    //     gender = 'หญิง';
    //   } else {
    //     console.log('no state gender');
    //   }
    // }

    // gender = gender
    //   ? gender
    //   : user?.gender === 'male'
    //   ? 'ชาย'
    //   : 'หญิง';

    switch (partId) {
      case 'EldHForm_1':
        return (
          <EldHForm_1
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_1?.value}
            partnerid={config?.config?.partner?.partnerid}
            authentication={this.props?.authentication}
            user={this.props?.currentuser}
            healthdata={this.props}
            gender={gender}
          />
        );
      case 'EldHForm_2':
        return (
          <EldHForm_2
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_2?.value}
            gender={this.state?.EldHForm_1?.value?.gender?.value}
          />
        );
      case 'EldHForm_3':
        return (
          <EldHForm_3
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_3?.value}
            waistLength={this.state?.EldHForm_2?.value?.waistLengthForm?.value}
            height={this.state?.EldHForm_2?.value?.height?.value}
          />
        );
      case 'EldHForm_4':
        return (
          <EldHForm_4
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_4?.value}
          />
        );
      case 'EldHForm_5':
        return (
          <EldHForm_5
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_5?.value}
          />
        );
      case 'EldHForm_6':
        return (
          <EldHForm_6
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_6?.value}
          />
        );
      case 'EldHForm_6_1':
        return (
          <EldHForm_6_1
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_6_1?.value}
          />
        );
      case 'EldHForm_7':
        return (
          <EldHForm_7
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_7?.value}
          />
        );
      case 'EldHForm_7_1':
        return (
          <EldHForm_7_1
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_7_1?.value}
            education={this.state?.EldHForm_1?.value?.education?.value}
          />
        );
      case 'EldHForm_8':
        return (
          <EldHForm_8
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_8?.value}
          />
        );
      case 'EldHForm_9':
        return (
          <EldHForm_9
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_9?.value}
          />
        );
      case 'EldHForm_10':
        return (
          <EldHForm_10
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_10?.value}
          />
        );
      default:
        return (
          <EldHForm_1
            onFormChange={this._handleFormChange}
            state={this.state?.EldHForm_1?.value}
          />
        );
    }
  }

  renderBottom() {
    const { partId, partName } = this.state;
    return (
      <View style={{ backgroundColor: '#347ec7', borderRadius: 10 }}>
        <TouchableOpacity
          onPress={async () => {
            this._saveData(partId, partName);
            if (partId === 'EldHForm_1') {
              await this._updateUserDetail();
            }
          }}
          style={styles.btn}>
          <Button>
            <Text style={modalStyles.btnText}>SAVE</Text>
          </Button>
        </TouchableOpacity>
      </View>
    );
  }

  renderContent() {
    const { partId, partName } = this.state;
    const {
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;

    const renderButton = (type) => {
      const { partId, partName, btnSave } = this.state;

      const disabledBtn = type === 'save';

      return (
        <View style={commonStyles.btnBox}>
          <View
            style={{
              backgroundColor:
                type === 'save'
                  ? btnSave
                    ? '#347ec7' + 'aa'
                    : '#347ec7'
                  : btnSave
                  ? colors.info + 'aa'
                  : colors.info,
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                type === 'save' ? this._saveData() : this._saveData();
              }}
              // disabled={!btnSave}
            >
              <Button>
                {type === 'save' ? (
                  <Text style={modalStyles.btnText}>SAVE</Text>
                ) : (
                  <Text style={[modalStyles.btnText, { fontSize: 18 }]}>
                    SUMMARY
                  </Text>
                )}
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      //แนวนอน
      <>
        {WidthMoreThenHeight ? (
          <>
            <Row style={styles.contentContainer}>
              <Col size={1} style={styles.partListZone}>
                <ScrollView style={styles.partListScrollView}>
                  <View style={styles.partListContainer}>
                    {partList.map((element, i) => (
                      <React.Fragment key={i}>
                        <TouchableOpacity
                          style={[
                            commonStyles.cardBox,
                            {
                              backgroundColor:
                                partId === element.id ? colors.blue : 'white',
                            },
                          ]}
                          onPress={() =>
                            this.setState({
                              partId: element?.id,
                              partName: element?.title,
                            })
                          }>
                          <Text
                            style={[
                              commonStyles.textSubTitle,
                              {
                                width: '80%',
                                color:
                                  partId === element.id
                                    ? 'white'
                                    : colors.textMuted,
                              },
                            ]}>
                            {element.title}
                          </Text>
                        </TouchableOpacity>
                      </React.Fragment>
                    ))}
                  </View>
                </ScrollView>
                {/* {renderButton('summary')}
          {renderButton('save')} */}
              </Col>

              <Col size={3} style={styles.contentActionZone}>
                <KeyboardAvoidingView
                  style={styles.KeyboardAvoidingViewContainer}>
                  <ScrollView style={{ paddingHorizontal: 20 }}>
                    <CardBox text={partName} />
                    {this.renderForm()}
                    {this.renderBottom()}
                  </ScrollView>
                </KeyboardAvoidingView>
              </Col>
            </Row>
          </>
        ) : (
          //แนวตั้ง
          <>
            <Row style={{ justifyContent: 'space-around' }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  zIndex: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.blue,
                    paddingHorizontal: 30,
                    height: 45,
                    width: width,
                    borderBottomLeftRadius: 35,
                    borderBottomRightRadius: 35,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                  }}
                  onPress={this.showCancel}>
                  <Image
                    source={require('../../../assets/icons/arrow-down.png')}
                    style={{ paddingHorizontal: 20, height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: 'bold',
                      paddingLeft: 20,
                    }}>
                    คำถามแบบบันทึก
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.show ? (
                <>
                  <View
                    size={1}
                    style={{
                      flexDirection: 'column',
                      backgroundColor: colors.blue,
                      paddingTop: 60,
                      width: width * 0.4,
                    }}>
                    <ScrollView style={styles.partListScrollView}>
                      <View style={styles.partListContainer}>
                        {partList.map((element, i) => (
                          <React.Fragment key={i}>
                            <TouchableOpacity
                              style={[
                                commonStyles.cardBox,
                                {
                                  backgroundColor:
                                    partId === element.id
                                      ? colors.blue
                                      : 'white',
                                  borderColor: '#fff',
                                  borderWidth: 1,
                                },
                              ]}
                              onPress={() =>
                                this.setState({
                                  partId: element?.id,
                                  partName: element?.title,
                                  show: false,
                                })
                              }>
                              <Text
                                style={[
                                  commonStyles.textSubTitle,
                                  {
                                    width: '80%',
                                    color:
                                      partId === element.id
                                        ? 'white'
                                        : colors.textMuted,
                                  },
                                ]}>
                                {element.title}
                              </Text>
                            </TouchableOpacity>
                          </React.Fragment>
                        ))}
                      </View>
                    </ScrollView>
                    {/* {renderButton('summary')}
          {renderButton('save')} */}
                  </View>
                </>
              ) : null}
              <Col size={3} style={styles.contentActionZone}>
                <KeyboardAvoidingView
                  style={{
                    flex: 1,
                    paddingVertical: 60,
                    flexDirection: 'column',
                    borderRadius: 10,
                  }}>
                  <ScrollView style={{ paddingHorizontal: 20 }}>
                    <CardBox text={partName} />
                    {this.renderForm()}
                    {this.renderBottom()}
                  </ScrollView>
                </KeyboardAvoidingView>
              </Col>
            </Row>
          </>
        )}
      </>
    );
  }

  renderModal() {
    const { modalVisible, modalType } = this.state;

    return (
      <Modal
        presentationStyle={'overFullScreen'}
        animationType={'slide'}
        transparent
        visible={modalVisible}>
        <View style={modalStyles.modalContainer}>
          {modalType === 'success' ? (
            <>
              <Text style={modalStyles.title}>Success</Text>
              <FontAwesome
                name="check-circle"
                style={modalStyles.iconSontainer}
                size={100}
                color={colors.success}
              />
            </>
          ) : (
            <>
              <Text style={[modalStyles.title, { color: colors.danger }]}>
                Fail !!
              </Text>
              <FontAwesome
                name="times-circle"
                style={modalStyles.iconSontainer}
                size={100}
                color={colors.danger}
              />
            </>
          )}

          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: !modalVisible })}
            style={[
              modalStyles.btn,
              {
                backgroundColor:
                  modalType === 'success' ? colors.success : colors.danger,
              },
            ]}>
            <Text style={modalStyles.btnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderModal()}
      </View>
    );
  }
}

const CARD_HEIGHT = SCREEN_HEIGHT - 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'green',
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    backgroundColor: colors.blue,
  },
  contentContainer: {
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  partListZone: {
    // backgroundColor: 'lightgrey',
  },
  partListScrollView: {
    paddingHorizontal: 10,
  },
  partListContainer: {
    paddingVertical: 10,
  },
  contentActionZone: {
    // backgroundColor: 'skyblue',
  },

  //------
  KeyboardAvoidingViewContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'column',
    borderRadius: 10,
  },

  //---------------
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    top: 0,
  },

  formBodyScrollViewContainer: {
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'column',
    borderRadius: 10,
  },
  formHeaderContainer: {
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  formBodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  //------
  formTitleContainer: {
    padding: 10,
  },

  //-----------------
  itemLabelBox: {
    padding: 10,
    marginTop: 10,
  },
  itemInputBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  itemRadioBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTimeBox: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemInputListRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  //-------------
  itemInputListButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
});

const commonStyles = StyleSheet.create({
  titleCardBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },

  cardBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },

  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
  },

  btnBox: {
    marginBottom: 10,
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingHorizontal: 80,
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconSontainer: {
    margin: 20,
    marginBottom: 30,
  },
  btn: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.success,
  },
});

export default EldHScreen;
