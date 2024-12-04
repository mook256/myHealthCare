import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../../styles';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const WidthMoreThenHeight = SCREEN_WIDTH > SCREEN_HEIGHT;

const data_1 = {
  type: 'input',
  title: {
    title: 'ความยาวเส้นรอบเอว',
  },
  input: [
    {
      properties: 'waistLengthForm',
      option: {
        placeholder: 'ความยาวเส้นรอบเอว',
        keyboardType: 'numeric',
        maxLength: 5,
        unit: 'ซม.',
      },
    },
  ],
};
const data_2 = {
  type: 'input',
  title: {
    title: 'ดัชนีมวลกาย(BMI)',
  },
  input: [
    {
      properties: 'weight',
      option: {
        label: 'น้ำหนัก',
        keyboardType: 'numeric',
        unit: 'กก.',
        style: WidthMoreThenHeight ? { width: '49%' } : { width: '100%' },
      },
    },
    {
      properties: 'height',
      option: {
        label: 'ส่วนสูง',
        keyboardType: 'numeric',
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
};

const data_3 = {
  type: 'input',
  title: {
    title: 'ความดันโลหิต',
  },
  input: [
    {
      properties: 'highBloodPressureForm',
      option: {
        label: 'ความดันโลหิต (ตัวบน)',
        keyboardType: 'numeric',
        maxLength: 3,
        unit: 'มม.ปรอท',
      },
    },
    {
      properties: 'lowBloodPressureForm',
      option: {
        label: 'ความดันโลหิต (ตัวล่าง)',
        keyboardType: 'numeric',
        maxLength: 3,
        unit: 'มม.ปรอท',
      },
    },
    {
      properties: 'pulseForm',
      option: {
        label: 'ชีพจร',
        keyboardType: 'numeric',
        maxLength: 3,
        unit: 'ครั้ง/นาที',
      },
    },
  ],
};
const data_4 = {
  type: 'input',
  title: {
    title: 'ระดับน้ำตาลจากปลายนิ้ว',
  },
  input: [
    {
      properties: 'sugarLevelFingertipsForm',
      option: {
        label: 'ระดับน้ำตาลจากปลายนิ้ว',
        keyboardType: 'numeric',
        maxLength: 3,
        unit: 'มก./ดล.',
      },
    },
  ],
};
const data_5 = {
  type: 'radio',
  title: {
    title: 'ผู้สูงอายุมีการงดอาหารก่อนมาตรวจอย่างน้อย 8 ชั่วโมงหรือไม่',
  },
  input: {
    properties: 'hasAbstainingFood',
    choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
  },
};

const data_5_input = {
  type: 'input',
  title: {
    title: 'หลังรับประทานอาหาร',
  },
  input: [
    {
      properties: 'hasAbstainingFood_hour_input',
      option: {
        // label: 'ชั่วโมง',
        keyboardType: 'numeric',
        unit: 'ชั่วโมง',
        style: { width: '49%' },
      },
    },
    {
      properties: 'hasAbstainingFood_minute_input',
      option: {
        keyboardType: 'numeric',
        unit: 'นาที',
        style: { width: '49%' },
      },
    },
  ],
  show: 'hasAbstainingFood_input_show',
  style: {
    wrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingBottom: 20,
    },
  },
};

export default class EldHForm_2 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_2',
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
      waistLengthForm,
      weight,
      height,
      highBloodPressureForm,
      lowBloodPressureForm,
      sugarLevelFingertipsForm,
      hasAbstainingFood,
    } = this.state;
    const { gender } = this.props;

    //waistline
    const waistLength = waistLengthForm?.value;
    if (waistLength > 0 && waistLength !== prevState?.waistLengthForm?.value) {
      if (
        (waistLength <= 90 && gender === 'ชาย') ||
        (waistLength <= 80 && gender === 'หญิง')
      ) {
        this._setValue({ properties: 'summary_waistLength', value: 'ปกติ' });
      } else if (
        (waistLength > 90 && gender === 'ชาย') ||
        (waistLength > 80 && gender === 'หญิง')
      ) {
        this._setValue({
          properties: 'summary_waistLength',
          value: 'อ้วนลงพุง',
        });
      }
    }

    //bmi
    if (
      weight?.value > 0 &&
      height?.value > 0 &&
      (weight?.value !== prevState?.weight?.value ||
        height?.value !== prevState?.height?.value)
    ) {
      const w = weight?.value;
      const h = height?.value;
      const b = w / (h * 0.01 * (h * 0.01));
      let bmi_summary = '';
      if (b < 18.5) {
        bmi_summary = 'ผอม';
      } else if (b < 23) {
        bmi_summary = 'ปกติ';
      } else if (b < 25) {
        bmi_summary = 'ท้วม';
      } else if (b < 30) {
        bmi_summary = 'อ้วน';
      } else if (b >= 30) {
        bmi_summary = 'อ้วนมาก';
      }
      this._setValue({
        properties: 'summary_bmi',
        value: { point: b.toFixed(2), summary: bmi_summary },
      });
    }

    //blood pressure
    const highBloodPressure = highBloodPressureForm?.value;
    const lowBloodPressure = lowBloodPressureForm?.value;
    if (
      highBloodPressure > 0 &&
      lowBloodPressure > 0 &&
      (highBloodPressure !== prevState?.highBloodPressureForm?.value ||
        lowBloodPressure !== prevState?.lowBloodPressureForm?.value)
    ) {
      if (highBloodPressure > 140 && lowBloodPressure > 90) {
        this._setValue({
          properties: 'summary_pb',
          value: 'สูง',
        });
      } else if (highBloodPressure >= 130 && lowBloodPressure >= 85) {
        this._setValue({
          properties: 'summary_pb',
          value: 'ค่อนข้างสูง',
        });
      } else if (highBloodPressure >= 120 && lowBloodPressure >= 80) {
        this._setValue({ properties: 'summary_pb', value: 'ปกติ' });
      } else {
        this._setValue({ properties: 'summary_pb', value: 'เหมาะสม' });
      }
    }

    //meel
    const bloodGlucose = sugarLevelFingertipsForm?.value;
    const meel = hasAbstainingFood?.value;
    if (
      bloodGlucose > 0 &&
      meel !== prevState?.hasAbstainingFood?.value &&
      meel === 'ไม่ใช่'
    ) {
      this._setValue({
        properties: 'summary_bg',
        value: '',
      });
      if (bloodGlucose >= 200) {
        this._setValue({
          properties: 'summary_meel',
          value: 'โรคเบาหวาน',
        });
        this._setValue({
          properties: 'summary_bg',
          value:
            'ให้ตรวจระดับน้ำตาลจากปลายนิ้วโดยอดอาหารก่อนตรวจซ้ำภายใน 2 สัปดาห์',
        });
      } else if (bloodGlucose >= 140) {
        this._setValue({
          properties: 'summary_meel',
          value: 'มีความเสี่ยงเป็นเบาหวาน',
        });
      } else {
        this._setValue({
          properties: 'summary_meel',
          value: 'ปกติ',
        });
      }
    } else if (
      bloodGlucose > 0 &&
      meel !== prevState?.hasAbstainingFood?.value &&
      meel === 'ใช่'
    ) {
      if (bloodGlucose >= 126) {
        this._setValue({
          properties: 'summary_meel',
          value: 'โรคเบาหวาน',
        });
        this._setValue({
          properties: 'summary_bg',
          value: 'ให้ตรวจซ้ำ DTX ภายใน 2 สัปดาห์',
        });
      } else if (bloodGlucose >= 100) {
        this._setValue({
          properties: 'summary_meel',
          value: 'มีความเสี่ยงเป็นเบาหวาน',
        });
        this._setValue({
          properties: 'summary_bg',
          value: 'ให้ตรวจซ้ำภายใน 1 เดือน',
        });
      } else {
        this._setValue({
          properties: 'summary_meel',
          value: 'ปกติ',
        });
      }
    }

    if (prevState?.hasAbstainingFood?.value !== hasAbstainingFood?.value) {
      if (hasAbstainingFood?.value === 'ไม่ใช่') {
        this.setState({
          hasAbstainingFood_input_show: false,
        });
      } else {
        this.setState({
          hasAbstainingFood_input_show: true,
        });
      }
    }
  }

  renderForm() {
    const rederItem = (data) => {
      return (
        <RenderItem
          item={data}
          state={this.state}
          setState={(value) => this._setValue(value)}
        />
      );
    };

    const renderSummaryText = (text) => {
      return <Text style={styles.text}>{text}</Text>;
    };

    const summary_waistLength = this.state?.summary_waistLength?.value;
    const summary_bmi = this.state?.summary_bmi?.value;
    const summary_pb = this.state?.summary_pb?.value;
    const summary_bg = this.state?.summary_bg?.value;
    const summary_meel = this.state?.summary_meel?.value;
    const hasAbstainingFood = this.state?.hasAbstainingFood?.value;

    return (
      <>
        {rederItem(data_1)}
        {summary_waistLength
          ? renderSummaryText(`แปลผลความยาวเส้นรอบเอว "${summary_waistLength}"`)
          : null}
        {rederItem(data_2)}
        {summary_bmi
          ? renderSummaryText(
              `แปลผล BMI ${summary_bmi?.point} kg/m​² "${summary_bmi?.summary}"`,
            )
          : null}
        {rederItem(data_3)}
        {summary_pb
          ? renderSummaryText(`แปลผลความดันโลหิต "${summary_pb}"`)
          : null}
        {rederItem(data_4)}
        {rederItem(data_5)}
        {summary_meel ? (
          <>
            <Text style={styles.textSummary}>
              แปลผลน้ำตาลในเลือด "{summary_meel}"
            </Text>
            <Text style={[styles.textSummary, { marginBottom: 10 }]}>
              {summary_bg}
            </Text>
          </>
        ) : null}
        {hasAbstainingFood ? rederItem(data_5_input) : null}
      </>
    );
  }

  render() {
    return <>{this.renderForm()}</>;
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: 10,
    color: colors.textInfo,
  },
  textSummary: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.textInfo,
  },
});
