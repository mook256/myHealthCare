import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import {
  AVATAR_URL,
  NEW_COLOR,
  TRANSLATE_BUTTON_IMAGES,
} from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';
import ImageButton from '../../components/buttons/ImageButton';
import { ImageBackground } from 'react-native';
import { imgSponsor } from '../../utils/assetsURL';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default class UserLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  }

  // ล็อคอิน บัตรประชาชน
  handleLogin = () => {
    const { navigation, users } = this.props;
    const device = navigation.getParam('device');
    if (users?.length > 0) {
      navigation.navigate('UserLogin', { device: device });
      // console.log('device', this.state.deviceName);
    } else {
      navigation.navigate('CardIdLogin', { device: device });
      // console.log('device', deviceName);
    }
  };
  renderLoginBtn() {
    const { navigation, t } = this.props;
    const device = navigation.getParam('device');
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
            <View style={loginBtn.QRCodePosition}>
              <TouchableOpacity
                style={[loginBtn.btnBox, { backgroundColor: NEW_COLOR['red'] }]}
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
            {/* กรอกเลขบัตรแนวตั้ง */}
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
                position: 'absolute',
                bottom: window.height * 0.01,
                width: window.width * 0.55,
                right: window.width * 0.235,
                zIndex: 1,
              }}>
              <Text style={loginBtn.devicesText}>Device Name : {device}</Text>
            </View>
          </>
        )}
      </>
    );
  }

  render() {
    const { config, navigation, setCurrentUser, t } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    return (
      <>
        {window.width > window.height ? (
          <>
            {/* เนื้อหาแนวนอน */}
            <View style={styles.container}>
              <View style={styles.webBlk}>
                <Image
                  source={{
                    uri: config.config.images?.[t('images:cameraPage')],
                  }}
                  style={styles.background}
                />
              </View>

              <View style={styles.contentBoxPosition}>
                <View style={styles.titleContent}>
                  <Text style={styles.title}>{t('header')}</Text>
                </View>
                <View style={styles.mainContent}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.userContent}>
                    {config.users.map((user) => {
                      return (
                        <Card style={styles.card} key={user.userid}>
                          <TouchableOpacity
                            onPress={() => setCurrentUser(user)}>
                            <Card.Cover
                              style={styles.cardImg}
                              source={{
                                uri: `${AVATAR_URL}/${
                                  user?.user?.avatar || 'default.png'
                                }`,
                              }}
                            />
                            <Card.Content>
                              <Text
                                style={styles.cardTitle}
                                numberOfLines={1}
                                adjustsFontSizeToFit>
                                {user.firstname} {user.surname}
                              </Text>
                            </Card.Content>
                          </TouchableOpacity>
                        </Card>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
              {this.renderLoginBtn()}

              {/* Back Button position */}
              <View style={styles.backBtnPosition}>
                <BackButton onPress={() => navigation.goBack()} />
              </View>
            </View>
          </>
        ) : (
          <>
            {/* เนื้อหาแนวตั้ง */}
            <View style={styles.container}>
              <View style={styles.webBlk}>
                <Image
                  source={{
                    uri: imgSponsor,
                  }}
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
                  top: window.height * 0.1,
                  height: window.height * 0.9,
                  zIndex: 1,
                  width: window.width,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  // backgroundColor: 'blue',
                }}>
                <View style={styles.titleContent}>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: window.width > 400 ? 24 : 18,
                      },
                    ]}>
                    {t('header')}
                  </Text>
                </View>
                <View style={styles.mainContent}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.userContent}>
                    {config.users.map((user) => {
                      return (
                        <Card style={styles.card} key={user.userid}>
                          <TouchableOpacity
                            onPress={() => setCurrentUser(user)}>
                            <Card.Cover
                              style={styles.cardImg}
                              source={{
                                uri: `${AVATAR_URL}/${
                                  user?.user?.avatar || 'default.png'
                                }`,
                              }}
                            />
                            <Card.Content>
                              <Text
                                style={[
                                  styles.cardTitle,
                                  {
                                    fontSize: window.width > 400 ? 22 : 18,
                                  },
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit>
                                {user.firstname} {user.surname}
                              </Text>
                            </Card.Content>
                          </TouchableOpacity>
                        </Card>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
              {this.renderLoginBtn()}

              {/* Back Button position */}
              <View
                style={{
                  position: 'absolute',
                  top: window.width > 400 ? 10 : 0,
                  left: window.width > 400 ? 100 : 70,
                  zIndex: 2,
                }}>
                <BackButton onPress={() => navigation.goBack()} />
              </View>
            </View>
          </>
        )}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webBlk: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  titleContent: {
    // flex: 1,
    marginVertical: 10,
  },
  title: {
    // marginTop: 40,
    fontSize: 24,
    fontFamily: 'LINESeedSansTH_A_Bd',
    textAlign: 'center',
    color: 'black',
  },
  mainContent: {
    flex: 3,
    flexDirection: 'column',
  },
  userContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    width: 200,
    height: 255,
    margin: 10,
    borderRadius: 20,
  },
  cardImg: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  cardTitle: {
    fontFamily: 'LINESeedSansTH_A_Bd',
    fontSize: 22,
    textAlign: 'center',
    paddingVertical: 10,
  },

  backBtnPosition: {
    position: 'absolute',
    top: 10,
    left: 100,
    zIndex: 2,
  },
  backBtn: {
    width: 150,
    height: 50,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    borderRadius: 20,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  loginPosition: {
    position: 'absolute',
    top: 30,
    right: 30,
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
    top: 120,
    height: SCREEN_HEIGHT * 0.9,
    zIndex: 1,
    width: SCREEN_WIDTH * 0.75,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'blue',
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
