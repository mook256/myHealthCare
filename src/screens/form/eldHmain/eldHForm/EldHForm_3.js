import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../../styles';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';


const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const WidthMoreThenHeight = SCREEN_WIDTH > SCREEN_HEIGHT;


const data = [
  {
    type: 'radio',
    title: {
      title: '1. ยังสูบบุหรี่ ยาเส้น หรือหยุดสูบไม่เกิน 1 ปี',
    },
    input: {
      properties: 'smokingForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2. ความดันโลหิต ≥ 130/85 หรือแพทย์บอกว่าเป็นความดันโลหิตสูง',
    },
    input: {
      properties: 'bloodPressureLevelForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3. ระดับน้ำตาลในเลือด ≥ 100 หรือแพทย์บอกว่าเป็นเบาหวาน',
    },
    input: {
      properties: 'bloodSugarLevelForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '4. แพทย์หรือพยาบาลบอกว่ามีไขมันในเลือดสูง',
    },
    input: {
      properties: 'bloodFatLevelForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },

  {
    type: 'input',
    title: {
      title: '5. เส้นรอบเอวเกินเกณฑ์หรือไม่',
    },
    input: [
      {
        properties: 'waistLengthForm_2',
        option: {
          label: 'เส้นรอบเอว',
          keyboardType: 'numeric',
          maxLength: 3,
          unit: 'ซม.',
          style: WidthMoreThenHeight ? { width: '49%' } : { width: '100%' },

        },
      },
      {
        properties: 'heightForm',
        option: {
          label: 'ส่วนสูง',
          keyboardType: 'numeric',
          maxLength: 3,
          unit: 'ซม.',
          style: WidthMoreThenHeight ? { width: '49%' } : { width: '100%' },

        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      },
    },
  },
];
const data_2 = [
  {
    type: 'radio',
    title: {
      title: '6. แพทย์บอกว่าเป็นโรคหัวใจขาดเลือดหรืออัมพฤกษ์ อัมพาต',
    },
    input: {
      properties: 'ischemicHeartDiseaseForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '7. มีพ่อ แม่ พี่/น้อง ท้องเดียวกันเป็นโรคหัวใจขาดเลือด หรือโรคอัมพฤกษ์ อัมพาต ก่อนวัยอันควร',
      subtitle: 'ชายเป็นก่อนอายุ 55 ปี หญิงเป็นก่อน 65 ปี',
    },
    input: {
      properties: 'FamilyIschemicHeartDiseaseForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
];

export default class EldHForm_3 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_3',
    };
  }

  _setValue = ({ properties, value }) => {
    this.setState({ [properties]: { value } }, () => {
      this.props.onFormChange(this.state);
    });
  };

  componentDidMount() {
    this.setState(this.props.state);
    const { height, waistLength } = this.props;
    this._setValue({
      properties: 'waistLengthForm_2',
      value: waistLength,
    });
    this._setValue({
      properties: 'heightForm',
      value: height,
    });
    // console.log('height', height);
    // console.log('waistLength', waistLength);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      smokingForm,
      FamilyIschemicHeartDiseaseForm,
      ischemicHeartDiseaseForm,
      waistCircumferenceForm,
      bloodFatLevelForm,
      bloodSugarLevelForm,
      bloodPressureLevelForm,
      waistLengthForm_2,
      heightForm,
    } = this.state;

    const waistLength = waistLengthForm_2?.value;
    const height = heightForm?.value;
    const calcHeight = height / 2;
    if (
      (waistLength > 0 &&
        waistLength !== prevState?.waistLengthForm_2?.value) ||
      (height > 0 && height !== prevState?.heightForm?.value)
    ) {
      if (waistLength > calcHeight) {
        this._setValue({
          properties: 'summary_waist',
          value: 'เกินค่ามาตรฐาน',
        });
        this._setValue({
          properties: 'waistCircumferenceForm',
          value: 'ใช่',
        });
      } else if (waistLength <= calcHeight) {
        this._setValue({
          properties: 'summary_waist',
          value: 'อยู่ในค่ามาตรฐาน',
        });
        this._setValue({
          properties: 'waistCircumferenceForm',
          value: 'ไม่ใช่',
        });
      } else {
        this._setValue({
          properties: 'summary_waist',
          value: null,
        });
        this._setValue({ properties: 'waistCircumferenceForm', value: null });
      }
    }

    const dataArr = [
      smokingForm?.value,
      FamilyIschemicHeartDiseaseForm?.value,
      ischemicHeartDiseaseForm?.value,
      waistCircumferenceForm?.value,
      bloodFatLevelForm?.value,
      bloodSugarLevelForm?.value,
      bloodPressureLevelForm?.value,
    ];

    const score = {};
    dataArr.forEach((data) => {
      score[data] = (score[data] || 0) + 1;
    });

    const validate = !!(
      smokingForm?.value !== prevState.smokingForm?.value ||
      FamilyIschemicHeartDiseaseForm?.value !==
        prevState.FamilyIschemicHeartDiseaseForm?.value ||
      ischemicHeartDiseaseForm?.value !==
        prevState.ischemicHeartDiseaseForm?.value ||
      waistCircumferenceForm?.value !==
        prevState.waistCircumferenceForm?.value ||
      bloodFatLevelForm?.value !== prevState.bloodFatLevelForm?.value ||
      bloodSugarLevelForm?.value !== prevState.bloodSugarLevelForm?.value ||
      bloodPressureLevelForm?.value !== prevState.bloodPressureLevelForm?.value
    );

    if (score['ใช่'] > 0 && validate) {
      if (score['ใช่'] >= 5) {
        this._setValue({
          properties: 'carfiovascular_summary',
          value: 'มีความเสี่ยงสูงมาก',
        });
      } else if (score['ใช่'] >= 3) {
        this._setValue({
          properties: 'carfiovascular_summary',
          value: 'มีความเสี่ยงสูง',
        });
      } else if (score['ใช่'] <= 2) {
        this._setValue({
          properties: 'carfiovascular_summary',
          value: 'มีความเสี่ยง',
        });
      }
    } else if (score['ไม่ใช่'] > 0 && validate) {
      this._setValue({
        properties: 'carfiovascular_summary',
        value: 'ไม่มีความเสี่ยง',
      });
    }
  }

  renderForm() {
    const renderSummaryText = (text) => {
      return <Text style={styles.text}>{text}</Text>;
    };

    const carfiovascular_summary = this.state?.carfiovascular_summary?.value;
    const summary_waist = this.state?.summary_waist?.value;
    return (
      <>
        {data.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
        {summary_waist ? renderSummaryText(`เส้นรอบเอว${summary_waist}`) : null}
        {data_2.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
        {carfiovascular_summary
          ? renderSummaryText(
              `แปลผลความเสี่ยงต่อโรคหัวใจและหลอดเลือด\n"${carfiovascular_summary}"`,
            )
          : null}
      </>
    );
  }

  renderBottom() {
    const { step } = this.state;

    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => {
            setOxford();
          }}
          style={[
            styles.btnBox,
            {
              backgroundColor: true ? '#347ec7' : colors.info,
            },
          ]}>
          <Button>
            {true ? (
              <Text style={styles.btnText}>แปลผลคะแนนโรคข้อเข่าเสื่อม</Text>
            ) : (
              <Text style={[styles.btnText, { fontSize: 18 }]}>SUMMARY</Text>
            )}
          </Button>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <>
        {this.renderForm()}
        {/* {this.renderBottom()} */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottomContainer: {
    // justifyContent: 'space-between',
    padding: 10,
  },
  rowContainer: {
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    margin: 10,
    color: colors.textInfo,
  },
});
