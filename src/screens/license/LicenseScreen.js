import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import RNRestart from 'react-native-restart';

import i18n from '../../i18n';
import LicenseWebView from './LicenseWebView';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class LicenseScreen extends Component {
  state = {
    dimensions: {
      window: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      },
      screen: screenDimensions,
    },
  };
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
  render() {
    const { navigation, t } = this.props;
    const {
      dimensions: { window },
    } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            marginVertical: 20,
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.header,
              {
                fontSize:
                  window.width > window.height
                    ? 22
                    : window.width > 400
                    ? 22
                    : 18,
              },
            ]}>
            {t('header')}
          </Text>
        </View>
        <LicenseWebView />
        <View>
          <TouchableOpacity
            style={[styles.btn, styles.btnAccept]}
            onPress={() => navigation.navigate('MainScreen')}>
            <Text
              style={[
                styles.btnText,
                styles.btnTextAccept,
                {
                  fontSize:
                    window.width > window.height
                      ? 18
                      : window.width > 400
                      ? 18
                      : 16,
                },
              ]}>
              {t('common:accept')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnDecline]}
            onPress={() => RNRestart.Restart()}>
            <Text
              style={[
                styles.btnText,
                styles.btnTextDecline,
                {
                  fontSize:
                    window.width > window.height
                      ? 18
                      : window.width > 400
                      ? 18
                      : 16,
                },
              ]}>
              {t('common:decline')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    color: '#2E2E2E',
    fontSize: 22,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: 'pink',
    padding: 15,
    margin: 5,
    borderRadius: 15,
  },
  btnAccept: {
    backgroundColor: '#27C3ED',
  },
  btnDecline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#27C3ED',
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btnTextAccept: {
    color: '#fff',
  },
  btnTextDecline: {
    color: '#27C3ED',
  },
});

export default LicenseScreen;
