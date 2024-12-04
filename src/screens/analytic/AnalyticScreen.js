import React, { Component } from 'react';
import { Platform, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { MHC_HEALTH_ANALYTIC_URL, MHW_API_KEY } from '../../utils/constants';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class AnalyticScreen extends Component {
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
  render() {
    const { currentuser, authentication, config } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    return (
      <WebView
        style={{ flex: 1 }}
        source={{
          uri: `${MHC_HEALTH_ANALYTIC_URL}/${currentuser.userid}`,
          headers: {
            Authorization: authentication.token,
            'X-API-KEY': MHW_API_KEY,
            'X-MHC-DEVICE-NAME': config.deviceName,
          },
        }}
        scalesPageToFit
        useWebKit={Platform.OS !== 'ios'}
      />
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

export default AnalyticScreen;
