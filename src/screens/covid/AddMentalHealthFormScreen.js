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
import RNRestart from 'react-native-restart';
import TopNav from '../../components/TopNav';
import BackButton from '../../components/buttons/BackButton';
import { MHW_HOST, MHW_API_KEY, COLOR_LOW } from '../../utils/constants';
import ModalUploadSubmitView from '../main/ModalUploadSubmitView';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const initialState = {
  tense: null,
  controlAnxiety: null,
  worryingTooMuch: null,
  difficultToRelax: null,
  feelingRestless: null,
  easilyIrritated: null,
  feelingAfraid: null,
  sumDifficulty: null,
  bored: null,
  uneasy: null,
  sleep: null,
  tired: null,
  anorexia: null,
  failed: null,
  concentration: null,
  actSlowly: null,
  selfHarm: null,
};

export default class AddMentalHealthFormScreen extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
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
    this.score = ['3', '2', '1', '0'];
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
  _disableBtn = () => {
    const disable =
      !this.state.tense ||
      !this.state.controlAnxiety ||
      !this.state.worryingTooMuch ||
      !this.state.difficultToRelax ||
      !this.state.feelingRestless ||
      !this.state.easilyIrritated ||
      !this.state.feelingAfraid ||
      !this.state.sumDifficulty ||
      !this.state.bored ||
      !this.state.uneasy ||
      !this.state.sleep ||
      !this.state.tired ||
      !this.state.anorexia ||
      !this.state.failed ||
      !this.state.concentration ||
      !this.state.actSlowly ||
      !this.state.selfHarm ||
      this.state.inProgress;
    return disable;
  };

  _setSelectValue = ({ properties, value }) => {
    this.setState({ [properties]: { value } });
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
    const { authentication, currentuser, t, config } = this.props;
    this.setState({ inProgress: true }, async () => {
      const value = {
        tense: this.state.tense,
        controlAnxiety: this.state.controlAnxiety,
        worryingTooMuch: this.state.worryingTooMuch,
        difficultToRelax: this.state.difficultToRelax,
        feelingRestless: this.state.feelingRestless,
        easilyIrritated: this.state.easilyIrritated,
        feelingAfraid: this.state.feelingAfraid,
        sumDifficulty: this.state.sumDifficulty,
        bored: this.state.bored,
        uneasy: this.state.uneasy,
        sleep: this.state.sleep,
        tired: this.state.tired,
        anorexia: this.state.anorexia,
        failed: this.state.failed,
        concentration: this.state.concentration,
        actSlowly: this.state.actSlowly,
        selfHarm: this.state.selfHarm,
      };

      const url = `${MHW_HOST}/mobileservice/mhcmentaladd`;
      const formData = new FormData();
      formData.append('idcard', currentuser?.idcard);
      formData.append('partnerid', config?.config?.partner?.partnerid);
      formData.append('value', JSON.stringify(value));
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

  renderQuestion1() {
    const { t } = this.props;
    const {
      submitModalVisible,
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = width.height;
    const inputField = [
      { label: t('mentalHealth:mental_tense'), properties: 'tense' },
      {
        label: t('mentalHealth:mental_control_anxiety'),
        properties: 'controlAnxiety',
      },
      {
        label: t('mentalHealth:mental_worrying_too_much'),
        properties: 'worryingTooMuch',
      },
      {
        label: t('mentalHealth:mental_difficult_to_relax'),
        properties: 'difficultToRelax',
      },
      {
        label: t('mentalHealth:mental_feeling_restless'),
        properties: 'feelingRestless',
      },
      {
        label: t('mentalHealth:mental_easily_irritated'),
        properties: 'easilyIrritated',
      },
      {
        label: t('mentalHealth:mental_feeling_afraid'),
        properties: 'feelingAfraid',
      },
    ];
    return (
      <View style={styles.cardReport}>
        <View style={styles.cardReportTitle}>
          <Text
            style={[
              styles.textTitleRed,
              { fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 18 : 16 },
            ]}>
            {t('mentalHealth:mental_question_1')}
          </Text>
          <Text style={styles.scoreBoardText}>
            ({t('mentalHealth:mental_score_1_3')}
            {t('mentalHealth:mental_score_1_2')}
            {t('mentalHealth:mental_score_1_1')}
            {t('mentalHealth:mental_score_1_0')} )
          </Text>
        </View>

        <View style={styles.questionBox}>
          {inputField.map((input) => (
            <React.Fragment key={input.label}>
              <View style={styles.menuBoxTitleBox}>
                <Text style={styles.menuBoxTitle}>{input.label}</Text>
              </View>
              <View style={styles.menuIconContainer}>
                {this.score.map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreBox,
                      {
                        borderColor:
                          this.state[input.properties]?.value === score
                            ? COLOR_LOW['green']
                            : 'rgba(0,0,0,0.5)',
                      },
                      {
                        backgroundColor:
                          this.state[input.properties]?.value === score
                            ? 'rgba(139, 202, 101, 0.2)'
                            : null,
                      },
                    ]}
                    onPress={() =>
                      this._setSelectValue({
                        properties: input.properties,
                        value: score,
                      })
                    }>
                    <Text
                      style={[
                        styles.scoreText,
                        {
                          color:
                            this.state[input.properties]?.value === score
                              ? COLOR_LOW['green']
                              : 'rgba(0,0,0,1)',
                        },
                      ]}>
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  }

  renderQuestion2() {
    const { t } = this.props;
    const {
      submitModalVisible,
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = width.height;
    return (
      <View style={styles.cardReport}>
        <View style={styles.cardReportTitle}>
          <Text
            style={[
              styles.textTitleRed,
              { fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 18 : 16 },
            ]}>
            {t('mentalHealth:mental_question_2')}
          </Text>
          <Text style={styles.scoreBoardText}>
            ({t('mentalHealth:mental_score_2_3')}
            {t('mentalHealth:mental_score_2_2')}
            {t('mentalHealth:mental_score_2_1')}
            {t('mentalHealth:mental_score_2_0')} )
          </Text>
        </View>

        <View style={styles.questionBox}>
          <View style={styles.menuIconContainer}>
            {this.score.map((score) => (
              <TouchableOpacity
                key={score}
                style={[
                  styles.scoreBox,
                  {
                    borderColor:
                      this.state?.sumDifficulty?.value === score
                        ? COLOR_LOW['green']
                        : 'rgba(0,0,0,0.5)',
                  },
                  {
                    backgroundColor:
                      this.state?.sumDifficulty?.value === score
                        ? 'rgba(139, 202, 101, 0.2)'
                        : null,
                  },
                ]}
                onPress={() =>
                  this._setSelectValue({
                    properties: 'sumDifficulty',
                    value: score,
                  })
                }>
                <Text
                  style={[
                    styles.scoreText,
                    {
                      color:
                        this.state?.sumDifficulty?.value === score
                          ? COLOR_LOW['green']
                          : 'rgba(0,0,0,1)',
                    },
                  ]}>
                  {score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  renderQuestion3() {
    const { t } = this.props;
    const {
      submitModalVisible,
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = width.height;
    const inputField = [
      { label: t('mentalHealth:mental_bored'), properties: 'bored' },
      { label: t('mentalHealth:mental_uneasy'), properties: 'uneasy' },
      { label: t('mentalHealth:mental_sleep'), properties: 'sleep' },
      { label: t('mentalHealth:mental_tired'), properties: 'tired' },
      { label: t('mentalHealth:mental_anorexia'), properties: 'anorexia' },
      { label: t('mentalHealth:mental_failed'), properties: 'failed' },
      {
        label: t('mentalHealth:mental_concentration'),
        properties: 'concentration',
      },
      { label: t('mentalHealth:mental_act_slowly'), properties: 'actSlowly' },
      { label: t('mentalHealth:mental_self_harm'), properties: 'selfHarm' },
    ];
    return (
      <View style={styles.cardReport}>
        <View style={styles.cardReportTitle}>
          <Text
            style={[
              styles.textTitleRed,
              { fontSize: WidthMoreThenHeight ? 18 : width > 400 ? 18 : 16 },
            ]}>
            {t('mentalHealth:mental_question_3')}
          </Text>
          <Text style={styles.scoreBoardText}>
            ({t('mentalHealth:mental_score_3_3')}
            {t('mentalHealth:mental_score_3_2')}
            {t('mentalHealth:mental_score_3_1')}
            {t('mentalHealth:mental_score_3_0')} )
          </Text>
        </View>

        <View style={styles.questionBox}>
          {inputField.map((input) => (
            <React.Fragment key={input.label}>
              <View style={styles.menuBoxTitleBox}>
                <Text style={styles.menuBoxTitle}>{input.label}</Text>
              </View>
              <View style={styles.menuIconContainer}>
                {this.score.map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreBox,
                      {
                        borderColor:
                          this.state[input.properties]?.value === score
                            ? COLOR_LOW['green']
                            : 'rgba(0,0,0,0.5)',
                      },
                      {
                        backgroundColor:
                          this.state[input.properties]?.value === score
                            ? 'rgba(139, 202, 101, 0.2)'
                            : null,
                      },
                    ]}
                    onPress={() =>
                      this._setSelectValue({
                        properties: input.properties,
                        value: score,
                      })
                    }>
                    <Text
                      style={[
                        styles.scoreText,
                        {
                          color:
                            this.state[input.properties]?.value === score
                              ? COLOR_LOW['green']
                              : 'rgba(0,0,0,1)',
                        },
                      ]}>
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  }

  render() {
    const { navigation, user, authentication, currentuser, t } = this.props;
    const {
      submitModalVisible,
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = width.height;

    return (
      <View style={styles.container}>
        <TopNav
          navigation={navigation}
          user={user}
          authentication={authentication}
          currentuser={currentuser}
          leftComponent={<BackButton onPress={() => navigation.goBack()} />}
        />
        <View
          style={[
            styles.contentContainer,
            { width: WidthMoreThenHeight ? width * 0.7 : width * 0.9 },
          ]}>
          <ScrollView
            style={{
              paddingHorizontal: WidthMoreThenHeight
                ? 20
                : width > 400
                ? 20
                : 10,
            }}>
            {this.renderQuestion1()}
            {this.renderQuestion2()}
            {this.renderQuestion3()}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                this._disableBtn() && { backgroundColor: '#c6d2f6' },
              ]}
              onPress={() => this._saveData()}
              disabled={this._disableBtn()}>
              <Text style={[styles.submitText,{ fontSize: WidthMoreThenHeight ? 16 : width > 400 ? 16 : 14 },]}>
                {t('mainScreen:sendDataBtn')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
    width: SCREEN_WIDTH * 0.7,
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
  cardReport: {
    marginTop: 7,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'column',

    borderRadius: 10,
  },
  cardReportTitle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
  },
  textTitleRed: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
  },
  menuBoxTitleBox: {
    borderTopWidth: 1,
    borderTopColor: '#e3f8ff',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  menuBoxTitle: {
    fontSize: 16,
    marginBottom: 3,
  },
  menuIconContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 15,
  },
  scoreBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: 'red',
  },
  scoreText: {
    fontWeight: 'bold',
  },
  // score box
  scoreBoardText: {
    marginTop: 5,
    fontSize: 12,
  },
});
