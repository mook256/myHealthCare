import React, { Component } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { MHW_API_KEY, MHW_HOST } from '../../utils/constants';

export default class TeleClinicBookingScreen extends Component {
  constructor() {
    super();
    this.state = {
      offsetY: 0,
      isLoading: true,
    };
  }

  _handleScroll(event) {
    if (this.state.isLoading == false) {
      const offsetY = event.nativeEvent.contentOffset.y;
      this.setState({ offsetY: offsetY });
    }
  }

  _handleWebViewMessage(event) {
    const { navigation } = this.props;
    const act = JSON.parse(event.nativeEvent.data);
    if (act.mode === 'goBack') {
      navigation.goBack();
    } else if (act.mode === 'TeleProgram') {
      navigation.popToTop();
      navigation.navigate('MainScreen');
    } else if (act.mode === 'openWeb') {
      navigation.push('TeleClinicBookingWeb', {
        name: act.mode,
        url: MHW_HOST + act.url,
        title: act.title,
        isHeaders: true,
        currentStep: act.currentStep,
      });
    } else if (act.mode === 'openNoBackWeb') {
      navigation.popToTop();
      navigation.navigate('TeleClinicBookingWeb', {
        name: act.mode,
        url: MHW_HOST + act.url,
        title: act.title,
        isHeaders: true,
        currentStep: act.currentStep,
      });
    }
  }

  _handleWebViewLoad() {
    this.setState({ isLoading: false });
  }

  render() {
    const { navigation, authentication, url, currentuser, config } = this.props;
    const { offsetY, isLoading } = this.state;
    const isHeaders = true;

    // let urlTemp = 'https://www.google.com';
    const source = { uri: url };
    const injectScript = `
    (function() {
      window.__MHW_HOST__ = '${MHW_HOST}';
      window.__TOKEN__ = '${authentication.token}';
      window.__API_KEY__ = '${MHW_API_KEY}';

      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })();
  `;
    if (isHeaders) {
      source.headers = {
        Authorization: authentication.token,
        'X-API-KEY': MHW_API_KEY,
        'X-MHC-USER-ID': currentuser.userid,
        'X-MHC-DEVICE-NAME': config.deviceName,
      };
    }

    return (
      <View style={styles.container}>
        <View style={styles.webContainer}>
          <WebView
            ref={(ref) => {
              this.webview = ref;
            }}
            onScroll={(event) => this._handleScroll(event)}
            style={styles.web}
            source={source}
            scalesPageToFit
            useWebKit={Platform.OS !== 'ios'}
            javaScriptEnabled
            injectedJavaScript={injectScript}
            originWhitelist={['*']}
            domStorageEnabled
            allowFileAccess
            allowUniversalAccessFromFileURLs
            onLoadEnd={() => this._handleWebViewLoad()}
            onMessage={(event) => this._handleWebViewMessage(event)}
            onError={(error) => console.log('error1', error)}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn(
                'WebView received error status code: ',
                nativeEvent.statusCode,
              );
            }}
          />
        </View>
        {isLoading && <ActivityIndicator style={styles.indicator} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
  },
  web: {
    flex: 1,
  },
  indicator: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
