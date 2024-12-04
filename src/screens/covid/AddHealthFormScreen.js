import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import RNRestart from 'react-native-restart';
import TopNav from '../../components/TopNav';
import BackButton from '../../components/buttons/BackButton';
import { MHW_HOST, MHW_API_KEY } from '../../utils/constants';
import ModalUploadSubmitView from '../main/ModalUploadSubmitView';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default class AddHealthFormScreen extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      submitModalVisible: false,
      inProgress: false,
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
  };
  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  };
  _disableBtn = () => {
    return !this.state.data || this.state.inProgress;
  };

  handleModalSubmit = (isSubmit) => {
    const { navigation } = this.props;
    this.setState({
      submitModalVisible: false,
    });

    if (isSubmit) {
      navigation.goBack();
    } else {
      RNRestart.Restart();
    }
  };

  _saveData = () => {
    const { authentication, currentuser, t } = this.props;
    this.setState({ inProgress: true }, async () => {
      const url = `${MHW_HOST}/mobileservice/mhcrtclinichealthadd`;
      const formData = new FormData();
      formData.append('idcard', currentuser?.idcard);
      formData.append('data', JSON.stringify(this.state.data));
      const options = {
        method: 'POST',
        headers: {
          Authorization: authentication?.token,
          'X-API-KEY': MHW_API_KEY,
        },
        body: formData,
      };
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          Alert.alert(t('common:alert'), t('mainScreen:sendDataFail'));
        } else {
          this.setState({
            submitModalVisible: true,
          });
        }
        this.setState({ inProgress: true });
      } catch (e) {
        Alert.alert(t('common:alert'), t('mainScreen:noInternetConnection'));
        this.setState({ inProgress: false });
      }
    });
  };

  renderHealthForm() {
    const { t } = this.props;
    const {
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    const inputField = [
      'strain',
      'cough',
      'tireness',
      'chestTightness',
      'fever',
      'eating',
      'sleeping',
      'soreThroat',
      'runnyNose',
      'bodyAches',
      'intestine',
      'smell',
      'taste',
      'rash',
      'conjunctivitis',
      'faint',
    ];
    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            <View style={styles.contentContainer}>
              <ScrollView style={styles.scrollViewContainer}>
                {inputField.map((input) => {
                  const key = this.state.data?.[input];

                  let ratingColor = '#8BCA65';
                  if (key?.value >= 5) {
                    ratingColor = '#F2E25D';
                  }
                  if (key?.value >= 7) {
                    ratingColor = '#FF5959';
                  }
                  return (
                    <View key={input} style={styles.box}>
                      <View style={styles.menuBoxTitleBox}>
                        <Text style={styles.menuBoxTitle}>
                          {t(`addCovidHealth:${input}`)}
                        </Text>
                      </View>
                      <View style={styles.menuIconContainer}>
                        <Image
                          source={require('../../assets/icons/better.png')}
                          style={styles.faceIcon}
                        />
                        <AirbnbRating
                          count={10}
                          defaultRating={0}
                          showRating={false}
                          size={42}
                          selectedColor={ratingColor}
                          starImage={require('../../assets/icons/more-default.png')}
                          onFinishRating={(value) => {
                            this.setState({
                              data: { ...this.state.data, [input]: { value } },
                            });
                          }}
                        />
                        <Image
                          source={require('../../assets/icons/cry.png')}
                          style={styles.faceIcon}
                        />
                      </View>
                    </View>
                  );
                })}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    this._disableBtn() && { backgroundColor: '#c6d2f6' },
                  ]}
                  onPress={() => this._saveData()}
                  disabled={this._disableBtn()}>
                  <Text style={styles.submitText}>
                    {t('mainScreen:sendDataBtn')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        ) : (
          <>
            <View
              style={[
                styles.contentContainer,
                {
                  width: width * 0.9,
                },
              ]}>
              <ScrollView style={styles.scrollViewContainer}>
                {inputField.map((input) => {
                  const key = this.state.data?.[input];

                  let ratingColor = '#8BCA65';
                  if (key?.value >= 5) {
                    ratingColor = '#F2E25D';
                  }
                  if (key?.value >= 7) {
                    ratingColor = '#FF5959';
                  }
                  return (
                    <View key={input} style={styles.box}>
                      <View style={styles.menuBoxTitleBox}>
                        <Text style={styles.menuBoxTitle}>
                          {t(`addCovidHealth:${input}`)}
                        </Text>
                      </View>
                      <View style={styles.menuIconContainer}>
                        <Image
                          source={require('../../assets/icons/better.png')}
                          style={styles.faceIconVertical}
                        />
                        <AirbnbRating
                          count={10}
                          defaultRating={0}
                          showRating={false}
                          size={ width>400? 20:14}
                          selectedColor={ratingColor}
                          starImage={require('../../assets/icons/more-default.png')}
                          onFinishRating={(value) => {
                            this.setState({
                              data: { ...this.state.data, [input]: { value } },
                            });
                          }}
                        />
                        <Image
                          source={require('../../assets/icons/cry.png')}
                          style={styles.faceIconVertical}
                        />
                      </View>
                    </View>
                  );
                })}
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    this._disableBtn() && { backgroundColor: '#c6d2f6' },
                  ]}
                  onPress={() => this._saveData()}
                  disabled={this._disableBtn()}>
                  <Text style={styles.submitText}>
                    {t('mainScreen:sendDataBtn')}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </>
        )}
      </>
    );
  }

  render() {
    const { navigation, user, authentication, currentuser } = this.props;
    const { submitModalVisible } = this.state;
    return (
      <View style={styles.container}>
        <TopNav
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          leftComponent={<BackButton onPress={() => navigation.goBack()} />}
        />
        {this.renderHealthForm()}
        <Modal
          presentationStyle={'overFullScreen'}
          animationType={'fade'}
          transparent
          visible={submitModalVisible}>
          <ModalUploadSubmitView
            onCancel={() => this.handleModalSubmit(false)}
            onSubmit={() => this.handleModalSubmit(true)}
          />
        </Modal>
      </View>
    );
  }
}

const BLOCK_HEIGHT = SCREEN_HEIGHT - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    // width: SCREEN_WIDTH * 0.5,
    height: BLOCK_HEIGHT,
    backgroundColor: '#e3f8ff',
    borderRadius: 20,
    alignSelf: 'center',
    paddingTop: 10,
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
  },
  box: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingTop: 15,
    paddingBottom: 5,
  },
  menuBoxTitleBox: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  menuBoxTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
  menuIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },
  faceIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  faceIconVertical:{
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  submitBtn: {
    marginTop: 20,
    marginBottom: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4169e1',
  },
  submitText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
