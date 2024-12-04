import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageButton from '../../components/buttons/ImageButton';
import IDCard from '../../assets/buttons/dc_1.png';
import {
  MHW_API_KEY,
  NEW_COLOR,
  TRANSLATE_BUTTON_IMAGES,
} from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';
import { imgSponsor } from '../../utils/assetsURL';
import WebView from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';
import { Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { event } from 'react-native-reanimated';
import * as dbconfig from '../../utils/dbconfig';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default class CardIdLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      haveError: false,
      SOSModalVisible: false,
      dimensions: {
        window: {
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
        },
        screen: screenDimensions,
      },
      registerIDCard: false,
      registerIDCardQR: false,
      registerIDCardDevice: false,
      cardidview: false,
      refreshing: false,
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

  componentDidUpdate(prevProps) {
    const { errorMsg } = this.props;
    if (prevProps.errorMsg !== errorMsg) {
      this._errMessageHandler();
    }
  }

  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
    this.setState({
      id: 0,
      haveError: false,
    });
  }
  _onSubmit = () => {
    const { handleSubmit } = this.props;
    const { id } = this.state;
    if (id) {
      handleSubmit(id);
    }
  };
  _errMessageHandler = () => {
    const { errorMsg, t, navigation } = this.props;
    const device = navigation.getParam('device');

    if (errorMsg) {
      this.setState({ haveError: true });
      this.setState({ cardidview: true });
      // Alert.alert(
      //   t('RegisterIDcard:messageRegisterIDHeader'),
      //   t('RegisterIDcard:messageRegisterIDContent'),
      //   [
      //     {
      //       text: t('common:no'),
      //       style: 'cancel',
      //       onPress: () => {
      //         navigation.goBack();
      //       },
      //     },
      //     {
      //       text: t('common:yes'),
      //       onPress: () => {
      //         this.setState({ registerIDCard: true });
      //       },
      //     },
      //   ],
      //   { cancelable: true },
      // );
    }
  };

  renderErrMessage() {
    const {
      haveError,
      dimensions: { window },
    } = this.state;
    const { errorMsg, t } = this.props;
    const WidthMoreThenHeight = window.width > window.height;

    if (haveError) {
      return (
        <>
          {WidthMoreThenHeight ? (
            <>
              <View style={styles.errorBox}>
                <MaterialIcons name="error-outline" size={30} color="#dc3545" />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.errorText, { fontSize: 16 }]}>
                      {t('cardIdloginScreen:note')} :
                    </Text>
                    <Text style={[styles.errorText, { fontSize: 16 }]}>
                      {t('cardIdloginScreen:noteMessage')}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.errorBox,
                  {
                    padding: 10,
                    width: window.width * 0.9,
                    top: window.height * 0.1,
                  },
                ]}>
                <MaterialIcons name="error-outline" size={20} color="#dc3545" />
                <View
                  style={{
                    flexDirection: 'column',
                    width: window.width * 0.7,
                  }}>
                  <Text style={[styles.errorText, { fontSize: 14 }]}>
                    {errorMsg}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', width: window.width * 0.6 }}>
                    <Text style={[styles.errorText, { fontSize: 12 }]}>
                      {t('cardIdloginScreen:note')} :
                    </Text>
                    <Text style={[styles.errorText, { fontSize: 12 }]}>
                      {t('cardIdloginScreen:noteMessage')}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      );
    }
    return null;
  }
  openRegister = () => {
    const { navigation, t, config } = this.props;
    const { id } = this.state;
    const partnerid = config?.partner?.partnerid;
    const url = `https://telereserve.myhealthgroup.net/consent/default/web/form?idcard=${id}&partnerid=${partnerid}&product=mhc`;
    // const url = `https://telereserve.myhealthgroup.net/consent/default/web/form`;
    // const url = 'https://telereserve.myhealthgroup.net/register/mhc/complete';
    navigation.navigate('Web', { url });
    this.setState({ cardidview: false });
  };
  // ล็อคอิน บัตรประชาชน
  handleLogin = () => {
    const { navigation, users } = this.props;
    const device = navigation.getParam('device');
    if (users?.length > 0) {
      navigation.navigate('UserLogin', { device: device });
    } else {
      navigation.navigate('CardIdLogin', { device: device });
    }
  };
  renderLoginBtn() {
    const { navigation, t } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const device = navigation.getParam('device');
    const WidthMoreThenHeight = window.width > window.height;

    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            {/* ปุ่มกรอกเลขบัตรแนวนอน */}
            <View style={loginBtn.logInMethodPosition}>
              <TouchableOpacity
                style={[
                  loginBtn.btnBox,
                  { backgroundColor: NEW_COLOR['gray'] },
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
            <View style={loginBtn.QRCodePosition}>
              <TouchableOpacity
                style={[
                  loginBtn.btnBox,
                  { backgroundColor: NEW_COLOR['red']},
                ]}
                onPress={() => navigation.push('Camera', { device: device })}>
                <Text style={loginBtn.btnText}>
                  {t('buttons:qrcode3')}
                  <Text style={loginBtn.btnTextBold}> {t('buttons:here')}</Text>
                </Text>
                <View style={loginBtn.btnBoxImg}>
                  <TouchableOpacity
                    style={imgBtn.btn}
                    onPress={() =>
                      navigation.push('Camera', { device: device })
                    }>
                    <Image
                      style={imgBtn.img}
                      source={require('../../assets/buttons/qr-code-3.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            <View style={loginBtn.devicePostition}>
              <Text style={loginBtn.devicesText}>Device Name : {device}</Text>
            </View>
          </>
        ) : (
          <>
            {/* ปุ่มกรอกเลขบัตรแนวตั้ง */}
            {/* <View style={loginBtn.logInMethodPosition}> */}
            <View
              style={{
                position: 'absolute',
                top: window.height * 0.6,
                right: window.width * 0.1,
                width: window.width * 0.8,
                zIndex: 1,
              }}>
              <TouchableOpacity
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
            {/* <View style={loginBtn.QRCodePosition}> */}
            <View
              style={{
                position: 'absolute',
                top: window.height * 0.7,
                right: window.width * 0.1,
                width: window.width * 0.8,
                zIndex: 1,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: NEW_COLOR['gray'],
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
                onPress={() => navigation.push('Camera', { device: device })}>
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
                    // style={imgBtn.btn}
                    style={{
                      width: window.width > 400 ? 40 : 30,
                      height: window.width > 400 ? 40 : 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      navigation.push('Camera', { device: device })
                    }>
                    <Image
                      style={imgBtn.img}
                      source={require('../../assets/buttons/qr-code-3.png')}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            {/* <View style={loginBtn.devicePostition}> */}
            <View
              style={{
                // position: 'absolute',
                bottom: window.height * 0.01,
                width: window.width * 0.55,
                left: window.width * 0.235,
                // zIndex: 1,
              }}>
              <Text style={loginBtn.devicesText}>Device Name : {device}</Text>
            </View>
          </>
        )}
      </>
    );
  }

  render() {
    const { navigation, t, config } = this.props;
    const {
      dimensions: { window },
      registerIDCard,
      registerIDCardQR,
      registerIDCardDevice,
      cardidview,
      authentication,
      id,
      refreshing,
    } = this.state;
    const features = dbconfig.mainScreenActionButtons(config);
    const device = navigation.getParam('device');
    const partnerid = config?.partner?.partnerid;
    const url = `https://telereserve.myhealthgroup.net/consent/default/web/form?idcard=${id}&partnerid=${partnerid}&product=mhc`;
    const WidthMoreThenHeight = window.width > window.height;
    const complete = 'http://192.168.5.102:8111/consent/default/web/form';
    const isHeaders = navigation.getParam('isHeaders', false);
    if (isHeaders) {
      source.headers = {
        Authorization: authentication.token,
        'X-API-KEY': MHW_API_KEY,
      };
    }
    return (
      <>
        {cardidview ? (
          <>
            {WidthMoreThenHeight ? (
              <>
                <View style={styles.registerIDCard}>
                  <View style={[styles.loginMethodPosition, { top: -10 }]}>
                    <BackButton
                      onPress={() => {
                        navigation.navigate('UserLogin', {
                          device: device,
                        });
                        navigation.navigate('CardIdLogin', {
                          device: device,
                        });
                      }}
                    />
                  </View>
                  {this.renderErrMessage()}
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <>
                      <View
                        style={{
                          flex: 1,
                          borderRightWidth: 5,
                          borderRightColor: '#000',
                          borderRightStyle: 'solid',
                          height: '80%',
                        }}>
                        <View style={styles.QRCode}>
                          <Text style={styles.text}>
                            {t('RegisterIDcard:textscanqrcode')}
                          </Text>
                          <QRCode
                            value={url}
                            size={350}
                            logoSize={60}
                            logoBackgroundColor="transparent"
                          />
                        </View>
                      </View>
                    </>
                    <>
                      <View style={{ flex: 1 }}>
                        <View style={styles.QRCode}>
                          <Image
                            source={{
                              uri:
                                'https://telereserve.myhealthgroup.net/asset/image/mhf-icon.png',
                            }}
                            style={{
                              width: 110,
                              height: 100,
                              resizeMode: 'stretch',
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: 'LINESeedSansTH_A_Rg',
                              fontSize: 20,
                            }}>
                            {t('cardIdloginScreen:messageLogin')}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.textNumIdcardMargin,
                              {
                                backgroundColor: NEW_COLOR['blue'],
                                width: '80%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}
                            onPress={() => {
                              navigation.navigate('UserLogin', {
                                device: device,
                              });
                              navigation.navigate('CardIdLogin', {
                                device: device,
                              });
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontFamily: 'LINESeedSansTH_A_Bd',
                                fontSize: 20,
                              }}>
                              {t('cardIdloginScreen:login')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.textNumIdcardMargin,
                              {
                                backgroundColor: '#fff',
                                width: '80%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: NEW_COLOR['blue'],
                              },
                            ]}
                            onPress={() => this.openRegister()}>
                            <Text
                              style={{
                                color: NEW_COLOR['blue'],
                                fontFamily: 'LINESeedSansTH_A_Bd',
                                fontSize: 20,
                              }}>
                              {t('cardIdloginScreen:register')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.registerIDCard}>
                  <View style={[styles.loginMethodPosition, { top: -20 }]}>
                    <BackButton
                      onPress={() => {
                        navigation.navigate('UserLogin', {
                          device: device,
                        });
                        navigation.navigate('CardIdLogin', {
                          device: device,
                        });
                      }}
                    />
                  </View>
                  {this.renderErrMessage()}
                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 1,
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: 5,
                          borderBottomColor: '#000',
                          borderBottomStyle: 'solid',
                          width: '80%',
                        }}>
                        <View style={styles.QRCode}>
                          <Text style={[styles.text, { fontSize: 16 }]}>
                            {t('RegisterIDcard:textscanqrcode')}
                            {/* <Text style={styles.textBold}>
                            {t('cardIdloginScreen:formTextBold')}
                          </Text> */}
                          </Text>
                          <QRCode
                            value={url}
                            size={100}
                            logoSize={60}
                            logoBackgroundColor="transparent"
                          />
                        </View>
                      </View>
                    </>
                    <>
                      <View style={{ flex: 1, width: '100%' }}>
                        <View style={styles.QRCode}>
                          <Image
                            source={{
                              uri:
                                'https://telereserve.myhealthgroup.net/asset/image/mhf-icon.png',
                            }}
                            style={{
                              width: 60,
                              height: 55,
                              resizeMode: 'stretch',
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: 'LINESeedSansTH_A_Rg',
                              fontSize: 16,
                            }}>
                            {t('cardIdloginScreen:messageLogin')}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.textNumIdcardMargin,
                              {
                                backgroundColor: NEW_COLOR['blue'],
                                width: '80%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}
                            onPress={() => {
                              navigation.navigate('UserLogin', {
                                device: device,
                              });
                              navigation.navigate('CardIdLogin', {
                                device: device,
                              });
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontFamily: 'LINESeedSansTH_A_Bd',
                                fontSize: 14,
                              }}>
                              {t('cardIdloginScreen:login')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.textNumIdcardMargin,
                              {
                                backgroundColor: '#fff',
                                width: '80%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: NEW_COLOR['blue'],
                              },
                            ]}
                            onPress={() => this.openRegister()}>
                            <Text
                              style={{
                                color: NEW_COLOR['blue'],
                                fontFamily: 'LINESeedSansTH_A_Bd',
                                fontSize: 14,
                              }}>
                              {t('cardIdloginScreen:register')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  </View>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {WidthMoreThenHeight ? (
              <>
                {/* ้เนื้อหาแนวนอน */}
                <View style={styles.container}>
                  <View style={styles.webBlk}>
                    <Image
                      source={{
                        uri: config.images?.[t('images:cameraPage')],
                      }}
                      style={styles.background}
                    />
                  </View>

                  <View style={styles.contentBoxPosition}>
                    <View style={styles.logoCover}>
                      <Image style={styles.logoSize} source={IDCard} />
                    </View>

                    <Text style={styles.text}>
                      {t('cardIdloginScreen:formText')}
                      <Text style={styles.textBold}>
                        {t('cardIdloginScreen:formTextBold')}
                      </Text>
                    </Text>
                    <KeyboardAvoidingView behavior="padding" enabled>
                      <TextInput
                        style={styles.textField}
                        maxLength={13}
                        placeholder="x-xxxx-xxxxx-xx-x"
                        textAlign="center"
                        keyboardType="numeric"
                        autoCapitalize="none"
                        onChangeText={(id) => this.setState({ id })}
                        onSubmitEditing={() => this._onSubmit()}
                        onPress={() => this._onSubmit()}
                      />
                    </KeyboardAvoidingView>
                    {this.renderErrMessage()}
                    <TouchableOpacity
                      style={styles.textNumIdcardMargin}
                      onPress={() => this._onSubmit()}>
                      <Text style={styles.textNumIdcard}>
                        {t('buttons:loginText')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Back Button */}
                  <View style={styles.loginMethodPosition}>
                    <BackButton onPress={() => navigation.navigate('Home')} />
                  </View>
                  {this.renderLoginBtn()}
                </View>
              </>
            ) : (
              <>
                {/* ้เนื้อหาแนวตั้ง */}
                <View style={styles.container}>
                  <View style={styles.webBlk}>
                    <Image
                      source={{ uri: imgSponsor }}
                      // style={styles.background}
                      style={{
                        width: '100%',
                        height: '100%',
                        // backgroundColor: 'blue',
                        resizeMode: 'contain',
                        top: window.height * 0.375,
                      }}
                    />
                  </View>

                  {/* <View style={styles.contentBoxPosition}> */}
                  <View
                    style={{
                      position: 'absolute',
                      // top: 120,
                      top: window.height * 0.1,
                      width: window.width,
                      zIndex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      // backgroundColor: 'blue',
                    }}>
                    <View
                      style={{
                        width: SCREEN_WIDTH * 0.6,
                        height: SCREEN_HEIGHT * 0.3,
                      }}>
                      <Image style={styles.logoSize} source={IDCard} />
                    </View>

                    {/* <Text style={styles.text}> */}
                    <View
                      style={{
                        position: 'absolute',
                        top: window.height * 0.25,
                      }}>
                      <Text
                        style={{
                          fontSize: window.width * 0.035,
                          fontFamily: 'LINESeedSansTH_A_Rg',
                          marginVertical: 10,
                        }}>
                        {t('cardIdloginScreen:formText')}
                        {/* <Text style={styles.textBold}> */}
                        <Text
                          style={{
                            fontSize: window.width * 0.04,
                            fontFamily: 'LINESeedSansTH_A_Bd',
                          }}>
                          {t('cardIdloginScreen:formTextBold')}
                        </Text>
                      </Text>
                    </View>

                    <KeyboardAvoidingView behavior="padding" enabled>
                      <TextInput
                        // style={styles.textField}
                        style={{
                          width: window.width * 0.8,
                          backgroundColor: '#ebebeb',
                          paddingHorizontal: 20,
                          margin: 10,
                          fontFamily: 'LINESeedSansTH_A_Rg',
                          fontSize: window.width > 400 ? 30 : 18,
                          borderRadius: 25,
                        }}
                        maxLength={13}
                        placeholder="x-xxxx-xxxxx-xx-x"
                        keyboardType="numeric"
                        textAlign="center"
                        autoCapitalize="none"
                        onChangeText={(id) => this.setState({ id })}
                        onSubmitEditing={() => this._onSubmit()}
                      />
                    </KeyboardAvoidingView>
                    {this.renderErrMessage()}
                    <TouchableOpacity
                      style={{
                        top: -(window.height * 0.01),
                        backgroundColor: NEW_COLOR['blue'],
                        borderRadius: 50,
                        padding: 5,
                        paddingHorizontal: 30,
                        margin: 20,
                      }}
                      onPress={() => this._onSubmit()}>
                      <Text style={styles.textNumIdcard}>
                        {t('buttons:loginText')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Back Button */}
                  <View
                    style={{
                      position: 'absolute',
                      top: window.width > 400 ? 10 : 0,
                      left: window.width > 400 ? 100 : 70,
                      zIndex: 2,
                    }}>
                    <BackButton onPress={() => navigation.goBack()} />
                  </View>
                  {this.renderLoginBtn()}
                </View>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webBlk: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'blue',
    resizeMode: 'contain',
  },
  logo: {
    resizeMode: 'contain',
    padding: 10,
    marginTop: 10,
    width: 170,
    height: '100%',
  },
  errorBox: {
    flexDirection: 'row',
    marginTop: 5,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderLeftColor: '#dc3545',
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  errorText: {
    fontFamily: 'LINESeedSansTH_A_Rg',
    textAlign: 'left',
    marginLeft: 5,
    marginTop: 2,
    fontSize: 22,
    color: '#000',
  },
  textField: {
    width: SCREEN_WIDTH * 0.5,
    backgroundColor: '#ebebeb',
    paddingHorizontal: 20,
    margin: 10,
    fontFamily: 'LINESeedSansTH_A_Rg',
    fontSize: 30,
    borderRadius: 25,
  },
  logoCover: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.4,
    // backgroundColor: 'blue',
  },
  logoSize: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  loginMethodPosition: {
    position: 'absolute',
    top: 10,
    left: 100,
    zIndex: 2,
  },
  scanQRCodePosition: {
    position: 'absolute',
    top: 20,
    right: 30,
  },
  logInMethodPosition: {
    position: 'absolute',
    top: 30,
    right: 25,
    zIndex: 1,
  },
  QRCodePosition: {
    position: 'absolute',
    top: 140,
    right: 25,
    zIndex: 1,
  },
  btnBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
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
  text: {
    fontSize: 20,
    fontFamily: 'LINESeedSansTH_A_Rg',
    marginVertical: 10,
  },
  textBold: {
    fontSize: 25,
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  contentBoxPosition: {
    position: 'absolute',
    // top: 120,
    height: SCREEN_HEIGHT,
    zIndex: 1,
    width: SCREEN_WIDTH * 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'blue',
    paddingVertical: 25,
  },

  textNumIdcardMargin: {
    backgroundColor: NEW_COLOR['blue'],
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 50,
    margin: 10,
  },
  textNumIdcard: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'LINESeedSansTH_A_Bd',
  },
  close: {
    position: 'absolute',
    zIndex: 99,
    left: 130,
    top: 45,
  },
  QRCode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerIDCard: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
});

const barBtn = StyleSheet.create({
  emergencyBtnPostion: {
    position: 'absolute',
    flexDirection: 'row',
    top: 30,
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
    width: '80%',
    height: '80%',
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
