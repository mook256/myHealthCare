import React, { Component } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Alert,
} from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-paper';

import DeviceInfo from 'react-native-device-info';
import Parse from 'parse/react-native';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class StaffLoginScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      id: 0,
      haveError: false,
      username: '',
      password: '',
      isKeyboardShow: false,
      inProgress: false,
      showPassword: true,
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
  componentDidUpdate(prevProps) {
    const { errorMsg } = this.props;
    if (prevProps.errorMsg !== errorMsg) {
      this._errMessageHandler();
    }
  }

  _errMessageHandler = () => {
    const { errorMsg } = this.props;
    if (errorMsg) {
      this.setState({ haveError: true });
    }
  };

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

  _onSubmit = async (action) => {
    const { staff, navigation } = this.props;

    const DeviceObject = Parse.Object.extend('Device');
    const DeviceQuery = new Parse.Query(DeviceObject);
    DeviceQuery.equalTo('deviceId', DeviceInfo.getUniqueId());
    const Device = await DeviceQuery.first();
    const token =
      'bTEyOVFMbE9kZ2M1em1hNEN3c0dwSVlrQVBvaWJ2VU1ha0llc2VjYmlNQWJhdk4yaG54ejdad282dXc9Oj13PTqnvR9MFuKY5KQuNuU6PXc9OroxzTL2frorOQgWEKoQ45k=';
    const deviceKey = Device.get('deviceKey');
    const { citizenID } = this.state;

    const url = `https://silvercare.io/api/v1/domain/session/${action}`;
    const formData = new FormData();
    formData.append('citizen_id', action === 'in' ? citizenID : staff);
    formData.append('tablet_id', deviceKey);

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, options);
      // console.log(await response.json());
      if (response.ok) {
        Alert.alert(`Staff Log${action}`, 'sucess');

        if (action === 'in') {
          Device.set('staffId', citizenID);
          Device.save();
        } else {
          Device.set('staffId', '');
          Device.save();
        }

        navigation.replace('MainScreen');
      } else {
        Alert.alert(`Staff Log${action}`, 'fail');
      }
    } catch (e) {
      Alert.alert('Staff Login', 'fail');
    }
  };

  render() {
    const { citizenID } = this.state;
    const { staff } = this.props;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Grid>
            <Row style={styles.centerOfRow}>
              <View style={styles.loginCard}>
                <View style={styles.animatedView}>
                  <View></View>

                  {!staff ? (
                    <>
                      <Text style={styles.TextB30}>SILVERCARE STAFF LOGIN</Text>
                      <KeyboardAvoidingView
                        behavior="padding"
                        style={styles.inputView}>
                        <TextInput
                          style={styles.textBox}
                          ref={(input) => {
                            this.usernameTextInput = input;
                          }}
                          onFocus={() =>
                            this.setState({ isKeyboardShow: true })
                          }
                          onBlur={() =>
                            this.setState({ isKeyboardShow: false })
                          }
                          onChangeText={(text) =>
                            this.setState({ citizenID: text })
                          }
                          placeholder={'IDcard'}
                          placeholderTextColor="#25316d99"
                          returnKeyType="ok"
                          value={citizenID}
                          onSubmitEditing={() => this._onSubmit('in')}
                          blurOnSubmit={false}
                          maxLength={13}
                        />
                      </KeyboardAvoidingView>

                      <TouchableOpacity onPress={() => this._onSubmit('in')}>
                        <Button style={styles.submitButton}>
                          <Text style={[styles.TextB30, { fontSize: 20 }]}>
                            Login
                          </Text>
                        </Button>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.TextB30}>
                        SILVERCARE STAFF LOGOUT
                      </Text>

                      <TouchableOpacity onPress={() => this._onSubmit('out')}>
                        <Button style={styles.submitButton}>
                          <Text style={[styles.TextB30, { fontSize: 20 }]}>
                            Logout
                          </Text>
                        </Button>
                      </TouchableOpacity>
                    </>
                  )}

                  <View></View>
                </View>
              </View>
            </Row>
          </Grid>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  },
  loginCard: {
    width: '50%',
    borderRadius: 30,
    padding: 20,
    height: '90%',
    backgroundColor: 'rgba(250,250,250,0.3)',
    borderWidth: 1,
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
  formContainer: {
    justifyContent: 'center',
    width: '50%',
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
  textBoxPass: {},

  //text
  TextB30: {
    fontFamily: 'NotoSansThaiUI-Regular',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#25316D',
  },
});
