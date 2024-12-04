import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { MHW_HOST, MHW_API_KEY } from '../../utils/constants';
import { colors } from '../../styles';

export default class WebScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
    this._handleWebViewMessage = this._handleWebViewMessage.bind(this);
    this._handleWebViewLoad = this._handleWebViewLoad.bind(this);
  }

  async _goToMessage(participant) {
    const { goToMessageFunction } = this.props;
    goToMessageFunction(participant);
  }

  redirectAct(message) {
    const { navigation } = this?.props;
    let act = '';
    try {
      act = JSON.parse(message.nativeEvent.data);
    } catch (err) {
      act = message.nativeEvent.data;
    }
    console.log('console.log act', act);
    console.log('console.log act.mode', act.mode);
    if (act.mode === 'backHome') {
      navigation.navigate('Home', {});
    } else if (act.mode === 'profileUPD') {
      navigation.navigate('Timeline', {});
    } else if (act.mode === 'goBack') {
      navigation.navigate('UserLogin', {});
      navigation.navigate('CardIdLogin', {});
    } else if (act.mode === 'mhc_home') {
      navigation.navigate('UserLogin', {});
      navigation.navigate('CardIdLogin', {});
    } else if (act.mode === 'backStore') {
      navigation.navigate('Store', {});
    } else if (act.mode === 'aiDoc') {
      navigation.navigate('AIDoc', {});
    } else if (act.mode === 'rtDataNew') {
      navigation.navigate('RtHealthDataNew', { mode: 'bmi', backSel: 'Home' });
    } else if (act.mode === 'covidDataNew') {
      navigation.navigate('RtHealthDataNew', {
        mode: 'covid',
        backSel: 'Home',
      });
    } else if (act.mode === 'covidWardDataNew') {
      navigation.navigate('RtHealthDataNew', {
        mode: 'covidward',
        backSel: 'Home',
      });
    } else if (act.mode === 'labResult') {
      navigation.navigate('LabResult', { reportId: act.reportid });
    } else if (act.mode === 'openWeb') {
      if (act.title === undefined) {
        navigation.push('Web', {
          name: act.mode,
          url: act.url,
          title: act.title,
          isCloseIcon: false,
          isHeaders: true,
        });
      } else {
        navigation.push('Web', {
          name: act.mode,
          url: act.url,
          title: act.title,
          isCloseIcon: true,
          isHeaders: true,
        });
      }
    } else if (act.mode === 'openNoBackWeb') {
      navigation.navigate('Web', {
        name: act.mode,
        url: act.url,
        title: act.title,
        isHeaders: true,
      });
    } else if (act.mode === 'openWebFullScreen') {
      navigation.navigate('Web', {
        name: act.mode,
        url: act.url,
        title: act.title,
        isHeaders: true,
      });
    } else if (act.mode === 'chat') {
      this._goToMessage({
        userid: act.userid,
        user: {
          username: act.username,
          avatar: act.avatar,
        },
      });
    }
  }

  _handleWebViewMessage(event) {
    const { navigation } = this.props;
    if (typeof navigation.state.params.onMessage !== 'undefined') {
      const data = JSON.parse(event.nativeEvent.data);
      const onMessage = navigation.state.params.onMessage.bind(this, data);
      onMessage();
    } else {
      this.redirectAct(event);
    }
  }

  _handleWebViewLoad() {
    this.setState({ isLoading: false });
  }

  render() {
    const { authentication, navigation } = this.props;
    const { isLoading } = this.state;
    const source = { uri: navigation.getParam('url') };
    console.log('source', source);
    const injectScript = `
    (function() {
      window.__MHW_HOST__ = '${MHW_HOST}';
      window.__TOKEN__ = '${authentication.token}';
      window.__API_KEY__ = '${MHW_API_KEY}';
      sessiontoken = '${authentication.sessionToken}';

      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })();
  `;
    const isHeaders = navigation.getParam('isHeaders', false);
    if (isHeaders) {
      source.headers = {
        Authorization: authentication.token,
        'X-API-KEY': MHW_API_KEY,
      };
    }
    return (
      <KeyboardAvoidingView style={styles.container} enabled>
        <WebView
          ref={(ref) => {
            this.webview = ref;
          }}
          style={{ flex: 1 }}
          source={source}
          // source={{ uri: 'https://110.49.2.20:5002/signin' }}
          scalesPageToFit
          useWebKit={Platform.OS !== 'ios'}
          javaScriptEnabled
          injectedJavaScript={injectScript}
          originWhitelist={['*']}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          onLoadEnd={this._handleWebViewLoad}
          onMessage={this._handleWebViewMessage}
        />
        {isLoading && <ActivityIndicator style={styles.indicator} />}
      </KeyboardAvoidingView>
    );
  }
}

WebScreen.propTypes = {
  authentication: PropTypes.shape({ token: PropTypes.string }).isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBg,
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
