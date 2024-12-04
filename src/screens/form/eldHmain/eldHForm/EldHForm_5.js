import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../../styles';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';

const data = [
  {
    type: 'dropdown',
    title: {
      title: '1. การแปรงฟัน',
    },
    input: {
      properties: 'brushTeethForm',
      choice: [
        { label: 'ไม่ได้แปรงฟัน ' },
        { label: 'แปรงแต่ไม่ได้ใช้แปรงสีฟัน	' },
        { label: 'แปรงวันละ 1 ครั้ง เช้าหรือก่อนนอน ' },
        { label: 'แปรงวันละ 2 ครั้ง เช้าและก่อนนอน' },
        { label: 'แปรงมากกว่า 2 ครั้งต่อวัน ระบุ' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        option: {
          label: 'ระบุ',
          style: { height: 50 },
        },
        properties: 'brushTeethForm_input',
      },
    ],
    show: 'brushTeethForm_input_show',
  },
  {
    type: 'radio',
    title: {
      title: '2. การใช้ยาสีฟันผสมฟลูโอไรด์ทุกวัน',
    },
    input: {
      properties: 'fluoriteForm',
      choice: [{ label: 'ใช้' }, { label: 'ไม่ใช้' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3. ทําความสะอาดซอกฟันทุกวัน / เกือบทุกวัน',
    },
    input: {
      properties: 'cleaningBetweenTeethForm',
      choice: [{ label: 'ทำ' }, { label: 'ไม่ทำ' }],
    },
  },
  {
    type: 'input',
    title: {
      title: '4. จํานวนฟัน (กรุณาระบุจำนวน ถ้าไม่มีให้ใส่ 0)',
    },
    input: [
      {
        properties: 'numberTeethForm',
        option: {
          label: 'จำนวนฟันแท้',
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'ซี่',
        },
      },
      {
        properties: 'numberCavitiesForm',
        option: {
          label: 'จำนวนฟันผุ',
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'ซี่',
        },
      },
      {
        properties: 'numberBackTeethForm',
        option: {
          label: 'จำนวนคู่สบฟันหลัง ฟันแท้ กับ ฟันแท้',
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'คู่',
        },
      },
      {
        properties: 'permanentAndArtificialTeethForm',
        option: {
          label: 'จำนวนคู่สบฟันหลัง ฟันแท้ กับ ฟันเทียม ',
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'คู่',
        },
      },
      {
        properties: 'artificialAndArtificialTeethForm',
        option: {
          label: 'จำนวนคู่สบฟันหลัง ฟันเทียม กับ ฟันเทียม ',
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'คู่',
        },
      },
    ],
  },
  {
    type: 'radio',
    title: {
      title: '5. สูบบุหรี่มากกว่า 10 มวนต่อวัน',
    },
    input: {
      properties: 'numberSmokingForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '6. เคี้ยวหมากเป็นประจำ',
    },
    input: {
      properties: 'chewingBetelNutsForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '7. เนื้อเยื่อช่องปากมีปุ่ม ก้อนเนื้อ หรือแผลเรื้อรัง,',
    },
    input: {
      properties: 'lumpButtonForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '8. เหงือกมีเลือดออก มีฝีหนอง หรือมีฟันโยก,',
    },
    input: {
      properties: 'bleedingGumsForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '9. มีฟันผุเป็นรู เสียวฟัน ฟันหัก ฟันแตกเหลือแต่ตอฟัน,',
    },
    input: {
      properties: 'sensitiveTeethForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '10. ไม่มีฟันเคี้ยวอาหารกลืนไม่ได้ สําลักอาหาร',
    },
    input: {
      properties: 'noTeethForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '11. จําเป็นต้องใช้ฟันเทียมหรือ ทําฟันเทียมใหม่',
    },
    input: {
      properties: 'useDenturesForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '12. เคยได้รับการตรวจหรือรักษาจากทันตบุคลากร',
    },
    input: {
      properties: 'examinedByDentalPersonnelForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '13. ท่านต้องการการดูแลรักษาช่องปาก',
    },
    input: {
      properties: 'oralCareForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
];

export default class EldHForm_5 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_5',
    };
  }

  _setValue = ({ properties, value }) => {
    this.setState({ [properties]: { value } }, () => {
      this.props.onFormChange(this.state);
    });
  };

  componentDidMount() {
    this.setState(this.props.state);
    this.setState({
      brushTeethForm_input_show: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      lumpButtonForm,
      bleedingGumsForm,
      sensitiveTeethForm,
      noTeethForm,
      useDenturesForm,
      brushTeethForm,
    } = this.state;

    const dataArr = [
      lumpButtonForm?.value,
      bleedingGumsForm?.value,
      sensitiveTeethForm?.value,
      noTeethForm?.value,
      useDenturesForm?.value,
    ];

    const score = {};
    dataArr.forEach((data) => {
      score[data] = (score[data] || 0) + 1;
    });

    const validate = !!(
      lumpButtonForm?.value !== prevState?.lumpButtonForm?.value ||
      bleedingGumsForm?.value !== prevState?.bleedingGumsForm?.value ||
      sensitiveTeethForm?.value !== prevState?.sensitiveTeethForm?.value ||
      noTeethForm?.value !== prevState?.noTeethForm?.value ||
      useDenturesForm?.value !== prevState?.useDenturesForm?.value
    );

    if (score['ใช่'] > 0 && validate) {
      this._setValue({
        properties: 'tooth_summary',
        value: 'ส่งต่อเพื่อดูแลรักษาช่องปาก',
      });
    } else if (!score['ใช่'] && validate) {
      this._setValue({ properties: 'tooth_summary', value: 'ไม่ต้องส่งต่อ' });
    }

    if (prevState.brushTeethForm?.value !== brushTeethForm?.value) {
      if (brushTeethForm?.value === 'แปรงมากกว่า 2 ครั้งต่อวัน ระบุ') {
        this.setState({
          brushTeethForm_input_show: false,
        });
      } else {
        this.setState({
          brushTeethForm_input_show: true,
        });
      }
    }
    // console.log('form', brushTeethForm?.value);
  }

  renderForm() {
    const { tooth_summary } = this?.state;
    const renderSummaryText = (text) => {
      return <Text style={styles.text}>{text}</Text>;
    };

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
        {tooth_summary?.value
          ? renderSummaryText(`แปลผล\n"${tooth_summary?.value}"`)
          : null}
      </>
    );
  }

  renderBottom() {
    const { step } = this.state;

    return (
      <Row style={styles.rowContainer}>
        <TouchableOpacity
          onPress={() => {
            if (step > 1) {
              this.setState({ step: step - 1 });
            }
          }}
          style={styles.btn}>
          <Button>
            <FontAwesome name={'arrow-left'} size={30} />
          </Button>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (step < 3) {
              this.setState({ step: step + 1 });
            }
          }}
          style={styles.btn}>
          <Button>
            <FontAwesome name={'arrow-right'} size={30} />
          </Button>
        </TouchableOpacity>
      </Row>
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
    textAlign: 'center',
    margin: 10,
    color: colors.textInfo,
  },
});
