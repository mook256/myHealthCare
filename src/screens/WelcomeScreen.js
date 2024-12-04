/* eslint-disable */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {Text} from 'native-base';
import img from '../assets/images/mhfnewbg.png';

export default class WelcomeScreen extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <ImageBackground source={img} style={{width: '100%', height: '100%'}}>
        <StatusBar barStyle="dark-content" />

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        <TouchableOpacity
          style={style.btn}
          onPress={() => navigation.navigate('SignIn')}>
          <Text style={style.btnText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.btnBorder}
          onPress={() => navigation.navigate('License')}>
          <Text style={style.btnTextBorder}>สมัครสมาชิกใหม่</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

WelcomeScreen.navigationOptions = {
  headerShown: false,
};

const style = StyleSheet.create({
  btn: {
    backgroundColor: '#2f635f',
    color: '#FFFFFF',
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  btnBorder: {
    backgroundColor: '#FFFFFF',
    color: '#034f53',
    marginTop: 10,
    marginBottom: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'NotoSansThaiUI-SemiBold',
  },
  btnTextBorder: {
    color: '#2f635f',
    textAlign: 'center',
    fontFamily: 'NotoSansThaiUI-SemiBold',
  },
});
