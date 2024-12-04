import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
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
      title: '1.1 วันนี้ วันที่เท่าไหร่',
    },
    input: {
      properties: 'mmse_1_1_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_1_1_input',
      },
    ],
  },
  {
    type: 'radio',
    title: {
      title: '1.2 วันนี้ วันอะไร',
    },
    input: {
      properties: 'mmse_1_2_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_1_2_input',
      },
    ],
  },
  {
    type: 'radio',
    title: {
      title: '1.3 เดือนนี้ เดือนอะไร',
    },
    input: {
      properties: 'mmse_1_3_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_1_3_input',
      },
    ],
  },
  {
    type: 'radio',
    title: {
      title: '1.4 ปีนี้ ปีอะไร',
    },
    input: {
      properties: 'mmse_1_4_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_1_4_input',
      },
    ],
  },
  {
    type: 'radio',
    title: {
      title: '1.5 ฤดูนี้ ฤดูอะไร',
    },
    input: {
      properties: 'mmse_1_5_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_1_5_input',
      },
    ],
  },
];
const data_2 = {
  type: 'radio',
  title: {
    title:
      '2. Orientation for place : ทดสอบการรับรู้เกี่ยวกับที่อยู่ในปัจจุบัน',
  },
  input: {
    properties: 'mmse_2_choice',
    choice: [
      { label: 'กรณีอยู่สถานพยาบาล' },
      { label: 'กรณีอยู่ที่บ้านของผู้ทดสอบ' },
    ],
  },
};

const data_2_1 = [
  {
    type: 'radio',
    title: {
      title: '2.1 สถานที่ตรงนี้เรียกว่าอะไร และ ชื่อว่าอะไร',
    },
    input: {
      properties: 'mmse_2_1_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_1_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_1_input',
      },
    ],
    show: 'mmse_2_1_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.2 ขณะนี้อยู่ชั้นที่เท่าไรของตัวอาคาร',
    },
    input: {
      properties: 'mmse_2_2_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_1_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_2_input',
      },
    ],
    show: 'mmse_2_1_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.3 ที่นี่อยู่ในอำเภออะไร',
    },
    input: {
      properties: 'mmse_2_3_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_1_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_3_input',
      },
    ],
    show: 'mmse_2_1_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.4 ที่นี่จังหวัดอะไร',
    },
    input: {
      properties: 'mmse_2_4_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_1_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_4_input',
      },
    ],
    show: 'mmse_2_1_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.5 ที่นี่ภาคอะไร',
    },
    input: {
      properties: 'mmse_2_5_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_1_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_5_input',
      },
    ],
    show: 'mmse_2_1_show',
  },
];

const data_2_2 = [
  {
    type: 'radio',
    title: {
      title: '2.1 สถานที่ตรงนี้เรียกว่าอะไร และ เลขที่เท่าไร',
    },
    input: {
      properties: 'mmse_2_1_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_2_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_1_input',
      },
    ],
    show: 'mmse_2_2_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.2 ที่นี่หมู่บ้าน (หรือ ละแวก คุ้ม ย่าน ถนน) อะไร',
    },
    input: {
      properties: 'mmse_2_2_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_2_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_2_input',
      },
    ],
    show: 'mmse_2_2_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.3 ที่นี่อำเภอ หรือ เขตอะไร',
    },
    input: {
      properties: 'mmse_2_3_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_2_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_3_input',
      },
    ],
    show: 'mmse_2_2_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.4 ที่นี่จังหวัดอะไร',
    },
    input: {
      properties: 'mmse_2_4_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_2_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_4_input',
      },
    ],
    show: 'mmse_2_2_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.5 ที่นี่ภาคอะไร',
    },
    input: {
      properties: 'mmse_2_5_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
    show: 'mmse_2_2_show',
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_2_5_input',
      },
    ],
    show: 'mmse_2_2_show',
  },
];

const data_3 = {
  type: 'checkbox',
  title: {
    title:
      '3. Registration : ทดสอบการบันทึกความจําโดยให้จําชื่อของ 3 อย่าง ต่อไปนี้จะเป็น \nการทดสอบความจําโดยจะบอกชื่อของ 3 อย่าง ให้คุณ(ตายาย) ฟังดีๆนะคะ จะบอกเพียง \nครั้งเดียว เมื่อพูดจบแล้วให้คุณ (ตายาย) พูดทวนตามที่ได้ยินทั้ง 3 ชื่อ แล้วจำไว้ให้ดีนะคะ \nเดี๋ยวจะถามซ้ำ',
  },
  input: {
    properties: 'mmse_3_select',
    choice: [
      { label: 'ดอกไม้', value: 1 },
      { label: 'แม่น้ำ', value: 1 },
      { label: 'รถไฟ', value: 1 },
    ],
  },
};

const data_4 = [
  {
    type: 'radio',
    title: {
      title:
        '4. Attention or Calculation : ทดสอบสมาธิโดยให้คิดเลขในใจ ถามผู้ถูกทดสอบว่า "คิดเลขในใจเป็นหรือไม่"',
    },
    input: {
      properties: 'mmse_4_choice',
      choice: [{ label: 'คิดเป็น' }, { label: 'คิดไม่เป็น หรือ ไม่ตอบ' }],
    },
  },
  {
    type: 'input',
    title: {
      title:
        ' 4.1 ให้คิดเลขในใจโดยเอา 100 ตั้ง ลบออกทีละ 7 ไปเรื่อยๆ ได้ผลลัพธ์เท่าไร บอกมาทุกครั้ง',
      muted: true,
    },
    show: 'mmse_4_1_choice_show',
    input: [
      {
        properties: 'mmse_4_1_1_input',
        option: {
          value: 1,
          label: 'ครั้งที่ 1',
          keyboardType: 'numeric',
          maxLength: 3,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_1_2_input',
        option: {
          value: 1,
          label: 'ครั้งที่ 2',
          keyboardType: 'numeric',
          maxLength: 3,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_1_3_input',
        option: {
          value: 1,
          label: 'ครั้งที่ 3',
          keyboardType: 'numeric',
          maxLength: 3,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_1_4_input',
        option: {
          value: 1,
          label: 'ครั้งที่ 4',
          keyboardType: 'numeric',
          maxLength: 3,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_1_5_input',
        option: {
          value: 1,
          label: 'ครั้งที่ 5',
          keyboardType: 'numeric',
          maxLength: 3,
          style: { width: '19%' },
        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
      },
    },
  },
  {
    type: 'input',
    title: {
      title:
        ' 4.2 สะกดคำว่า มะนาว ให้คุณ (ตายาย) ฟัง จากนั้นให้คุณ (ตายาย) สะกดถอยหลังจากพยัญชนะตัวหลังไปตัวแรก',
      muted: true,
    },
    show: 'mmse_4_2_choice_show',
    input: [
      {
        properties: 'mmse_4_2_1_input',
        option: {
          value: 1,
          label: 'ตัวที่ 1',
          maxLength: 1,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_2_2_input',
        option: {
          value: 1,
          label: 'ตัวที่ 2',
          maxLength: 1,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_2_3_input',
        option: {
          value: 1,
          label: 'ตัวที่ 3',
          maxLength: 1,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_2_4_input',
        option: {
          value: 1,
          label: 'ตัวที่ 4',
          maxLength: 1,
          style: { width: '19%' },
        },
      },
      {
        properties: 'mmse_4_2_5_input',
        option: {
          value: 1,
          label: 'ตัวที่ 5',
          maxLength: 1,
          style: { width: '19%' },
        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
      },
    },
  },
];

const data_5 = [
  {
    type: 'checkbox',
    title: {
      title:
        '5. Recall : ทดสอบความจำระยะสั้นของชื่อสิ่งของ 3 อย่างที่ให้จำไว้แล้ว',
      subtitle: 'เมื่อสักครู่ให้จำของ 3 อย่าง จำได้ไหม มีอะไรบ้าง',
    },
    input: {
      properties: 'mmse_5_select',
      choice: [
        { label: 'ดอกไม้', value: 1 },
        { label: 'แม่น้ำ', value: 1 },
        { label: 'รถไฟ', value: 1 },
      ],
    },
  },
  {
    type: 'input',
    title: {
      subtitle: 'คำตอบของผู้สูงอายุ',
    },
    input: [
      {
        properties: 'mmse_5_input',
      },
    ],
  },
  {
    type: 'text',
    title: {
      title: '6. Naming : ทดสอบการบอกชื่อสิ่งของที่ได้เห็น ',
    },
  },
  {
    type: 'radio',
    title: {
      title: '6.1 ยื่นดินสอให้ผู้ถูกทดสอบดูแล้วถามว่า “ของสิ่งนี้เรียกว่าอะไร”',
      muted: true,
    },
    input: {
      properties: 'mmse_6_1_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '6.2 ชี้นาฬิกาให้ผู้ถูกทดสอบดูแล้วถามว่า “ของสิ่งนี้เรียกว่าอะไร”',
      muted: true,
    },
    input: {
      properties: 'mmse_6_2_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '7. Repetition : ทดสอนการพูดช้ำคำที่ได้ยิน ตั้งใจฟังผม/ดิฉันนะ เมื่อผม/ดิฉันพูดข้อความนี้ แล้วให้คุณ(ตายาย) พูดตามผม/ดิฉัน จะบอกเพียงครั้งเดียว “ใครใคร่ขายไก่ไข่”',
    },
    input: {
      properties: 'mmse_7_choice',
      choice: [
        { label: 'ถูก', value: 1 },
        { label: 'ผิด', value: 0 },
      ],
    },
  },
  {
    type: 'checkbox',
    title: {
      title:
        '8. Verbal command : ทดสอบการเข้าใจความหมายและทำตามคำสั่ง ข้อนี้ให้ทำตามที่บอก ตั้งใจฟังดีๆนะเดี๋ยวผม/ดิฉัน จะส่งกระดาษให้ แล้วให้คุณ (ตายาย) รับด้วยมือขวา พับ ครึ่งด้วยมือทั้ง 2 ข้าง เสร็จแล้ววางไว้ที่(พื้น, โต๊ะ,เตียง) ',
      subtitle: 'ผู้ทดสอบส่งกระดาษเปล่าขนาดประมาณ A4 ไม่มีรอยพับ ให้ผู้ทดสอบ',
    },
    input: {
      properties: 'mmse_8_select',
      choice: [
        { label: 'รับด้วยมือขวา', value: 1 },
        { label: 'พับครึ่งด้วยมือ 2 ข้าง', value: 1 },
        { label: 'วางไว้ที่(พื้น,โต๊ะ,เตียง)', value: 1 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '9. written command : ทดสอบการอ่าน การเข้าใจความหมาย สามารถทําตามได้ ให้คุณ (ตายาย) อ่านแล้วทําตาม จะอ่านออกเสียงหรือในใจก็ได้',
      // muted: true,
      subtitle: 'ผู้ทดสอบแสดงกระดาษที่เขียนว่า "หลับตา"',
    },
    input: {
      properties: 'mmse_9_choice',
      choice: [
        { label: 'ทำตาม', value: 1 },
        { label: 'ไม่ทำตาม', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '10. Written : ทดสอบการเขียนภาษาอย่างมีความหมาย ให้คุณ (ตายาย) เขียนข้อความอะไรก็ได้ที่อ่านแล้วรู้เรื่องหรือมีความหมาย',
      // muted: true,
    },
    input: {
      properties: 'mmse_10_choice',
      choice: [
        { label: 'ประโยคมีความหมาย', value: 1 },
        { label: 'ประโยคไม่มีความหมาย', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '11. Visuoconstruction : ทดสอบความสัมพันธ์ระหว่างตากับมือ ให้คุณ (ตายาย) วาดภาพตาม',
    },
    input: {
      properties: 'mmse_11_choice',
      choice: [
        { label: 'ทำได้', value: 1 },
        { label: 'ทำไม่ได้', value: 0 },
      ],
    },
  },
];

export default class EldHForm_7_1 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_7_1',
    };
  }

  _setValue = ({ properties, value }) => {
    this.setState({ [properties]: { value } }, () => {
      this.props.onFormChange(this.state);
    });
  };

  componentDidMount() {
    this.setState(this.props.state);
    const { education } = this.props;

    this.setState({
      mmse_2_1_show: true,
      mmse_2_2_show: true,
      mmse_4_1_choice_show: true,
      mmse_4_2_choice_show: true,
      summary: 0,
      education: education,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { mmse_2_choice, mmse_4_choice } = this.state;

    // mmse 2
    if (prevState?.mmse_2_choice?.value !== mmse_2_choice?.value) {
      if (mmse_2_choice?.value === 'กรณีอยู่สถานพยาบาล') {
        this.setState({ mmse_2_1_show: false });
        this.setState({ mmse_2_2_show: true });
      } else if (mmse_2_choice?.value === 'กรณีอยู่ที่บ้านของผู้ทดสอบ') {
        this.setState({ mmse_2_1_show: true });
        this.setState({ mmse_2_2_show: false });
      } else {
        this.setState({ mmse_2_1_show: true });
        this.setState({ mmse_2_2_show: true });
      }
    }

    // mmse 4
    if (prevState?.mmse_4_choice?.value !== mmse_4_choice?.value) {
      if (mmse_4_choice?.value === 'คิดเป็น') {
        this.setState({ mmse_4_1_choice_show: false });
        this.setState({ mmse_4_2_choice_show: true });
      } else if (mmse_4_choice?.value === 'คิดไม่เป็น หรือ ไม่ตอบ') {
        this.setState({ mmse_4_1_choice_show: true });
        this.setState({ mmse_4_2_choice_show: false });
      } else {
        this.setState({ mmse_4_1_choice_show: true });
        this.setState({ mmse_4_2_choice_show: true });
      }
    }
  }

  renderForm() {
    const { step } = this.state;

    const rederItem = (data) => {
      return (
        <RenderItem
          item={data}
          state={this.state}
          setState={(value) => this._setValue(value)}
        />
      );
    };
    return (
      <View style={{ paddingBottom: 20 }}>
        <LabelBox
          title={{
            title: 'ข้อเสนอแนะ',
            subtitle:
              'แบบทดสอบสภาพสมองเบื้องต้นใช้คัดกรองภาวะสมองเสื่อมในผู้สูงอายุ สามารถใช้ได้ในผู้สูงอายุที่ไม่ได้เรียนหรือ ไม่รู้หนังสือ (อ่านไม่ออก เขียนไม่ได้) ด้วยโดยไม่ต้องทำข้อ 4 ข้อ 9 และข้อ 10',
          }}
        />
        <LabelBox
          title={{
            title:
              '1. Orientation for time : ทดสอบการรับรู้เกี่ยวกับเวลาปัจจุบัน',
          }}
        />
        <View style={{ paddingHorizontal: 20 }}>
          {data_1.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))}
        </View>
        {rederItem(data_2)}
        <View style={{ paddingHorizontal: 20 }}>
          {data_2_1.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))}
          {data_2_2.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))}
        </View>
        {rederItem(data_3)}
        {data_4.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
        {data_5.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
      </View>
    );
  }

  renderBottom() {
    const {
      mmse_1_1_choice,
      mmse_1_2_choice,
      mmse_1_3_choice,
      mmse_1_4_choice,
      mmse_1_5_choice,
      mmse_2_choice,
      mmse_2_1_choice,
      mmse_2_2_choice,
      mmse_2_3_choice,
      mmse_2_4_choice,
      mmse_2_5_choice,
      mmse_3_select,
      mmse_4_choice,
      mmse_4_1_1_input,
      mmse_4_1_2_input,
      mmse_4_1_3_input,
      mmse_4_1_4_input,
      mmse_4_1_5_input,
      mmse_4_2_1_input,
      mmse_4_2_2_input,
      mmse_4_2_3_input,
      mmse_4_2_4_input,
      mmse_4_2_5_input,
      mmse_5_select,
      mmse_6_1_choice,
      mmse_6_2_choice,
      mmse_7_choice,
      mmse_8_select,
      mmse_9_choice,
      mmse_10_choice,
      mmse_11_choice,
      education,
      summary,
    } = this.state;

    const setMmse = () => {
      let score = 0;
      let total = 0;
      const validate = !!(
        mmse_1_1_choice &&
        mmse_1_2_choice &&
        mmse_1_3_choice &&
        mmse_1_4_choice &&
        mmse_1_5_choice &&
        mmse_2_1_choice &&
        mmse_2_2_choice &&
        mmse_2_3_choice &&
        mmse_2_4_choice &&
        mmse_2_5_choice &&
        mmse_3_select &&
        // mmse_4_choice &&
        // (mmse_4_1_1_input || mmse_4_2_1_input) &&
        // (mmse_4_1_2_input || mmse_4_2_2_input) &&
        // (mmse_4_1_3_input || mmse_4_2_3_input) &&
        // (mmse_4_1_4_input || mmse_4_2_4_input) &&
        // (mmse_4_1_5_input || mmse_4_2_5_input) &&
        mmse_5_select &&
        mmse_6_1_choice &&
        mmse_6_2_choice &&
        mmse_7_choice &&
        mmse_8_select &&
        // mmse_9_choice &&
        // mmse_10_choice &&
        mmse_11_choice
      );

      if (validate) {
        for (let i = 1; i <= 11; i++) {
          if (i == 1) {
            score = 0;
            for (let j = 1; j <= 5; j++) {
              score += data_1
                .find((x) => x?.input?.properties === `mmse_1_${j}_choice`)
                ?.input?.choice?.find(
                  (x) =>
                    x?.label === this?.state?.[`mmse_1_${j}_choice`]?.value,
                )?.value;
            }
            total = total + score;
          } else if (i == 2) {
            score = 0;
            if (mmse_2_choice?.value === 'กรณีอยู่สถานพยาบาล') {
              for (let j = 1; j <= 5; j++) {
                score += data_2_1
                  .find((x) => x?.input?.properties === `mmse_2_${j}_choice`)
                  ?.input?.choice?.find(
                    (x) =>
                      x?.label === this?.state?.[`mmse_2_${j}_choice`]?.value,
                  )?.value;
              }
            } else if (mmse_2_choice?.value === 'กรณีอยู่ที่บ้านของผู้ทดสอบ') {
              for (let j = 1; j <= 5; j++) {
                score += data_2_2
                  .find((x) => x?.input?.properties === `mmse_2_${j}_choice`)
                  ?.input?.choice?.find(
                    (x) =>
                      x?.label === this?.state?.[`mmse_2_${j}_choice`]?.value,
                  )?.value;
              }
            }
            total = total + score;
          } else if (i == 3) {
            total = total + mmse_3_select?.value?.length;
          } else if (i == 4) {
            score = 0;

            if (mmse_4_choice?.value === 'คิดเป็น') {
              score = mmse_4_1_1_input?.value === '93' ? score + 1 : score;
              score = mmse_4_1_2_input?.value === '86' ? score + 1 : score;
              score = mmse_4_1_3_input?.value === '79' ? score + 1 : score;
              score = mmse_4_1_4_input?.value === '72' ? score + 1 : score;
              score = mmse_4_1_5_input?.value === '65' ? score + 1 : score;
              total = total + score;
            } else if (mmse_4_choice?.value === 'คิดไม่เป็น หรือ ไม่ตอบ') {
              score = mmse_4_2_1_input?.value === 'ว' ? score + 1 : score;
              score = mmse_4_2_2_input?.value === 'า' ? score + 1 : score;
              score = mmse_4_2_3_input?.value === 'น' ? score + 1 : score;
              score = mmse_4_2_4_input?.value === 'ะ' ? score + 1 : score;
              score = mmse_4_2_5_input?.value === 'ม' ? score + 1 : score;
              total = total + score;
            }
          } else if (i == 5) {
            total = total + mmse_5_select?.value?.length;
          } else if (i == 6) {
            score = 0;
            for (let j = 1; j <= 2; j++) {
              score += data_5
                .find((x) => x?.input?.properties === `mmse_6_${j}_choice`)
                ?.input?.choice?.find(
                  (x) =>
                    x?.label === this?.state?.[`mmse_6_${j}_choice`]?.value,
                )?.value;
            }
            total = total + score;
          } else if (i == 7) {
            score = 0;
            if (mmse_7_choice?.value === 'ถูก') {
              score += 1;
            }
            total = total + score;
          } else if (i == 8) {
            total = total + mmse_8_select?.value?.length;
          } else if (i == 9) {
            score = 0;
            if (mmse_9_choice?.value === 'ทำตาม') {
              score += 1;
            }
            total = total + score;
          } else if (i == 10) {
            score = 0;
            if (mmse_10_choice?.value === 'ประโยคมีความหมาย') {
              score += 1;
            }
            total = total + score;
          } else if (i == 11) {
            score = 0;
            if (mmse_11_choice?.value === 'ทำได้') {
              score += 1;
            }
            total = total + score;
            // console.log('total', total);
          }
        }

        let cognitive_group = '';
        if (education === 'ไม่ได้เรียนหนังสือ') {
          if (total < 14) {
            cognitive_group = 'สงสัยว่ามีสมองเสื่อม';
          } else {
            cognitive_group = 'ปกติ';
          }
        } else if (education === 'ประถมศึกษา') {
          if (total < 17) {
            cognitive_group = 'สงสัยว่ามีสมองเสื่อม';
          } else {
            cognitive_group = 'ปกติ';
          }
        } else {
          if (total < 22) {
            cognitive_group = 'สงสัยว่ามีสมองเสื่อม';
          } else {
            cognitive_group = 'ปกติ';
          }
        }
        this._setValue({
          properties: 'summary',
          value: { total: `${total}`, cognitive_group: cognitive_group },
        });

        return true;
      } else {
        Alert.alert('แปลผลคะแนน MMSE', 'กรุณาทำแบบทดสอบให้ครบทุกข้อ');
        return false;
      }
    };

    const cognitive_group = summary?.value?.cognitive_group;
    const cognitive_point = summary?.value?.total;
    // console.log('cognitive_group', cognitive_group);
    // console.log('cognitive_point', cognitive_point);
    return (
      <View style={styles.bottomContainer}>
        {cognitive_point ? (
          <>
            <Text style={styles.text}>
              รวมคะแนนทั้งสิ้น {cognitive_point} คะแนน
            </Text>
            <Text style={styles.textColor}>
              การแปลผลภาวะสมองเสื่อม "{cognitive_group}"
            </Text>
          </>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            setMmse();
          }}
          style={[
            styles.btnBox,
            {
              backgroundColor: true ? '#347ec7' : colors.info,
            },
          ]}>
          <Button>
            {true ? (
              <Text style={styles.btnText}>แปลผลคะแนน MMSE</Text>
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
        <Image
          source={require('../../../../assets/images/mmse-img.png')}
          style={styles.img}
        />
        {this.renderBottom()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottomContainer: {
    justifyContent: 'space-between',
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 5,
  },
  textColor: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.textInfo,
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
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.success,
  },
  img: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    // marginTop: 20,
    resizeMode: 'contain',
  },
});
