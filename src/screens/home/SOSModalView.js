import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

class SOSModalView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: null, // null, 'loading', 'success', 'error'
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
    const { onSendSOS } = this.props;
    this.callSOS();
    onSendSOS();

    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );
  }

  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  }
  sendSOSData = () => {
    this.setState({ status: 'loading' });
    setTimeout(() => {
      this.setState({ status: 'success' });
    }, 3000);
  };
  callSOS = () => {
    const { sosConfig } = this.props;
    if (sosConfig?.telephoneNumber?.length > 0) {
      if (Platform.OS === 'android') {
        Linking.openURL(`tel:${sosConfig?.telephoneNumber}`);
      } else {
        Linking.openURL(`telprompt:${sosConfig?.telephoneNumber}`);
      }
    }
  };

  render() {
    const { onClose, sos, sosConfig, t } = this.props;
    const telephoneNumber = sosConfig?.telephoneNumber;
    const { status } = sos;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;

    let modal = null;
    if (status === 'loading') {
      modal = (
        <>
          <View style={styles.center}>
            <Text
              style={[
                styles.infoText,
                { fontSize: WidthMoreThenHeight ? 32 : 20 },
              ]}>
              {t('sos:sending')}
            </Text>
            {/* <ActivityIndicator color="red" size="large" /> */}
          </View>

          <TouchableOpacity
            style={[
              styles.btn,
              styles.bgRed,
              {
                paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
              },
            ]}
            onPress={onClose}>
            <Text
              style={[
                styles.btnText,
                { fontSize: WidthMoreThenHeight ? 20 : 18 },
              ]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
        </>
      );
    } else if (status === 'success') {
      modal = (
        <>
          <View style={styles.center}>
            <Text
              style={[
                styles.infoText,
                { fontSize: WidthMoreThenHeight ? 32 : 20 },
              ]}>
              {t('sos:sendSuccess')}
            </Text>
            <FontAwesome name="check" size={35} color="green" />
          </View>
          <View style={styles.row}>
            {telephoneNumber?.length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.bgGreen,
                  {
                    paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
                  },
                ]}
                onPress={this.callSOS}>
                <Text
                  style={[
                    styles.btnText,
                    { fontSize: WidthMoreThenHeight ? 20 : 18 },
                  ]}>
                  {t('sos:call')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.btn,
                styles.bgRed,
                {
                  paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
                },
              ]}
              onPress={onClose}>
              <Text
                style={[
                  styles.btnText,
                  { fontSize: WidthMoreThenHeight ? 20 : 18 },
                ]}>
                {t('common:close')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else if (status === 'error') {
      modal = (
        <>
          <View style={styles.center}>
            <Text
              style={[
                styles.infoText,
                { fontSize: WidthMoreThenHeight ? 32 : 20 },
              ]}>
              {t('sos:sendFail')}
            </Text>
            <FontAwesome name="times" size={35} color="red" />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.bgBlue,
                {
                  paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
                },
              ]}
              onPress={this.sendSOSData}>
              <Text
                style={[
                  styles.btnText,
                  { fontSize: WidthMoreThenHeight ? 20 : 18 },
                ]}>
                {t('sos:sendRetry')}
              </Text>
            </TouchableOpacity>
            {telephoneNumber?.length > 0 ? (
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.bgGreen,
                  {
                    paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
                  },
                ]}
                onPress={this.callSOS}>
                <Text
                  style={[
                    styles.btnText,
                    { fontSize: WidthMoreThenHeight ? 20 : 18 },
                  ]}>
                  {t('sos:call')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.btn,
                styles.bgRed,
                {
                  paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
                },
              ]}
              onPress={onClose}>
              <Text
                style={[
                  styles.btnText,
                  { fontSize: WidthMoreThenHeight ? 20 : 18 },
                ]}>
                {t('common:close')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else {
      modal = (
        <TouchableOpacity
          style={[
            styles.btn,
            styles.bgRed,
            {
              paddingHorizontal: WidthMoreThenHeight ? 48 : 30,
            },
          ]}
          onPress={onClose}>
          <Text
            style={[
              styles.btnText,
              { fontSize: WidthMoreThenHeight ? 20 : 18 },
            ]}>
            {t('common:close')}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <KeyboardAvoidingView
        style={styles.backgroundShadow}
        behavior={'padding'}>
        <View
          style={[
            styles.modalView,
            { width: WidthMoreThenHeight ? 600 : width * 0.8, height: 250 },
          ]}>
          {modal}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundShadow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bgGreen: {
    backgroundColor: 'green',
  },
  bgRed: {
    backgroundColor: 'red',
  },
  bgBlue: {
    backgroundColor: 'blue',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 600,
    height: 250,
  },
  btn: {
    marginHorizontal: 8,
    paddingVertical: 24,
    paddingHorizontal: 48,
    borderRadius: 8,
    backgroundColor: 'gray',
  },
  infoText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 8,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

// export default SOSModalView;

export default withTranslation(['sos', 'common', 'buttons'])(SOSModalView);
