import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Col, Row } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../../../components/buttons/BackButton';
import { CardBox, StaffBlock, UserBlock } from '../component/FormItem';
import { colors } from '../../../styles';
//form
import { MHW_API_KEY, MHW_HOST } from '../../../utils/constants';
import { ActivityIndicator, Button } from 'react-native-paper';
import { RenderItem } from '../component/RenderFormItem';
import WebView from 'react-native-webview';
import moment from 'moment';
import { arrowDown } from '../../../utils/assetsURL';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const WidthMoreThenHeight = SCREEN_WIDTH > SCREEN_HEIGHT;

const cg_1 = [
  {
    type: 'checkbox',
    title: {
      title: '1. สภาพร่างกายและจิตใจ ',
    },
    input: {
      properties: 'cg_1',
      choice: [
        { label: 'ให้ความร่วมมือ' },
        { label: 'ไม่ให้ความร่วมมือ' },
        { label: 'สดชื่นดี/ยิ้มแย้มแจ่มใส' },
        { label: 'ไม่พูด/อารมณ์ไม่ดี' },
        { label: 'โมโห/โกรธ' },
        { label: 'เบื่อหน่าย' },
        { label: 'ซึมเศร้า' },
        { label: 'หลงลืม' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_1_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_2 = [
  {
    type: 'input',
    title: {
      title: '2. ความสามารถในการทํากิจวัตรประจําวัน(ADL)',
    },
    input: [
      {
        properties: 'cg_2',
        option: {
          label: 'ผลคะแนน ADL :',
          keyboardType: 'numeric',
          maxLength: 2,
        },
      },
    ],
  },
];

const cg_2_1 = [
  {
    type: 'radio',
    title: {
      title: 'กินอาหารได้เอง เมื่อเตรียมสํารับไว้ให้ต่อหน้า',
    },
    input: {
      properties: 'adl_1',
      choice: [
        { label: 'ทําได้เอง', value: 2 },
        { label: 'ทําเองได้บ้างแต่ต้องมีคนช่วย', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'ล้างหน้า หวีผม แปรงฟัน โกนหนวด 1-2 วันที่ผ่านมา',
    },
    input: {
      properties: 'adl_2',
      choice: [
        { label: 'ทําได้เอง', value: 1 },
        { label: 'ต้องการความช่วยเหลือ', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'ลุกนั่งจากที่นอน หรือจากเตียงไปเก้าอี้',
    },
    input: {
      properties: 'adl_3',
      choice: [
        { label: 'ทําได้เอง', value: 3 },
        { label: 'ทําเองได้บ้างแต่ต้องมีคนช่วย', value: 2 },
        { label: 'ต้องการความช่วยเหลือ', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การใช้ห้องน้ํา ห้องส้วม',
    },
    input: {
      properties: 'adl_4',
      choice: [
        { label: 'ทําได้เอง', value: 2 },
        { label: 'ทําเองได้บ้าง หรือต้องช่วยเหลือบางอย่าง', value: 1 },
        { label: 'ช่วยเหลือตนเองไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การเคลื่อนที่ภายในห้องหรือบ้าน',
    },
    input: {
      properties: 'adl_5',
      choice: [
        { label: 'เดินได้เอง', value: 3 },
        { label: 'เดินใต้ต้องช่วยพยุง', value: 2 },
        { label: 'ใช้รถเข็น แต่ไม่ต้องช่วย', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การสวมเสื้อผ้า',
    },
    input: {
      properties: 'adl_6',
      choice: [
        { label: 'ทําได้เอง', value: 2 },
        { label: 'ทําได้ แต่ต้องช่วยประมาณครึ่งหนึ่ง', value: 1 },
        { label: 'ต้องมีคนสวมใส่ให้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การขึ้นลงบันได',
    },
    input: {
      properties: 'adl_7',
      choice: [
        {
          label: 'ขึ้นลงได้เอง  / ถ้าใช้เครื่องช่วยต้องเอาขึ้นลงได้',
          value: 0,
        },
        { label: 'ต้องมีคนช่วย จึงจะขึ้นได้', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การอาบน้ำ',
    },
    input: {
      properties: 'adl_8',
      choice: [
        { label: 'อาบน้ำได้เอง', value: 1 },
        { label: 'ต้องมีคนช่วยหรือทำให้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การกลั้นอุจจาระ ในระยะ 1 สัปดาห์ที่ผ่านมา',
    },
    input: {
      properties: 'adl_9',
      choice: [
        { label: 'กลั้นได้ปกติ', value: 2 },
        { label: 'กลั้นไม่ได้บางครั้ง แต่น้อยกว่าวันละ 1 ครั้ง', value: 1 },
        { label: 'กลั้นไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'การกลั้นปัสสาวะ ในระยะ 1 สัปดาห์ที่ผ่านมา',
    },
    input: {
      properties: 'adl_10',
      choice: [
        { label: 'กลั้นได้ปกติ', value: 2 },
        { label: 'กลั้นไม่ได้บางครั้ง แต่น้อยกว่าวันละ 1 ครั้ง', value: 1 },
        { label: 'กลั้นไม่ได้', value: 0 },
      ],
    },
  },
];

const cg_3 = [
  {
    type: 'input',
    title: {
      title: '3. การวัดสัญญาณชีพและการตรวจอื่นๆ',
    },
    input: [
      {
        properties: 'cg_3_weight',
        option: {
          label: 'น้ำหนัก',
          unit: 'กก.',
          keyboardType: 'numeric',
          maxLength: 3,
          style: WidthMoreThenHeight
            ? { width: '46%', fontSize: 30 }
            : { width: '95%', fontSize: 10 },
        },
      },
      {
        properties: 'cg_3_height',
        option: {
          label: 'ส่วนสูง',
          unit: 'ชม.',
          keyboardType: 'numeric',
          maxLength: 3,
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
      {
        properties: 'cg_3_temp',
        option: {
          label: 'อุณหภูมิ',
          keyboardType: 'numeric',
          maxLength: 4,
          unit: 'องศา',
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
      {
        properties: 'cg_3_pulse_rate',
        option: {
          label: 'ชีพจร',
          keyboardType: 'numeric',
          maxLength: 3,
          unit: 'ครั้ง/นาที',
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
      {
        properties: 'cg_3_respiration',
        option: {
          label: 'การหายใจ',
          keyboardType: 'numeric',
          maxLength: 3,
          unit: 'ครั้ง/นาที',
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
      {
        properties: 'cg_3_blood_glucose',
        option: {
          label: 'น้ำตาลปลายนิ้ว',
          unit: 'มก./ดล.',
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
      {
        properties: 'cg_3_blood_pressure_1', //ผิด
        option: {
          label: 'ความดันโลหิต ครั้งที่ 1',
          unit: 'มม.ปรอท',
          style: { width: '95%' },
        },
      },
      {
        properties: 'cg_3_blood_pressure_2', //ผิด
        option: {
          label: 'ความดันโลหิต ครั้งที่ 2',
          unit: 'มม.ปรอท',
          style: { width: '95%' },
        },
      },
      {
        properties: 'cg_3_fasting',
        option: {
          label: 'อดอาหาร',
          unit: 'ชม.',
          keyboardType: 'numeric',
          maxLength: 2,
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
      {
        properties: 'cg_3_after_meals',
        option: {
          label: 'หลังอาหาร',
          unit: 'ชม.',
          keyboardType: 'numeric',
          maxLength: 2,
          style: WidthMoreThenHeight ? { width: '46%' } : { width: '95%' },
        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      },
      inputBox: { width: '30%' },
    },
  },
];

const cg_4 = [
  {
    type: 'checkbox',
    title: {
      title: '4. โภชนาการ ',
    },
    input: {
      properties: 'cg_4',
      choice: [
        { label: 'เตรียมอุปกรณ์ให้อาหารสะอาด/พร้อมใช้' },
        { label: 'เตรียมอาหาร' },
        { label: 'ป้อนอาหาร' },
        { label: 'ให้อาหารทางสายยาง' },
        { label: 'จัดเตรียมยาตามเวลา' },
        { label: 'ให้ยาผู้ป่วย' },
        { label: 'ให้คําแนะนําเรื่องอาหารที่เหมาะสม' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_4_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_5 = [
  {
    type: 'selectwithicon',
    title: {
      title: '5. การประเมินความเจ็บปวด',
    },
    input: {
      properties: 'cg_5',
      choice: [
        {
          icon: 'smile-beam',
          value: 0,
          color: '#0c9544',
          size: 20,
        },
        { icon: 'smile', value: 1, color: '#8dc63f' },
        { icon: 'meh', value: 2, color: '#f3ed31' },
        { icon: 'frown', value: 3, color: '#f7951c' },
        { icon: 'sad-tear', value: 4, color: '#f1592a' },
        { icon: 'sad-cry', value: 5, color: '#ed1d25' },
      ],
    },
  },
];

const cg_6 = [
  {
    type: 'checkbox',
    title: {
      title: '6. การทําความสะอาดร่างกายและสิ่งแวดล้อมทั่วไป ',
    },
    input: {
      properties: 'cg_6',
      choice: [
        { label: 'ล้างหน้า' },
        { label: 'แปรงฟัน' },
        { label: 'สระผม' },
        { label: 'อาบน้ํา' },
        { label: 'เช็ดตัว' },
        { label: 'ตัดเล็บ' },
        { label: 'โกนหนวด' },
        { label: 'ตัดผม' },
        { label: 'ทาโลชั่น/น้ํามันมะกอก' },
        { label: 'เปลี่ยนผ้าอ้อม' },
        { label: 'ทําความสะอาดที่นอน' },
        { label: 'ฝึกการกลั้นปัสสาวะ' },
        { label: 'ทำความสะอาดสายสวนปัสสาวะ' },
        { label: 'ทำความสะอาดอวัยวะสืบพันธ์' },
        { label: 'นวดท้อง/กระตุ้นการขับถ่าย' },
        { label: 'สวนอุจจาระ' },
        { label: 'ล้วงอุจจาระ' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_6_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_7 = [
  {
    type: 'checkbox',
    title: {
      title: '7. การดูแลบาดแผล ',
    },
    input: {
      properties: 'cg_7',
      choice: [
        { label: 'ตรวจ/ประเมินแผล' },
        { label: 'ทำแผลกดทับ' },
        { label: 'พลิกตะแคงตัว' },
        { label: 'จัดท่านอน ป้องกันแผลกดทับ' },
        { label: 'ดูแลอุปกรณ์ป้องกันแผลกดทับ' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_7_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_8 = [
  {
    type: 'checkbox',
    title: {
      title: '8. การดูแลสุขภาพจิต ',
    },
    input: {
      properties: 'cg_8',
      choice: [
        { label: 'รับฟังปัญหา' },
        { label: 'พูดคุยให้กำลังใจ' },
        { label: 'ฝึกสมาธิ' },
        { label: 'สวดมนต์' },
        { label: 'อ่านหนังสือ' },
        { label: 'ดนตรีบำบัด' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_8_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_9 = [
  {
    type: 'checkbox',
    title: {
      title: '9. การฟื้นฟูสมรรณภาพ ',
    },
    input: {
      properties: 'cg_9',
      choice: [
        { label: 'ฝึกการยืน' },
        { label: 'การเดิน' },
        { label: 'การทรงตัว' },
        { label: 'ฝึกการก้าวในพื้นต่างระดับ' },
        { label: 'การชึ้นบันใด' },
        { label: 'การบริหารข้อ' },
        { label: 'ยืดเหยียดกล้ามเนื้อ' },
        { label: 'ฝึกเคลื่อนย้ายบนเตียงและลงจากเตียง' },
        { label: 'การนวดกระตุ้นการไหลเวียน' },
        { label: 'การนวดเพื่อผ่อนคลาย' },
        { label: 'นวดแผนไทย' },
        { label: 'การจัดท่านอนป้องกันปลายเท้าตก' },
        {
          label:
            'การออกกำลังกายร่างกายส่วนบน (หัวไหล/ปลายแขน/ข้อมือและนิ้วมือ/ช้อศอก)',
        },
        {
          label:
            'การออกกำลังกายร่างกายส่วนล่าง (ข้อสะโพกและข้อเช่า/ข้อเท้าและนิ้วเท้า)',
        },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_9_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_10 = [
  {
    type: 'checkbox',
    title: {
      title: '10. การจัดสภาพแวดล้อมบ้าน ',
    },
    input: {
      properties: 'cg_10',
      choice: [
        { label: 'ปรับสภาพภายพื้นที่นอกบ้าน/ในบ้าน' },
        { label: 'ปรับสภาพทางลาด/พื้นที่ต่างระตับ' },
        { label: 'ปรับความสูงของเตียง โต๊ะให้เหมาะสม' },
        { label: 'เพิ่มราวจับ/ราวบันได/ราวฝึกเดิน' },
        { label: 'ดูแลอุปกรณ์ป้องกันแผลกดทับ' },
        { label: 'ดูแลติดตั้งอุปกรณ์ช่วยกิจวัตรประจำวัน' },
        { label: 'ปรับแสงสว่าง/การระบายอากาศ' },
      ],
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'cg_10_input',
        option: { placeholder: 'อื่นๆ ระบุ' },
      },
    ],
  },
];

const cg_note = [
  {
    type: 'input',
    title: { title: 'การดูแล / การให้คำแนะนำ / ความช่วยเหลืออื่นๆ' },
    input: [
      {
        properties: 'cg_note',
      },
    ],
  },
];

const partList = [
  // { title: 'ข้อมูลพื้นฐาน', id: 'cg_basic' },
  { title: '1. สภาพร่างกายและจิตใจ', id: 'cg_1' },
  { title: '2. ความสามารถในการทำกิจวัตรประจำวัน (ADL)', id: 'cg_2' },
  { title: '3. การวัดสัญญาณชีพและการตรวจอื่นๆ', id: 'cg_3' },
  { title: '4. โภชนาการ', id: 'cg_4' },
  { title: '5. การประเมินความเจ็บปวด', id: 'cg_5' },
  { title: '6. การทำความสะอาดร่างกายและสิ่งแวดล้อมทั่วไป', id: 'cg_6' },
  { title: '7. การดูแลบาดแผล', id: 'cg_7' },
  { title: '8. การดูแลสุขภาพจิต', id: 'cg_8' },
  { title: '9. การฟื้นฟูสมรรณภาพ', id: 'cg_9' },
  { title: '10. การจัดสภาพแวดล้อมบ้าน', id: 'cg_10' },
  { title: 'การดูแล/การให้คำแนะนำ/ความช่วยเหลืออื่นๆ', id: 'cg_note' },
];

const initialState = {
  partId: partList[0].id,
  // partName: partList[0].title,
  formValue: {},
  modalVisible: false,
  modalPreview: false,
  btnSave: false,
};

class CareGiverScreen extends Component {
  constructor(props) {
    super();
    this.state = {
      ...initialState,
      dimensions: {
        window: {
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
        },
        screen: screenDimensions,
        show: false,
      },
    };
  }
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };
  async componentDidMount() {
    await this.setState({
      curTime: moment().add(543, 'year').format('วันที่ DD/MM/YYYY เวลา H:m'),
    });

    const { healthdata } = this.props;
    const record = healthdata?.record;
    this.setState({
      formValue: {
        ...this.state.formValue,
        cg_3_weight: { value: `${record.weight}` },
        cg_3_temp: { value: `${record.temp}` },
        cg_3_pulse_rate: { value: `${record.hr}` },
        cg_3_respiration: { value: `${record.resp}` },
        cg_3_blood_pressure_1: { value: `${record.sbp}/${record.dbp}` },
        cg_3_blood_pressure_2: { value: `${record.sbp}/${record.dbp}` },
        cg_3_blood_glucose: { value: `${record.bgc}` },
      },
    });
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );
  }
  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  }
  componentDidUpdate(prevProps, prevState) {
    const { cg_3_after_meals, cg_3_fasting } = this.state?.formValue;
    if (
      cg_3_after_meals?.value !==
        prevState?.formValue?.cg_3_after_meals?.value &&
      cg_3_after_meals?.value > 0
    ) {
      this.setState({
        formValue: {
          ...this.state.formValue,
          cg_3_fasting: { value: null },
        },
      });
    } else if (
      cg_3_fasting?.value !== prevState?.formValue?.cg_3_fasting?.value &&
      cg_3_fasting?.value > 0
    ) {
      this.setState({
        formValue: {
          ...this.state.formValue,
          cg_3_after_meals: { value: null },
        },
      });
    }

    const { healthdata } = this.props;
    const record = healthdata?.record;
    if (
      record !== prevProps?.healthdata?.record &&
      (record?.bgc ||
        record?.hr ||
        record?.resp ||
        record?.sbp ||
        record?.dbp ||
        record?.temp ||
        record?.weight)
    ) {
      this.setState({
        formValue: {
          ...this.state.formValue,
          cg_3_weight: { value: `${record.weight}` },
          cg_3_temp: { value: `${record.temp}` },
          cg_3_pulse_rate: { value: `${record.hr}` },
          cg_3_respiration: { value: `${record.resp}` },
          cg_3_blood_pressure_1: { value: `${record.sbp}/${record.dbp}` },
          cg_3_blood_pressure_2: { value: `${record.sbp}/${record.dbp}` },
          cg_3_blood_glucose: { value: `${record.bgc}` },
        },
      });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => this.setState(state, resolve));
  }

  _setValue = async ({ properties, value }) => {
    this.setState({
      formValue: { ...this.state.formValue, [properties]: { value } },
    });
    // await this.setStateAsync({
    //   formValue: { ...this.state.formValue, [properties]: { value } },
    // });
  };

  _saveData = async () => {
    const { authentication, currentuser, t, config, navigation } = this.props;

    const value = this.state?.formValue;

    const validate = !!(
      value?.['cg_1']?.value?.length &&
      value?.['cg_2']?.value &&
      value?.['cg_4']?.value?.length &&
      value?.['cg_5']?.value + 1 &&
      value?.['cg_6']?.value?.length &&
      value?.['cg_7']?.value?.length &&
      value?.['cg_8']?.value?.length &&
      value?.['cg_9']?.value?.length &&
      value?.['cg_10']?.value?.length &&
      value?.['cg_note']?.value
    );

    if (!value || !validate) {
      Alert.alert('Save Data', 'ข้อมูลไม่ถูกต้อง', [
        {
          text: 'ตกลง',
        },
      ]);
      return null;
    }

    let staffDetail = navigation?.state?.params?.staffDetail;

    let formdata;

    if (staffDetail) {
      formdata = {
        ...value,
        patient_detail: { value: currentuser },
        staff_detail: { value: staffDetail },
      };
    } else {
      formdata = {
        ...value,
        patient_detail: { value: currentuser },
      };
    }

    console.log(formdata);

    const url = `${MHW_HOST}/mobileservice/mhccaregiveradd`;
    const formData = new FormData();
    formData.append('idcard', currentuser?.idcard);
    formData.append('partnerid', config?.config?.partner?.partnerid);
    formData.append('formName', 'CareGiver');
    formData.append('value', JSON.stringify(formdata));

    const options = {
      method: 'POST',
      headers: {
        Authorization: authentication?.token,
        'X-API-KEY': MHW_API_KEY,
      },
      body: formData,
    };

    Alert.alert(
      'Save Data',
      'สามารถบันทึกแบบฟอร์มได้เพียงครั้งเดียว\nต้องการบันทึกข้อมูลหรือไม่ ??',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ตกลง',
          onPress: async () => {
            // loading true
            this.setState({ btnSave: true });
            try {
              const response = await fetch(url, options);
              const resmessage = await response.json();
              // console.log('response', resmessage);
              resmessage.ok
                ? navigation.goBack()
                : this.setState({ modalVisible: true, modalType: 'fail' });
            } catch (e) {
              console.error(e);
            }
            // loading false
          },
          style: 'confirm',
        },
      ],
    );
  };
  goBack = () => {
    const { navigation } = this.props;
    navigation.replace('MainScreen');
  };
  showCancel = () => {
    this.setState({ show: true });
  };
  renderTouchableHighlight() {
    if (this.state.show) {
      return <Text>Cancel</Text>;
    }
    return null;
  }
  renderHeader() {
    const { authentication, currentuser, navigation, config } = this.props;
    const {
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    // const loginStaffFeature = config?.config?.features?.staff;

    return (
      <>
        {WidthMoreThenHeight ? (
          <>
            <View style={styles.header}>
              <View style={styles.backButtonContainer}>
                <BackButton onPress={() => this.goBack()} />
              </View>
              <Text style={[commonStyles.textTitle, { color: '#fff' }]}>
                แบบบันทึกการปฎิบัติงานดูแลผู้มีภาวะพึ่งพิง (สำหรับ CG)
              </Text>
              <UserBlock
                authentication={authentication}
                currentuser={currentuser}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <View
                style={{
                  position: 'absolute',
                  left: width > 400 ? 20 : 10,
                  top: 0,
                  zIndex: 1,
                }}>
                <BackButton onPress={() => this.goBack()} />
              </View>
              <View
                style={{
                  left: width * 0.05,
                  paddingHorizontal: 20,
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={[
                    commonStyles.textTitle,
                    {
                      color: '#fff',
                      width: width * 0.65,
                      fontSize: width > 400 ? 20 : 18,
                    },
                  ]}>
                  แบบบันทึกการปฎิบัติงานดูแลผู้มีภาวะพึ่งพิง (สำหรับ CG)
                </Text>
              </View>
            </View>
          </>
        )}
      </>
    );
  }

  renderForm() {
    const {
      partId,
      formValue,
      showFormADl,
      dimensions: { window, screen },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;

    let itemList = formValue?.cg_7_tms?.value || [];

    const _addCheckBoxItem = (value) => {
      if (!(itemList?.indexOf(value) >= 0)) {
        this._setValue({
          properties: 'cg_7_tms',
          value: itemList.concat(value),
        });
      }
    };

    const _removeCheckBoxItem = (value) => {
      const index = itemList?.indexOf(value);
      this._setValue({
        properties: 'cg_7_tms',
        value: itemList.filter((item, i) => i !== index),
      });
    };

    const setADL = () => {
      let score = 0;
      const validate = !!(
        formValue?.adl_1 &&
        formValue?.adl_2 &&
        formValue?.adl_3 &&
        formValue?.adl_4 &&
        formValue?.adl_5 &&
        formValue?.adl_6 &&
        formValue?.adl_7 &&
        formValue?.adl_8 &&
        formValue?.adl_9 &&
        formValue?.adl_10
      );

      if (validate) {
        for (let i = 1; i <= 10; i++) {
          score += cg_2_1
            .find((x) => x?.input?.properties === `adl_${i}`)
            ?.input?.choice?.find(
              (x) => x?.label === formValue?.[`adl_${i}`]?.value,
            )?.value;
        }
        this._setValue({
          properties: 'cg_2',
          value: `${score}`,
        });
        return true;
      } else {
        return false;
      }
    };

    const renderItem = (id) => {
      return eval(id)?.map((item, i) => (
        <React.Fragment key={i}>
          <RenderItem
            item={item}
            state={this.state?.formValue}
            setState={this._setValue}
          />
        </React.Fragment>
      ));
    };

    const renderTMSPoint = (x, y, value) => {
      const primary_color =
        itemList.indexOf(value) >= 0 ? colors.danger : colors.white;
      const secondary_color =
        itemList.indexOf(value) >= 0 ? colors.white : colors.black;

        return (
          <TouchableOpacity
            style={[
              tmsPointStyles.container,
              {
                backgroundColor: primary_color,
                borderColor: secondary_color,
                left: x ?? 0,
                top: y ?? 0,
                height: window.width > window.height ? 30 : 25,
                width: window.width > window.height ? 30 : 25,
              },
            ]}
            onPress={() =>
              itemList?.indexOf(value) >= 0
                ? _removeCheckBoxItem(value)
                : _addCheckBoxItem(value)
            }>
            <Text
              style={[
                tmsPointStyles.label,
                {
                  color: secondary_color,
                  fontSize: window.width > window.height ? 14 : 12,
                },
              ]}>
              {value}
            </Text>
          </TouchableOpacity>
        );
      };

    const renderMultiTMSPoint = () => {
      const center = 387;
      const center2 = 132;

      return (
        <>
          {WidthMoreThenHeight ? (
            <>
              {renderTMSPoint(387, 20, '53')}
              {/* right front */}
              {renderTMSPoint(center + 48, 100, '44')}
              {renderTMSPoint(center + 76, 130, '40')}
              {renderTMSPoint(center + 78, 170, '41')}
              {renderTMSPoint(center + 83, 220, '42')}
              {renderTMSPoint(center + 83, 265, '43')}
              {renderTMSPoint(center + 26, 145, '45')}
              {renderTMSPoint(center + 26, 185, '46')}
              {renderTMSPoint(center + 26, 230, '47')}
              {renderTMSPoint(center + 23, 295, '48')}
              {renderTMSPoint(center + 26, 350, '49')}
              {renderTMSPoint(center + 23, 410, '50')}
              {renderTMSPoint(center + 23, 460, '51')}
              {renderTMSPoint(center + 18, 510, '52')}
              {/* left front */}
              {renderTMSPoint(center - 48, 100, '31')}
              {renderTMSPoint(center - 76, 130, '27')}
              {renderTMSPoint(center - 78, 170, '28')}
              {renderTMSPoint(center - 83, 220, '29')}
              {renderTMSPoint(center - 83, 265, '30')}
              {renderTMSPoint(center - 26, 145, '32')}
              {renderTMSPoint(center - 26, 185, '33')}
              {renderTMSPoint(center - 26, 230, '34')}
              {renderTMSPoint(center - 23, 295, '35')}
              {renderTMSPoint(center - 26, 350, '36')}
              {renderTMSPoint(center - 23, 410, '37')}
              {renderTMSPoint(center - 23, 460, '38')}
              {renderTMSPoint(center - 18, 510, '39')}
              {/* left back */}
              {renderTMSPoint(center2 - 48, 100, '5')}
              {renderTMSPoint(center2 - 76, 130, '1')}
              {renderTMSPoint(center2 - 78, 170, '2')}
              {renderTMSPoint(center2 - 83, 220, '3')}
              {renderTMSPoint(center2 - 83, 265, '4')}
              {renderTMSPoint(center2 - 26, 145, '6')}
              {renderTMSPoint(center2 - 26, 185, '7')}
              {renderTMSPoint(center2 - 26, 230, '8')}
              {renderTMSPoint(center2 - 23, 295, '9')}
              {renderTMSPoint(center2 - 26, 350, '10')}
              {renderTMSPoint(center2 - 23, 410, '11')}
              {renderTMSPoint(center2 - 23, 460, '12')}
              {renderTMSPoint(center2 - 18, 510, '13')}
              {/* right back */}
              {renderTMSPoint(center2 + 48, 100, '18')}
              {renderTMSPoint(center2 + 76, 130, '14')}
              {renderTMSPoint(center2 + 78, 170, '15')}
              {renderTMSPoint(center2 + 83, 220, '16')}
              {renderTMSPoint(center2 + 83, 265, '17')}
              {renderTMSPoint(center2 + 26, 145, '19')}
              {renderTMSPoint(center2 + 26, 185, '20')}
              {renderTMSPoint(center2 + 26, 230, '21')}
              {renderTMSPoint(center2 + 23, 295, '22')}
              {renderTMSPoint(center2 + 26, 350, '23')}
              {renderTMSPoint(center2 + 23, 410, '24')}
              {renderTMSPoint(center2 + 23, 460, '25')}
              {renderTMSPoint(center2 + 18, 510, '26')}
            </>
          ) : (
            <>
              {renderTMSPoint(center - 108, 20, '53')}
              {/* right front */}
              {renderTMSPoint(center - 72, 78, '44')}
              {renderTMSPoint(center - 52, 100, '40')}
              {renderTMSPoint(center - 49, 130, '41')}
              {renderTMSPoint(center - 47, 165, '42')}
              {renderTMSPoint(center - 45, 199, '43')}
              {renderTMSPoint(center - 89, 110, '45')}
              {renderTMSPoint(center - 89, 140, '46')}
              {renderTMSPoint(center - 89, 170, '47')}
              {renderTMSPoint(center - 90, 218, '48')}
              {renderTMSPoint(center - 89, 260, '49')}
              {renderTMSPoint(center - 94, 300, '50')}
              {renderTMSPoint(center - 92, 340, '51')}
              {renderTMSPoint(center - 91, 380, '52')}
              {/* left front */}
              {renderTMSPoint(center - 142, 78, '31')}
              {renderTMSPoint(center - 162, 100, '27')}
              {renderTMSPoint(center - 165, 130, '28')}
              {renderTMSPoint(center - 167, 165, '29')}
              {renderTMSPoint(center - 168, 199, '30')}
              {renderTMSPoint(center - 126, 110, '32')}
              {renderTMSPoint(center - 126, 140, '33')}
              {renderTMSPoint(center - 126, 170, '34')}
              {renderTMSPoint(center - 125, 218, '35')}
              {renderTMSPoint(center - 126, 260, '36')}
              {renderTMSPoint(center - 121, 300, '37')}
              {renderTMSPoint(center - 123, 340, '38')}
              {renderTMSPoint(center - 120, 380, '39')}
              {/* left back */}
              {renderTMSPoint(center2 - 72, 78, '5')}
              {renderTMSPoint(center2 - 92, 100, '1')}
              {renderTMSPoint(center2 - 95, 130, '2')}
              {renderTMSPoint(center2 - 97, 165, '3')}
              {renderTMSPoint(center2 - 98, 199, '4')}
              {renderTMSPoint(center2 - 56, 110, '6')}
              {renderTMSPoint(center2 - 56, 140, '7')}
              {renderTMSPoint(center2 - 56, 170, '8')}
              {renderTMSPoint(center2 - 55, 218, '9')}
              {renderTMSPoint(center2 - 56, 260, '10')}
              {renderTMSPoint(center2 - 51, 300, '11')}
              {renderTMSPoint(center2 - 53, 340, '12')}
              {renderTMSPoint(center2 - 50, 380, '13')}
              {/* right back */}
              {renderTMSPoint(center2 - 5, 78, '18')}
              {renderTMSPoint(center2 + 15, 100, '14')}
              {renderTMSPoint(center2 + 18, 130, '15')}
              {renderTMSPoint(center2 + 20, 165, '16')}
              {renderTMSPoint(center2 + 22, 199, '17')}
              {renderTMSPoint(center2 - 22, 110, '19')}
              {renderTMSPoint(center2 - 22, 140, '20')}
              {renderTMSPoint(center2 - 22, 170, '21')}
              {renderTMSPoint(center2 - 21, 218, '22')}
              {renderTMSPoint(center2 - 22, 260, '23')}
              {renderTMSPoint(center2 - 25, 300, '24')}
              {renderTMSPoint(center2 - 23, 340, '25')}
              {renderTMSPoint(center2 - 26, 380, '26')}
            </>
          )}
        </>
      );
    };

    const renderADLForm = () => {
      const {
        dimensions: { window, screen },
      } = this.state;
      const WidthMoreThenHeight = window.width > window.height;
      const width = window.width;
      const height = window.height;
      return (
        <View
          style={{
            padding: 10,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showFormADl: !showFormADl });
            }}
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={commonStyles.textSubTitle}>ฟอร์ม ADL</Text>
            <FontAwesome name="sort-down" size={30} style={{ bottom: 5 }} />
          </TouchableOpacity>
          {showFormADl ? (
            <View>
              {renderItem('cg_2_1')}
              <TouchableOpacity
                onPress={() => {
                  if (setADL()) {
                    this.setState({ showFormADl: !showFormADl });
                  } else {
                    Alert.alert('คำนวณ ADL', 'กรุณาทำแบบทดสอบให้ครบทุกข้อ');
                  }
                }}
                style={{
                  padding: 10,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: 'center',
                }}>
                <Text style={commonStyles.textSubTitle}>คำนวณผล ADL</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      );
    };

    switch (partId) {
      // case 'cg_basic':
      //   return renderItem(partId);
      case 'cg_1':
        return renderItem(partId);
      case 'cg_2':
        return (
          <>
            {renderItem(partId)}
            {renderADLForm()}
          </>
        );
      case 'cg_3':
        return renderItem(partId);
      case 'cg_4':
        return renderItem(partId);
      case 'cg_5':
        return renderItem(partId);
      case 'cg_6':
        return renderItem(partId);
      case 'cg_7':
        return (
          <>
            {renderItem(partId)}
            <Row style={{ justifyContent: 'center' }}>
              <ImageBackground
                source={require('../../../assets/images/TMS.jpg')}
                style={{
                  width: WidthMoreThenHeight ? 550 : 400,
                  height: WidthMoreThenHeight ? 600 : 450,
                  alignSelf: 'center',
                  marginTop: 20,
                  resizeMode: 'contain',
                }}>
                {renderTMSPoint(387, 20, '53')}
                {renderMultiTMSPoint()}
              </ImageBackground>
            </Row>
          </>
        );
      case 'cg_8':
        return renderItem(partId);
      case 'cg_9':
        return renderItem(partId);
      case 'cg_10':
        return renderItem(partId);
      case 'cg_note':
        return renderItem(partId);
      default:
        return renderItem('cg_1');
    }
  }

  renderBottom() {
    const {
      partId,
      partName,
      btnSave,
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    return (
      <View
        style={{
          backgroundColor: btnSave ? '#347ec7' + 'aa' : '#347ec7',
          borderRadius: 10,
        }}>
        <TouchableOpacity onPress={() => this._saveData()} disabled={btnSave}>
          <Button>
            <Text
              style={[
                modalStyles.btnText,
                { fontSize: WidthMoreThenHeight ? 20 : width > 400 ? 20 : 16 },
              ]}>
              SAVE
            </Text>
          </Button>
        </TouchableOpacity>
      </View>
    );
  }

  renderContent() {
    const {
      partId,
      partName,
      curTime,
      formValue,
      dimensions: { window },
    } = this.state;
    const WidthMoreThenHeight = window.width > window.height;
    const width = window.width;
    const height = window.height;
    return (
      <>
        {WidthMoreThenHeight ? (
          //แนวนอน
          <Row style={styles.contentContainer}>
            <Col size={1} style={styles.partListZone}>
              <ScrollView style={styles.partListScrollView}>
                <View style={styles.partListContainer}>
                  {partList.map((element, i) => (
                    <React.Fragment key={i}>
                      <TouchableOpacity
                        style={[
                          commonStyles.cardBox,
                          {
                            backgroundColor:
                              partId === element.id ? colors.blue : 'white',
                          },
                        ]}
                        onPress={() =>
                          this.setState({
                            partId: element?.id,
                            partName: element?.title,
                            show: false,
                          })
                        }>
                        <Text
                          style={[
                            commonStyles.textSubTitle,
                            {
                              color:
                                partId === element.id
                                  ? 'white'
                                  : colors.textMuted,
                            },
                          ]}>
                          {element.title}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.btnBox}>
                <View
                  style={{
                    backgroundColor: colors.info,
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      await this.setState({ modalPreview: true });
                      setTimeout(() => {
                        this.webview.postMessage(JSON.stringify(formValue));
                      }, 500);
                    }}
                    style={styles.btn}>
                    <Button>
                      <Text style={[modalStyles.btnText, { fontSize: 18 }]}>
                        PREVIEW
                      </Text>
                    </Button>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.btnBox}>{this.renderBottom()}</View>
            </Col>
            <Col size={3} style={styles.contentActionZone}>
              <KeyboardAvoidingView
                style={styles.KeyboardAvoidingViewContainer}>
                <ScrollView style={{ paddingHorizontal: 20 }}>
                  <CardBox text={curTime} />
                  <View style={{ paddingBottom: 20, paddingHorizontal: 20 }}>
                    {this.renderForm()}
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </Col>
          </Row>
        ) : (
          //แนวตั้ง
          <Row style={{ justifyContent: 'space-around' }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                zIndex: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.blue,
                  paddingHorizontal: 30,
                  height: 45,
                  width: width,
                  borderBottomLeftRadius: 35,
                  borderBottomRightRadius: 35,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                }}
                onPress={this.showCancel}>
                <View
                  style={{
                    borderRadius: 50,
                    padding: 10,
                  }}>
                  <Image
                    source={require('../../../assets/icons/arrow-down.png')}
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: width > 400 ? 20 : 18,
                    fontWeight: 'bold',
                    paddingLeft: 20,
                  }}>
                  คำถามแบบบันทึก
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.show ? (
              <>
                <View
                  size={1}
                  style={{
                    flexDirection: 'column',
                    backgroundColor: colors.blue,
                    paddingTop: 60,
                    width: width * 0.4,
                  }}>
                  <ScrollView style={styles.partListScrollView}>
                    <View style={styles.partListContainer}>
                      {partList.map((element, i) => (
                        <React.Fragment key={i}>
                          <TouchableOpacity
                            style={[
                              commonStyles.cardBox,
                              {
                                backgroundColor:
                                  partId === element.id ? colors.blue : 'white',
                                borderColor: '#fff',
                                borderWidth: 1,
                              },
                            ]}
                            onPress={() =>
                              this.setState({
                                partId: element?.id,
                                partName: element?.title,
                                show: false,
                              })
                            }>
                            <Text
                              style={[
                                commonStyles.textSubTitle,
                                {
                                  color:
                                    partId === element.id
                                      ? 'white'
                                      : colors.textMuted,
                                  fontSize: width > 400 ? 16 : 14,
                                },
                              ]}>
                              {element.title}
                            </Text>
                          </TouchableOpacity>
                        </React.Fragment>
                      ))}
                    </View>
                  </ScrollView>
                  <View style={styles.btnBox}>
                    <View
                      style={{
                        backgroundColor: colors.info,
                        borderRadius: 10,
                      }}>
                      <TouchableOpacity
                        onPress={async () => {
                          await this.setState({ modalPreview: true });
                          setTimeout(() => {
                            this.webview.postMessage(JSON.stringify(formValue));
                          }, 500);
                        }}
                        style={styles.btn}>
                        <Button>
                          <Text
                            style={[
                              modalStyles.btnText,
                              { fontSize: width > 400 ? 18 : 16 },
                            ]}>
                            PREVIEW
                          </Text>
                        </Button>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.btnBox}>{this.renderBottom()}</View>
                </View>
              </>
            ) : null}
            <Col style={styles.contentActionZone}>
              <KeyboardAvoidingView
                style={{
                  flex: 1,
                  paddingVertical: 60,
                  flexDirection: 'column',
                  borderRadius: 10,
                }}>
                <ScrollView style={{ paddingHorizontal: 10 }}>
                  <CardBox text={curTime} />
                  <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
                    {this.renderForm()}
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </Col>
          </Row>
        )}
      </>
    );
  }

  renderModal() {
    const { modalVisible, modalType } = this.state;

    return (
      <Modal
        presentationStyle={'overFullScreen'}
        animationType={'slide'}
        transparent
        visible={modalVisible}>
        <Row style={{ justifyContent: 'center' }}>
          <View style={modalStyles.modalContainer}>
            {modalType === 'success' ? (
              <>
                <Text style={modalStyles.title}>Success</Text>
                <FontAwesome
                  name="check-circle"
                  style={modalStyles.iconSontainer}
                  size={100}
                  color={colors.success}
                />
              </>
            ) : (
              <>
                <Text style={[modalStyles.title, { color: colors.danger }]}>
                  Fail !!
                </Text>
                <FontAwesome
                  name="times-circle"
                  style={modalStyles.iconSontainer}
                  size={100}
                  color={colors.danger}
                />
              </>
            )}

            <TouchableOpacity
              onPress={() => this.setState({ modalVisible: !modalVisible })}
              style={[
                modalStyles.btn,
                {
                  backgroundColor:
                    modalType === 'success' ? colors.success : colors.danger,
                },
              ]}>
              <Text style={modalStyles.btnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Row>
      </Modal>
    );
  }

  renderPreview = () => {
    const { modalPreview, formValue } = this.state;
    const formData = new FormData();
    formData.append('name', 'foo koong');
    const source = {
      uri: 'https://www.myhealthgroup.net/app/view/caregiverpreview',
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
      method: 'POST',
      // body: JSON.stringify(formValue),
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPreview}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
            padding: 20,
          }}>
          <TouchableOpacity
            onPress={() => this.setState({ modalPreview: false })}
            style={{ position: 'absolute', right: 80, top: 30, zIndex: 50 }}>
            <FontAwesome name="times" size={35} />
          </TouchableOpacity>
          <WebView
            ref={(ref) => {
              this.webview = ref;
            }}
            style={{
              width: SCREEN_WIDTH - 100,
            }}
            source={source}
            scalesPageToFit={false}
            javaScriptEnabled
          />
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderModal()}
        {this.renderPreview()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'green',
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    backgroundColor: colors.blue,
  },
  contentContainer: {
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  partListZone: {
    // position:'absolute',
    // left:0,
    // zIndex:1
    // backgroundColor: 'lightgrey',
  },
  partListScrollView: {
    paddingHorizontal: 10,
  },
  partListContainer: {
    paddingVertical: 10,
  },
  contentActionZone: {
    // backgroundColor: 'skyblue',
  },

  //------
  KeyboardAvoidingViewContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'column',
    borderRadius: 10,
  },

  //---------------
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    top: 0,
  },

  formBodyScrollViewContainer: {
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'column',
    borderRadius: 10,
  },
  formHeaderContainer: {
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  formBodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  //------
  formTitleContainer: {
    padding: 10,
  },

  //-----------------
  itemLabelBox: {
    padding: 10,
    marginTop: 10,
  },
  itemInputBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  itemRadioBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTimeBox: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemInputListRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  //-------------
  itemInputListButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },

  //-----------
  btnBox: {
    marginBottom: 10,
  },
  tmsBG: {
    width: 550,
    height: 600,
    alignSelf: 'center',
    marginTop: 20,
    resizeMode: 'contain',
  },
});

const commonStyles = StyleSheet.create({
  titleCardBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },

  cardBox: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    flexDirection: 'row',
  },

  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingHorizontal: 80,
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconSontainer: {
    margin: 20,
    marginBottom: 30,
  },
  btn: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
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

const tmsPointStyles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 50,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default CareGiverScreen;
