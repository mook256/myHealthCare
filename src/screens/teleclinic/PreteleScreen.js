/* eslint-disable */
import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { BleManager } from 'react-native-ble-plx';
import PropTypes from 'prop-types';
import TopNav from '../../components/TopNav';
import { healthForm, formatField, colorField } from '../../utils/healthForm';
import { MHW_HOST, MHW_API_KEY } from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';

class PreteleScreen extends Component {
  _interval = undefined;
  constructor(props) {
    super(props);
    this.state = {
      info: '',
      weight: 0.0,
      device_id: '',
      temp: 0.0,
      bgc: 0.0,
      bp: '000,00,00',
      sbp: 0,
      dbp: 0,
      hr: 0,
      temp_bp: [],
      updKey: 0,
      updTime: 0,
    };
    this.prevWeight = 0.0;
    this.updTime = 0;
    this.manager = new BleManager();
    this._isMounted = false;
    this._goToMessage = this._goToMessage.bind(this);
  }

  async _goToMessage(participant) {
    const { goToMessageFunction } = this.props;
    goToMessageFunction(participant);
  }

  renderWebLinkBlock(url, link) {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(link.mode, {
            name: link.mode,
            url: link.url,
            title: link.title,
            isHeaders: true,
          });
        }}>
        {this.renderWebBlock(url)}
      </TouchableOpacity>
    );
  }

  renderWebBlock(url) {
    const { authentication } = this.props;
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
    return (
      <View style={webBlk.container}>
        <WebView
          ref={(WEBVIEW_REF) => {
            this.webviewref = WEBVIEW_REF;
          }}
          source={{
            uri: url,
            headers: {
              Authorization: authentication.token,
              'X-API-KEY': MHW_API_KEY,
            },
          }}
          useWebKit="true"
          javaScriptEnabled
          injectedJavaScript={injectScript}
          bounces={false}
          scrollEnabled={false}
        />
      </View>
    );
  }

  renderDataBlockLine(type, last = false) {
    const { healthdata, t } = this.props;

    if (!healthForm[type]) {
      return null;
    }

    const form = healthForm[type];

    const textColor = '#546e7a'; // grey

    const values = form.fields.map((field) => {
      return {
        value: formatField(field, healthdata.record[field.name]),
        color: colorField(field, healthdata.record[field.name]),
      };
    });
    return (
      <View style={!last && dataBlk.lineContainer}>
        <Grid style={dataBlk.infoLineContainer}>
          <Col style={dataBlk.lineLeft}>
            <View style={dataBlk.textWrapper}>
              <FontAwesome
                name={form.icon}
                style={[
                  dataBlk.infoNumTitle,
                  { marginRight: 5, color: form.iconColor },
                ]}
              />
              <Text style={dataBlk.infoNumTitle} numberOfLines={1}>
                {t(form.iconTitle)}
              </Text>
            </View>
            <View style={dataBlk.textWrapper}>
              <Text
                style={[dataBlk.infoNumBig, { color: textColor }]}
                numberOfLines={1}>
                {values.map((value, i) => [
                  i > 0 && <Text>/</Text>,
                  <Text style={{ color: value.color }}>{value.value}</Text>,
                ])}
              </Text>
              <Text style={dataBlk.infoUnitText}>{t(form.unit)}</Text>
            </View>
          </Col>
          <Col style={{ width: 50, marginTop: 12 }}>
            <View style={dataBlk.infoIcon}>
              <FontAwesome
                name={form.icon}
                style={[dataBlk.infoIcons, { color: form.iconColor }]}
              />
            </View>
          </Col>
        </Grid>
      </View>
    );
  }

  checkNavigate(mode) {
    const { navigation, t } = this.props;

    if (mode == 'allow') {
      navigation.navigate('TeleSelDocScreen');
    } else {
      Alert.alert(t('common:warning'), t('preteleScreen:nextbtnFail'));
    }
  }

  renderNextBtn() {
    let btnColor = '#4169e1';
    let mode = 'allow';

    return (
      <View style={stepBlk.bottomBlk}>
        <TouchableOpacity onPress={() => this.checkNavigate(mode)}>
          <View style={[stepBlk.nextButton, { backgroundColor: btnColor }]}>
            <Text style={stepBlk.nextButtonLabel}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderStepDataBlock() {
    const { t, config } = this.props;
    return (
      <View style={stepBlk.container}>
        <Grid>
          <Col>
            {this.renderWebBlock(config?.images?.[t('images:pretelePage')])}
          </Col>
          <Col style={stepBlk.dataWidth}>
            <ScrollView style={dataBlk.infoContainer}>
              {this.renderDataBlockLine('spo2')}
              {this.renderDataBlockLine('resp')}
              {this.renderDataBlockLine('temp')}
              {this.renderDataBlockLine('bp')}
              {this.renderDataBlockLine('hr')}
              {this.renderDataBlockLine('weight')}
              {this.renderDataBlockLine('bgc', true)}
            </ScrollView>
            {this.renderNextBtn()}
            <View style={{ width: 15, height: 20 }} />
          </Col>
        </Grid>
      </View>
    );
  }

  renderBackBtn() {
    const { navigation } = this.props;
    return (
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <FontAwesome
          name="chevron-left"
          style={styles.icon}
          size={30}
          color="#cfd8dc"
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { navigation, user, authentication, currentuser } = this.props;
    // {this.renderDataBlock()}
    return (
      <View style={styles.container}>
        <TopNav
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          leftComponent={this.renderBackBtn()}
        />
        <View>{this.renderStepDataBlock()}</View>
      </View>
    );
  }
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BLK_HEIGHT = SCREEN_HEIGHT - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fce4e4'
    backgroundColor: '#000000',
  },
  btn: {
    justifyContent: 'center',
    marginTop: 15,
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

const webBlk = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    // marginTop: 15,
    // marginLeft: 15,
    overflow: 'hidden',
  },
});
const stepBlk = StyleSheet.create({
  container: {
    height: BLK_HEIGHT,
    borderRadius: 20,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#7a96ea',
  },
  dataWidth: {
    width: 300,
  },
  bottomBlk: {
    marginLeft: 10,
    marginRight: 10,
  },
  nextButton: {
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#00c853',
    textAlign: 'center',
  },
  nextButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
const dataBlk = StyleSheet.create({
  container: {
    height: BLK_HEIGHT,
    width: 340,
    borderRadius: 20,
    marginLeft: 15,
    backgroundColor: '#FFFFFF',
  },
  topHeaderLine: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
  },
  lineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  lineLeft: {},
  lineRight: {
    width: 170,
  },
  lineValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoLineContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 5,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  infoNumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  infoPrevNumTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b0bec5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b0bec5',
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  infoNumBig: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.6)',
  },
  infoUnitText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 15,
    marginLeft: 5,
  },
  infoSmallText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
  },
  infoContainer: {
    borderRadius: 20,
    margin: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcons: {
    fontSize: 26,
  },
  titleTextN: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.8)',
  },
  intoBottom: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 10,
    color: '#90a4ae',
  },
});

PreteleScreen.propTypes = {
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

export default connect(mapStatetoProps)(PreteleScreen);
