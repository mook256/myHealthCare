import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../../../styles';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';

const data_1 = [
  {
    type: 'radio',
    title: {
      title:
        '1. ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึกหดหู่ เศร้า หรือท้อแท้ สิ้นหวัง หรือไม่',
    },
    input: {
      properties: 'Q2_1_choice',
      choice: [
        { label: 'มี' },
        {
          label: 'ไม่มี',
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '2. ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึกเมื่อทำอะไรก็ไม่เพลิดเพลินหรือไม่',
    },
    input: {
      properties: 'Q2_2_choice',
      choice: [
        { label: 'มี' },
        {
          label: 'ไม่มี',
        },
      ],
    },
  },
];
const data_2 = [
  {
    type: 'text',
    title: {
      title: 'การคัดกรองโรคซึมเศร้าด้วย 9 คำถาม',
      subtitle:
        '- เน้นการถามถึงอาการที่เกิดขึ้นในช่วง 2 สัปดาห์ที่ผ่านมาจนถึงวันที่สัมภาษณ์ \n - ถามทีละข้อ ไม่ช่้าหรือเร็วกเินไป พยายามให้ได้คำตอบทุกข้อ \n - ขณะสอบถาม ถ้าผู้สูงอายุไม่เข้าใจให้ถามซ้ำ ไม่ควรอธิบายหรือขยายความเพิ่มเติม ควรถามซ้ำจนกว่าผู้สูงอายุจะตอบตามความเข้าใจของตัวเอง',
    },
  },
  {
    type: 'text',
    title: {
      title:
        'ในช่วง 2 สัปดาห์ที่ผ่านมารวมทั้งวันนี้ ท่านมีอาการเหล่านี้บ่อยแค่ไหน',
    },
  },
  {
    type: 'radio',
    title: {
      title: '1. เบื่อ ไม่สนใจอยากทำอะไร',
    },
    input: {
      properties: 'depressed_1',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2. ไม่สบาย ซึมเศร้า ท้อแท้',
    },
    input: {
      properties: 'depressed_2',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3. หลับยาก หรือหลับๆ ตื่นๆ หรือ หลับมากไป',
    },
    input: {
      properties: 'depressed_3',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '4. เหนื่อยง่าย หรือ ไม่ค่อยมีแรง',
    },
    input: {
      properties: 'depressed_4',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '5. เบื่ออาหาร หรือ กินมากเกินไป',
    },
    input: {
      properties: 'depressed_5',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '6. รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวผิดหวัง',
    },
    input: {
      properties: 'depressed_6',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '7. สมาธิไม่ดีเวลาทําอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทํางานที่ต้องใช้ความตั้งใจ',
    },
    input: {
      properties: 'depressed_7',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '8. พูดช้า ทําอะไรช้าลงจนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้',
    },
    input: {
      properties: 'depressed_8',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '9. คิดทําร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี',
    },
    input: {
      properties: 'depressed_9',
      choice: [
        { label: 'ไม่มีเลย', value: 0 },
        { label: 'เป็นบางวัน (1-7 วัน)', value: 1 },
        { label: 'เป็นบ่อย (มากกว่า 7วัน)', value: 2 },
        { label: 'เป็นทุกวัน', value: 3 },
      ],
    },
  },
];

export default class EldHForm_8 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_8',
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
    const { Q2_1_choice, Q2_2_choice } = this.state;
    if (
      prevState?.Q2_1_choice?.value !== Q2_1_choice?.value ||
      prevState?.Q2_2_choice?.value !== Q2_2_choice?.value
    ) {
      if (
        (Q2_1_choice?.value === 'มี' && Q2_2_choice?.value === 'ไม่มี') ||
        (Q2_1_choice?.value === 'ไม่มี' && Q2_2_choice?.value === 'มี') ||
        (Q2_1_choice?.value === 'มี' && Q2_2_choice?.value === 'มี')
      ) {
        this.setState({
          Q9_show: true,
        });
        this._setValue({
          properties: 'depressed',
          value: null,
        });
      } else if (
        Q2_1_choice?.value === 'ไม่มี' &&
        Q2_2_choice?.value === 'ไม่มี'
      ) {
        this.setState({
          Q9_show: false,
        });
        this._setValue({
          properties: 'depressed',
          value: 'ปกติ',
        });
      }
    }
  }

  renderForm() {
    const {
      Q9_show,
      depressed_1,
      depressed_2,
      depressed_3,
      depressed_4,
      depressed_5,
      depressed_6,
      depressed_7,
      depressed_8,
      depressed_9,
      summary_depressed,
    } = this.state;

    const setDepressed = () => {
      let score = 0;
      const depresseddValidate = !!(
        depressed_1 &&
        depressed_2 &&
        depressed_3 &&
        depressed_4 &&
        depressed_5 &&
        depressed_6 &&
        depressed_7 &&
        depressed_8 &&
        depressed_9
      );

      if (depresseddValidate) {
        for (let i = 1; i <= 9; i++) {
          score += data_2
            .find((x) => x?.input?.properties === `depressed_${i}`)
            ?.input?.choice?.find(
              (x) => x?.label === this.state?.[`depressed_${i}`]?.value,
            )?.value;
        }
        let depressed_group = '';
        if (score >= 19) {
          depressed_group =
            'มีอาการโรคซึมเศร้า ระดับรุนแรง (Major Depression, Severe)';
        } else if (score >= 13) {
          depressed_group =
            'มีอาการของโรคซึมเศร้า ระดับปานกลาง (Major Depression, Moderate)';
        } else if (score >= 7) {
          depressed_group =
            'มีอาการของโรคซึมเศร้า ระดับน้อย (Major Depression, Mild)';
        } else if (score >= 0) {
          depressed_group =
            'ไม่มีอาการโรคซึมเศร้าหรือมีอาการโรคซึมเศร้าระดับน้อยมาก';
        } else {
          depressed_group = null;
        }
        this._setValue({
          properties: 'summary_depressed',
          value: {
            depressed_point: `${score}`,
            depressed_group: depressed_group,
          },
        });
        return true;
      } else {
        Alert.alert(
          'แปลผลคะแนนโรคซึมเศร้า 9 คำถาม',
          'กรุณาทำแบบทดสอบให้ครบทุกข้อ',
        );
        return false;
      }
    };
    const default_depressed = this.state.depressed?.value;
    const depressed_point = summary_depressed?.value?.depressed_point;
    const depressed_group = summary_depressed?.value?.depressed_group;
    const renderSummaryText = (text) => {
      return <Text style={styles.textColor}>{text}</Text>;
    };
    return (
      <>
        <LabelBox
          title={{
            subtitle:
              '- เน้นการถามถึงอาการที่เกิดขึ้นในช่วง 2 สัปดาห์ที่ผ่านมาจนถึงวันที่สัมภาษณ์ \n- ขณะสอบถาม ถ้าผู้สูงอายุไม่เข้าใจให้ถามซ้ำ ไม่ควรอธิบายหรือขยายความเพิ่มเติม ควรถามซ้ำจนกว่าผู้สูงอายุจะตอบตามความเข้าใจของตัวเอง',
          }}
        />

        {data_1.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
        {default_depressed
          ? renderSummaryText(`แปลผลคัดกรองโรคซึมเศร้า "${default_depressed}"`)
          : null}
        {Q9_show ? (
          <>
            {data_2.map((item, i) => (
              <React.Fragment key={i}>
                <RenderItem
                  item={item}
                  state={this.state}
                  setState={(value) => this._setValue(value)}
                />
              </React.Fragment>
            ))}
            {depressed_point ? (
              <>
                <Text style={styles.text}>
                  รวมคะแนนทั้งสิ้น {depressed_point} คะแนน
                </Text>
                <Text style={styles.textColor}>{depressed_group}</Text>
              </>
            ) : null}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => {
                  setDepressed();
                }}
                style={[
                  styles.btnBox,
                  {
                    backgroundColor: true ? '#347ec7' : colors.info,
                  },
                ]}>
                <Button>
                  {true ? (
                    <Text style={styles.btnText}>แปลผลคัดกรองโรคซึมเศร้า</Text>
                  ) : (
                    <Text style={[styles.btnText, { fontSize: 18 }]}>
                      SUMMARY
                    </Text>
                  )}
                </Button>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
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
  bottomContainer: {
    // justifyContent: 'space-between',
    padding: 10,
  },
  textColor: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.textInfo,
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
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
