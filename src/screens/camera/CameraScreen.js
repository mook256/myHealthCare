import React, { Component } from 'react';
import { Alert, Dimensions, Image, Text, View, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { DotIndicator } from 'react-native-indicators';
import BackButton from '../../components/buttons/BackButton';
import imgbgqdcode from '../../assets/images/new-ui/bgimg2.png';
import { NEW_COLOR } from '../../utils/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageButton from '../../components/buttons/ImageButton';
import { imgSponsor } from '../../utils/assetsURL';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class CameraScreen extends Component {
  constructor() {
    super();
    this.state = {
      scanBarcode: true,
      id: null,
      dimensions: {
        window: {
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
        },
        screen: screenDimensions,
      },
      cameraType : CameraType.Front,
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
    const { errorMsg, navigation } = this.props;
    if (prevProps.errorMsg !== errorMsg) {
      if (errorMsg) {
        Alert.alert(
          'แจ้งเตือน',
          errorMsg,
          [
            {
              text: 'ตกลง',
              onPress: () => {
                this.setState({ id: null, scanBarcode: true });
                navigation.goBack();
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
  }

  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
    this.setState({ id: null, scanBarcode: true });
  }

  onReadCode = ({ nativeEvent }) => {
    const { scanBarcode } = this.state;
    const { handleSubmit } = this.props;
    if (nativeEvent?.codeStringValue && scanBarcode) {
      handleSubmit(nativeEvent?.codeStringValue);
      this.setState({ id: nativeEvent?.codeStringValue, scanBarcode: false });
    }
  };

  onBottomButtonPressed(event) {
    const { navigation } = this.props;
    if (event.type == 'left') {
      this.setState({ id: null, scanBarcode: true });
      navigation.goBack();
    }
  }

  renderBackButton() {
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
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 100,
                zIndex: 1,
                width: 200,
                height: 80,
                flexDirection: 'row',
              }}>
              <BackButton onPress={() => navigation.navigate('Home')} />
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                top: width > 400 ? 10 : 0,
                left: width > 400 ? 100 : 70,
                zIndex: 1,
                width: 200,
                height: 80,
                flexDirection: 'row',
              }}>
              <BackButton onPress={() => navigation.navigate('Home')} />
            </View>
          </>
        )}
      </>
    );
  }
  toggleCameraType = () => {
    const { cameraType, } = this.state;
    const newCameraType = cameraType === CameraType.Front ? CameraType.Back  : CameraType.Front;
    this.setState({ cameraType: newCameraType, });
  };
  rendertoggleBtn() {
    const { navigation,t } = this.props;
    const {
      dimensions: { window },
      cameraType
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    const cameratext = cameraType === CameraType.Front ? t('buttons:cameratypefront') : t('buttons:cameratypeback')
    console.log(cameraType);
     return (
       <>
        {WidthMoreThenHeight ? (
          <>
            <View style={loginBtn.togglecameraPOsition}>
              <TouchableOpacity
                style={[
                  loginBtn.btnBox,
                  { backgroundColor: NEW_COLOR['light_red'] },
                ]}
                onPress={this.toggleCameraType}
                >
                <Text style={loginBtn.btnText}>
                  <Text style={loginBtn.btnTextBold}>{cameratext}</Text>
                </Text>
                <View style={loginBtn.btnBoxImg}>
                  <TouchableOpacity
                    style={imgBtn.btn}
                    onPress={this.toggleCameraType}
                   >
                    <FontAwesome
                      name="refresh"
                      style={styles.icon}
                      size={30}
                      color="#000"
                      // color="black"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                top: width > 400 ? 10 : 0,
                left: width > 400 ? 100 : 70,
                zIndex: 99,
                width: 200,
                height: 80,
                flexDirection: 'row',
              }}>
               <TouchableOpacity style={styles.btn} onPress={this.toggleCameraType}>
                <FontAwesome
                  name="camera"
                  style={styles.icon}
                  size={30}
                  color="#cfd8dc"
                  // color="black"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </>
    );
  }

  renderScanStatus() {
    const { id } = this.state;
    if (!id) {
      return (
        <View style={{ position: 'absolute', right: 15, bottom: 10 }}>
          <DotIndicator color="white" size={8} />
        </View>
      );
    }
    return (
      <View style={{ position: 'absolute', right: 15, bottom: 10 }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>{id}</Text>
      </View>
    );
  }

  renderInstruction() {
    const { t, config } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    console.log('img', config?.images?.[t('images:cameraAdPage')]);
    return (
      <>
        {window.width > window.height ? (
          <>
            {/* กล้องแนวนอน */}
            <View style={styles.imgBannerProsition}>
              <Image
                source={{ uri: config?.images?.[t('images:cameraAdPage')] }}
                style={styles.imgBanner}
              />
            </View>
          </>
        ) : (
          <>
            {/* กล้องแนวตั้ง */}
            {/* <View style={styles.imgBannerProsition}> */}
            <View
              style={{
                position: 'absolute',
                bottom: window.height * 0.03,
                height: window.height * 0.13,
                width: window.width * 1,
                zIndex: 2,
              }}>
              <Image
                source={{ uri: config?.images?.[t('images:cameraAdPage')] }}
                style={styles.imgBanner}
              />
            </View>
          </>
        )}
      </>
    );
  }

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
                style={[
                  loginBtn.btnBox,
                  { backgroundColor: NEW_COLOR['gray'] },
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
                // style={[
                //   loginBtn.btnBox,
                //   { backgroundColor: NEW_COLOR['gray'] },
                // ]}
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
    const { t, config } = this.props;
    const { scanBarcode,cameraType } = this.state;
    const {
      dimensions: { window },
    } = this.state;
    return (
      <>
        {window.width > window.height ? (
          <>
            {/* เนื้อหาแนวนอน */}
            <View style={styles.webBlk}>
              <Image
                source={{ uri: config.images?.[t('images:cameraPage')] }}
                style={styles.background}
              />
            </View>
            <View style={styles.cameraProsition}>

              <Camera
                width="80%"
                height="90%"
                cameraType={cameraType}
                scanBarcode={scanBarcode}
                onReadCode={(event) => this.onReadCode(event)}
                hideControls
                // showFrame={scanBarcode}
                laserColor=""
                frameColor="#fff"
              />
              {/* {this.renderInstruction()}z */}
            </View>
            {this.renderLoginBtn()}
            {this.rendertoggleBtn()}
            {this.renderBackButton()}
            {this.renderScanStatus()}
          </>
        ) : (
          <>
            {/* เนื้อหาแนวตั้ง */}
            <View
              style={[
                styles.webBlk,
                {
                  backgroundColor: 'white',
                },
              ]}>
              <Image
                source={{ uri: imgSponsor }}
                // style={styles.background}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                  resizeMode: 'contain',
                  top: window.height * 0.375,
                }}
              />
            </View>
            {/* <View style={styles.cameraProsition}> */}
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                top: window.height * 0.125,
                left: window.width * 0.1,
                width: '100%',
                height: '50%',
              }}>
              <Camera
                width="80%"
                height="90%"
                cameraType={CameraType.Front}
                scanBarcode={scanBarcode}
                onReadCode={(event) => this.onReadCode(event)}
                hideControls
                // showFrame={scanBarcode}
                laserColor=""
                frameColor="#fff"
              />
              {this.renderInstruction()}
            </View>
            {this.renderLoginBtn()}
            {this.rendertoggleBtn()}
            {this.renderBackButton()}
            {this.renderScanStatus()}
          </>
        )}
      </>
    );
  }
}

export default CameraScreen;

const styles = StyleSheet.create({
  webBlk: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  cameraProsition: {
    position: 'absolute',
    zIndex: -1,
    top: 60,
    left: 20,
    width: '100%',
    height: '100%',
  },
  imgBannerProsition: {
    position: 'absolute',
    left: 0,
    bottom: 65,
    height: Dimensions.get('window').height * 0.2,
    width: Dimensions.get('window').width * 1,
    zIndex: 2,
  },
  imgBanner: {
    width: '80%',
    height: '85%',
    resizeMode: 'stretch',
  },
  btn: {
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    opacity:0.5
  },
  icon: {
    alignSelf: 'center',
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
  togglecameraPOsition: {
    position: 'absolute',
    top: 185,
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
