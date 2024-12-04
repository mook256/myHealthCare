import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import RNRestart from 'react-native-restart';
import TopNav from '../../../components/TopNav';
import BackButton from '../../../components/buttons/BackButton';
import { MHW_HOST, MHW_API_KEY, COLOR_LOW } from '../../../utils/constants';
import ModalUploadSubmitView from '../../main/ModalUploadSubmitView';
import { clearCurrentUser } from '../../../redux/actions/currentuser';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const initialState = {
  feedingValue: null,
  transferValue: null,
  groomingValue: null,
  tolietUseValue: null,
  bathingValue: null,
  mobilityValue: null,
  stairsValue: null,
  dressingValue: null,
  bowelsValue: null,
  bladderValue: null,
};

export default class AdlFormScreen extends Component {
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
    // this.score = ['3', '2', '1', '0'];
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
      !this.state.feedingValue ||
      !this.state.transferValue ||
      !this.state.groomingValue ||
      !this.state.tolietUseValue ||
      !this.state.bathingValue ||
      !this.state.mobilityValue ||
      !this.state.stairsValue ||
      !this.state.dressingValue ||
      !this.state.bowelsValue ||
      !this.state.bladderValue;
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
        feedingValue: this.state.feedingValue,
        transferValue: this.state.transferValue,
        groomingValue: this.state.groomingValue,
        tolietUseValue: this.state.tolietUseValue,
        bathingValue: this.state.bathingValue,
        mobilityValue: this.state.mobilityValue,
        stairsValue: this.state.stairsValue,
        dressingValue: this.state.dressingValue,
        bowelsValue: this.state.bowelsValue,
        bladderValue: this.state.bladderValue,
      };

      // console.log(value);

      const url = `${MHW_HOST}/mobileservice/mhcadladd`;
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
        // console.log(response);
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

  renderQuestion() {
    const { t } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    const inputField = [
      {
        label: 'Feeding ( การรับประทานอาหารเมื่อเตรียมไว้ให้เรียบร้อยต่อหน้า )',
        properties: 'feedingValue',
        options: [
          {
            score: 0,
            text: 'ไม่สามารถตักอาหารเข้าปากได้ต้องมีคนป้อน',
          },
          {
            score: 1,
            text: 'ช่วยใช้ช้อนตักเตรียมไว้ให้หรือตักเป็นชิ้นเล็กๆ ไว้ล่วงหน้า',
          },
          {
            score: 2,
            text: 'ตักอาหารและช่วยตัวเองได้ปกติ',
          },
        ],
      },
      {
        label: 'Transfer ( ลุกนั่งจากที่นอนหรือเตียงไปยังเก้าอี้ )',
        properties: 'transferValue',
        options: [
          {
            score: 0,
            text:
              'ไม่สามารถนั่งได้ ( นั่งแล้วจะล้มเสมอ ) หรือต้องใช้สองคนช่วยกันยกขึ้น',
          },
          {
            score: 1,
            text:
              'ต้องการความช่วยเหลืออย่างมากจึงจะนั่งได้ เช่น ต้องใช้คนที่แข็งแรงหรือมีทักษะ 1คน หรือใช้คนทั่วไป 2คน พยุงหรือดันขึ้นมาจึงสามารถนั่งอยู่ได้ ไว้ล่วงหน้า',
          },
          {
            score: 2,
            text:
              'ต้องการความช่วยเหลือบ้าง เช่น บอกให้ทำตามหรือช่วยพยุงเล็กน้อยหรือต้องมีคนดูความปลอยภัย',
          },
          {
            score: 3,
            text: 'ทำเองได้',
          },
        ],
      },
      {
        label:
          'Grooming ( ล้างหน้า หวีผม แปรงฟัน โกนหนวดในระยะ 24 - 48 ชั่วโมงที่ผ่านมา )',
        properties: 'groomingValue',
        options: [
          {
            score: 0,
            text: 'ต้องการความช่วยเหลือ',
          },
          {
            score: 1,
            text: 'ทำเองได้',
          },
        ],
      },
      {
        label: 'Toliet Use ( การใช้ห้องน้ำ )',
        properties: 'tolietUseValue',
        options: [
          {
            score: 0,
            text: 'ช่วยตัวเองไม่ได้',
          },
          {
            score: 1,
            text:
              'ทำเองได้บ้าง ( อย่างน้อยทำความสะอาดตัวเองได้หลังเสร็จธุระ ) แต่ต้องการความช่วยเหลือบางสิ่ง',
          },
          {
            score: 2,
            text:
              'ช่วยตัวเองได้ดี ( ขึ้นและนั่งลงจากส้วมได้เอง ทำความสะอาดได้เรียบร้อย หลังจากเสร็จธุระแล้วใส่เสื้อผ้าเรียบร้อย )',
          },
        ],
      },
      {
        label: 'Bathing ( การอาบน้ำ )',
        properties: 'bathingValue',
        options: [
          {
            score: 0,
            text: 'ต้องมีคนช่วยเหลือหรือทำให้',
          },
          {
            score: 1,
            text: 'อาบน้ำได้เอง',
          },
        ],
      },
      {
        label: 'Mobility ( การเคลื่อนที่ภายในห้องหรือในบ้าน )',
        properties: 'mobilityValue',
        options: [
          {
            score: 0,
            text: 'เคลื่อนไปไหนไม่ได้',
          },
          {
            score: 1,
            text:
              'ต้องใช้รถเข็นช่วยตัวเองให้เคลื่อนที่ได้เอง ( ไม่ต้องมีคนเข็นให้ ) และเข้ามุมห้องหรือประตูได้',
          },
          {
            score: 2,
            text:
              'เดินหรือเคลื่อนที่โดยมีคนช่วย เช่น พยุง หรือบอกให้ทำตามหรือต้องให้ความสนใจดูแลเพื่อความปลอดภัย',
          },
          {
            score: 3,
            text: 'เดินหรือเคลื่อนที่ได้เอง',
          },
        ],
      },
      {
        label: 'Stairs ( การขึ้นลงบันได 1 ชั้น )',
        properties: 'stairsValue',
        options: [
          {
            score: 0,
            text: 'ไม่สามารถทำได้',
          },
          {
            score: 1,
            text: 'ต้องการคนช่วยเหลือ',
          },
          {
            score: 2,
            text:
              'ขึ้นลงได้เอง ( ถ้าต้องให้เครื่องช่วยเดิน เช่น cane จะต้องเอาขึ้นลงได้ )',
          },
        ],
      },
      {
        label: 'Dressing ( การสวมเสื้อผ้า )',
        properties: 'dressingValue',
        options: [
          {
            score: 0,
            text: 'ต้องมีคนสวมใส่ให้ ช่วยตัวเองไม่ได้เลยหรือได้น้อย',
          },
          {
            score: 1,
            text: 'ช่วยตัวเองได้ร้อยละ 50 ที่เหลือต้องมีคนช่วย',
          },
          {
            score: 2,
            text:
              'ช่วยตัวเองได้ดี ( รวมทั้งการติดกระดุม รูดซิบ หรือใส่เสื้อผ้าที่ดัดแปลงให้เหมาะสมได้ )',
          },
        ],
      },
      {
        label: 'Bowels ( การกลั้นอุจจาระในระยะ 1 สัปดาห์ที่ผ่านมา )',
        properties: 'bowelsValue',
        options: [
          {
            score: 0,
            text: 'กลั้นไม่ได้หรือต้องการสวนอุจจาระอยู่เสมอ',
          },
          {
            score: 1,
            text: 'กลั้นไม่ได้เป็นบางครั้ง ( เป็นไม่เกิน 1 ครั้งต่อสัปดาห์ )',
          },
          {
            score: 2,
            text: 'กลั้นได้ปกติ',
          },
        ],
      },
      {
        label: 'Bladder ( การกลั้นปัสสาวะในระยะ 1 สัปดาห์ที่ผ่านมา )',
        properties: 'bladderValue',
        options: [
          {
            score: 0,
            text: 'กลั้นไม่ได้หรือใส่สายสวนปัสสาวะแต่ไม่สามารถดูแลตัวเองได้',
          },
          {
            score: 1,
            text: 'กลั้นไม่ได้เป็นบางครั้ง ( ไม่เกินวันละ 1 ครั้ง )',
          },
          {
            score: 2,
            text: 'กลั้นได้ปกติ',
          },
        ],
      },
    ];
    return (
      <View style={styles.cardReportADL}>
        <View style={styles.cardReportTitleADL}>
          {/* <Text style={styles.textTitleRed}>
            {t('mentalHealth:mental_question_1')}
          </Text> */}
          <Text
            style={[
              styles.textTitleADL,
              { fontSize: WidthMoreThenHeight ? 20 : width > 400 ? 20 : 16 },
            ]}>
            แบบประเมินคัดกรอง ( Barthel ADL )
          </Text>
        </View>

        <View style={styles.questionBoxADL}>
          {inputField.map((input) => (
            <React.Fragment key={input.label}>
              <View style={styles.menuBoxTitleBoxADL}>
                <Text style={[styles.menuBoxTitle,{fontSize: WidthMoreThenHeight ? 16 : width > 400 ? 16 : 14 }]}>{input.label}</Text>
              </View>
              <View style={styles.menuIconContainer}>
                {input?.options?.map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreBox,
                      {
                        borderColor:
                          this.state[input.properties]?.value === score.score
                            ? COLOR_LOW['green']
                            : 'rgba(0,0,0,0.5)',
                      },
                      {
                        backgroundColor:
                          this.state[input.properties]?.value === score.score
                            ? 'rgba(139, 202, 101, 0.2)'
                            : null,
                      },
                    ]}
                    onPress={() =>
                      this._setSelectValue({
                        properties: input.properties,
                        value: score.score,
                      })
                    }>
                    <Text
                      style={[
                        styles.scoreText,
                        {
                          color:
                            this.state[input.properties]?.value === score.score
                              ? COLOR_LOW['green']
                              : 'rgba(0,0,0,1)',
                        },
                      ]}>
                      {score.score} = {score.text}
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
    const height = window.height;
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
            styles.contentContainerADL,
            { width: WidthMoreThenHeight ? width * 0.7 : width * 0.9 },
          ]}>
          <ScrollView style={styles.scrollViewContainerADL}>
            {this.renderQuestion()}
            <TouchableOpacity
              style={[
                styles.submitBtnADL,
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
  contentContainerADL: {
    width: SCREEN_WIDTH * 0.7,
    // height: BLOCK_HEIGHT,
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  scrollViewContainer: {
    paddingHorizontal: 20,
  },
  scrollViewContainerADL: {
    paddingHorizontal: 5,
  },
  box: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingTop: 15,
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
  submitBtnADL: {
    marginVertical: 15,
    marginHorizontal: 5,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#4169e1',
    fontSize: 16,
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
  cardReportADL: {
    // marginTop: 7,
    // marginBottom: 15,
    paddingVertical: 15,
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
  cardReportTitleADL: {
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  textTitleRed: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textTitleADL: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
  },
  questionBoxADL: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  menuBoxTitleBox: {
    borderTopWidth: 1,
    borderTopColor: '#e3f8ff',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  menuBoxTitleBoxADL: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#F5F5F5',
  },
  menuBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginBottom: 5,
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
  scoreBoardTextADL: {
    marginTop: 5,
    fontSize: 14,
    // color: '#f5f5f5',
  },
});
