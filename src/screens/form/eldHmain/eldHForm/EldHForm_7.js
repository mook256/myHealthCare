import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../../styles';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';

const note = {
  type: 'text',
  title: {
    title: 'ข้อแนะนำ',
    subtitle:
      'แบบทดสอบสภาพสมอง : Abbreviated Mental Test (AMT) ใช้คัดกรองสภาวะการรู้คิดในผู้สูงอายุ ด้วยการสอบถาม ซึ่งคําตอบที่ถูกต้องเป็นข้อมูลที่เป็นจริงขณะทําการสอบถาม',
  },
};

export default class EldHForm_7 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_7',
    };
  }

  _setValue = ({ properties, value }) => {
    this.setState({ [properties]: { value } }, () => {
      this.props.onFormChange(this.state);
    });
  };

  componentDidMount() {
    this.setState(this.props.state);
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
    } = this.state;

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
    }
  }

  renderBottom() {
    const { amt_summary } = this.state;
    const score = {};

    const setADL = () => {
      const dataArr = [
        this?.state?.amt_1_choice?.value,
        this?.state?.amt_2_choice?.value,
        this?.state?.amt_3_choice?.value,
        this?.state?.amt_4_choice?.value,
        this?.state?.amt_5_choice?.value,
        this?.state?.amt_6_choice?.value,
        this?.state?.amt_7_choice?.value,
        this?.state?.amt_8_choice?.value,
        this?.state?.amt_9_choice?.value,
        this?.state?.amt_10_choice?.value,
      ];

      dataArr.forEach((data) => {
        score[data] = (score[data] || 0) + 1;
      });

      if (score['ถูก'] > 0) {
        if (score['ถูก'] <= 7) {
          this._setValue({
            properties: 'amt_summary',
            value: { summary: 'ผิดปกติ', point: score['ถูก'] },
          });
        } else {
          this._setValue({
            properties: 'amt_summary',
            value: { summary: 'ปกติ', point: score['ถูก'] },
          });
        }
      }
    };

    return (
      <View style={styles.bottomContainer}>
        {amt_summary?.value ? (
          <Text style={styles.text}>
            การแปลผล {amt_summary?.value?.point} คะแนน (
            {amt_summary?.value?.summary})
          </Text>
        ) : null}
        {amt_summary?.value?.point <= 7 ? (
          <Text
            style={[
              styles.text,
              { color: colors.textMuted, textAlign: 'center' },
            ]}>
            *เนื่องจากผลการประมาณต่ำกว่าเกณฑ์กรุณาทำแบบประเมิณ MMSE-Thai 2002
            เพิ่มเติมด้วย
          </Text>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            setADL();
          }}
          style={[
            styles.btnBox,
            {
              backgroundColor: true ? '#347ec7' : colors.info,
            },
          ]}>
          <Button>
            <Text style={styles.btnText}>แปลผลคะแนน AMT</Text> :
          </Button>
        </TouchableOpacity>
      </View>
    );
  }

  renderForm() {
    const rederItem = (i, label) => {
      const choice = {
        type: 'radio',
        title: {
          title: `${i + 1}. ${label}`,
        },
        input: {
          properties: `amt_${i + 1}_choice`,
          choice: [{ label: 'ถูก' }, { label: 'ผิด' }],
        },
      };
      const input = {
        type: 'input',
        input: [
          {
            label: 'คำตอบของผู้สูงอายุ',
            properties: `amt_${i + 1}_input`,
          },
        ],
      };

      return (
        <>
          <RenderItem
            item={choice}
            state={this.state}
            setState={(value) => this._setValue(value)}
          />
          <RenderItem
            item={input}
            state={this.state}
            setState={(value) => this._setValue(value)}
          />
        </>
      );
    };

    const questionArr = [
      'อายุเท่าไร',
      'ขณะนี้เวลาอะไร',
      'ที่อยู่ปัจจุบันของท่านคือ',
      'ปีนี้ปีอะไร',
      'สถานที่ตรงนี้เรียกว่าอะไร',
      'คนนี้คือใคร(ชี้คนสัมภาษณ์) และคนนี้คือใคร(ชี้ที่คนใกล้ๆ : ญาติ)',
      'วันเดือนปีเกิดของท่านคือ',
      'เหตุการณ์ 14 ตุลา หรือ วันมหาวิปโยค เกิดใน พ.ศ. อะไร',
      'พระมหากษัตริย์องค์ปัจจุบันมีพระนามว่าอะไร',
      'ให้นับถอยหลังจาก 20 จนถึง 1',
    ];

    return (
      <>
        <RenderItem
          item={note}
          state={this.state}
          setState={(value) => this._setValue(value)}
        />
        {questionArr.map((label, i) => (
          <React.Fragment key={i}>{rederItem(i, label)}</React.Fragment>
        ))}
      </>
    );
  }

  render() {
    return (
      <>
        {this.renderForm()}
        {this.renderBottom()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 5,
  },
  btnBox: {
    borderRadius: 10,
    width: '50%',
    alignSelf: 'center',
    margin: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.success,
  },
});
