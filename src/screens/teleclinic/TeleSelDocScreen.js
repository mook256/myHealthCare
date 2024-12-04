/* eslint-disable */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import TopNav from '../../components/TopNav';
import {
  MHW_HOST_OLD,
  MHW_API_KEY,
  DOCTOR_IMAGE_URL,
  MHW_HOST,
} from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';

class TeleSelDocScreen extends Component {
  _interval = undefined;

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      loadingContact: false,
      refreshing: false,
      // isLoading: false
    };
  }

  redirectAct(message) {
    const { navigation } = this.props;
    const act = JSON.parse(message.nativeEvent.data);
    if (act.mode === 'backHome') {
      navigation.navigate('Home', {});
    } else if (act.mode === 'profileUPD') {
      navigation.navigate('Timeline', {});
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
      navigation.push('Web', {
        name: act.mode,
        url: act.url,
        title: act.title,
        isCloseIcon: true,
        isHeaders: true,
      });
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
    // this.setState({ isLoading: false });
  }

  renderImage(url) {
    return (
      <View style={webBlk.container}>
        <Image
          source={{ uri: url }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    );
  }

  render() {
    const {
      navigation,
      user,
      authentication,
      currentuser,
      t,
      config,
    } = this.props;
    // const { isLoading } = this.state;
    // const source = { uri: navigation.getParam('url') };
    const source = { uri: "https://telereserve.myhealthgroup.net/ondemand/main/TtXcGiJmcm" };
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
      <View style={styles.container}>
        <TopNav
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          leftComponent={
            <BackButton onPress={() => navigation.navigate('MainScreen')} />
          }
        />
        {this.renderImage(config?.images?.[t('images:telePage')])}
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
      </View>
    );
  }
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const WIDTH = Dimensions.get('window').width;
const BLK_HEIGHT = SCREEN_HEIGHT - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffe7d1'
    backgroundColor: '#000000',
  },
});

const webBlk = StyleSheet.create({
  container: {
    // width: WIDTH-20,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    // height: 160,
    height: SCREEN_HEIGHT * 0.25,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
});
const docBlk = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  box: {
    width: WIDTH / 3 - 10,
    justifyContent: 'center',
    // height: 60,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
});
const buttonBlk = StyleSheet.create({
  nextButton: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#00c853',
  },
  nextButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
const docStyle = StyleSheet.create({
  userBlock: {
    width: WIDTH / 3 - 16,
    justifyContent: 'center',
    // height: 160,
    height: SCREEN_HEIGHT * 0.28,
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 15,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  userBlockIcon: {
    // width: 155,
    // height: 150,
    width: WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.25,
    // backgroundColor: 'black',
  },
  profileThumbnail: {
    // width: 140,
    // height: 140,
    width: '90%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
  userRNameLine: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474f',
  },
  userDNameLine: {
    fontSize: 12,
    color: '#546e7a',
  },
  userDNameBoldLine: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#546e7a',
  },
  callBtn: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00c853',
  },
});

TeleSelDocScreen.propTypes = {
  authentication: PropTypes.shape({
    avatar: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  user: PropTypes.object.isRequired,
  userLookupFunction: PropTypes.func.isRequired,
  notification: PropTypes.any.isRequired,
  goToMessageFunction: PropTypes.func.isRequired,
};

const mapStatetoProps = ({ currentuser }) => {
  return { currentuser };
};

export default connect(mapStatetoProps)(TeleSelDocScreen);
