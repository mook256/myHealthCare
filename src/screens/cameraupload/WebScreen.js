import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import RNRestart from 'react-native-restart';
import PropTypes from 'prop-types';
import { MHW_HOST, MHW_API_KEY } from '../../utils/constants';
import { colors } from '../../styles';
import uuid from 'react-native-uuid';
import { incomingCall } from '../../redux/actions/phonecall';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import i18n from '../../i18n';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class CameraUploadWebScreen extends Component {
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
    const { navigation, t } = this.props;
    const act = JSON.parse(message.nativeEvent.data);
    // console.log('act', act);
    if (act.mode === 'EndProgram') {
      navigation.navigate('Home', {});
      RNRestart.Restart();
    } else if (act.mode === 'goBack') {
      Alert.alert('Upload success', 'Upload image success ', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else if (act.mode === 'openWebFullScreen') {
      navigation.navigate('TeleProcess', {
        name: act.mode,
        url: act.url,
        title: act.title,
        isHeaders: true,
      });
    } else if (act.mode === 'goToTeleProcess') {
      navigation.navigate('TeleProcess', {});
    } else if (act.mode === 'joinVideoCall') {
      const channelName = act.videoCallSessionId;
      const participantName = 'ได้เข้าร่วมวิดีโอคอล';
      this.props.dispatch(
        incomingCall(uuid.v4(), { channelName, participantName }),
      );
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
    const { authentication, navigation, currentuser, config } = this.props;
    const { isLoading } = this.state;
    const source = { uri: navigation.getParam('url') };
    // console.log('source', source);
    const injectScript = `
    (function() {
      window.__MHW_HOST__ = '${MHW_HOST}';
      window.__TOKEN__ = '${authentication.token}';
      window.__API_KEY__ = '${MHW_API_KEY}';
      MHC_PARTNERID = '${config?.partner?.partnerid}';
      MHC_USERID = '${currentuser?.userid}';
      MHC_DEVICEID = '${authentication?.objectId}';
      sessiontoken = '${authentication?.token}';
      PRODUCT_TYPE = 'MHC';
      
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
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <TouchableOpacity
          style={[styles.backButton, styles.btn]}
          onPress={() => navigation.goBack()}>
          <FontAwesome
            name="chevron-left"
            style={styles.icon}
            size={30}
            color="#cfd8dc"
            // color="black"
          />
        </TouchableOpacity>
        <WebView
          ref={(ref) => {
            this.webview = ref;
          }}
          style={{ flex: 1 }}
          source={source}
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

CameraUploadWebScreen.propTypes = {
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 99,
  },
  btn: {
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    alignSelf: 'center',
  },
});

export default connect(null, null)(CameraUploadWebScreen);
