import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../../../styles';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';
import { validate } from 'uuid';

const data = [
  {
    type: 'radio',
    title: {
      title: '1. เคยพลัดตกหกล้มในช่วง 1 ปีที่ผ่านมา',
    },
    input: {
      properties: 'fallFform',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2. ใช้ไม้เท้าหรืออุปกรณ์ช่วยเดิน',
    },
    input: {
      properties: 'walkingAidForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3. บางครั้งมีความรู้สึกว่าเดินไม่ค่อยมั่นคง',
    },
    input: {
      properties: 'unsteadyWalkingForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '4. ต้องจับเฟอร์นิเจอร์เพื่อประคองตนเองขณะเดินในบ้าน',
    },
    input: {
      properties: 'supportYourselfForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '5. ต้องใช้มือดันตัวเองขึ้นเวลาลุกจากเก้าอี้',
    },
    input: {
      properties: 'pushYourselfForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '6. มีความกังวลว่าตนเองจะหกล้ม',
    },
    input: {
      properties: 'afraidToFallForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '7. มีปัญหาเวลาก้าวขึ้นขอบฟุตบาท',
    },
    input: {
      properties: 'haveTroubleSteppingForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '8. ต้องรีบเร่งเข้าห้องน้ำเมื่อปวดปัสสาวะหรืออุจจาระ',
    },
    input: {
      properties: 'rushBathroomForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '9. มีอาการชาที่ฝ่าเท้า',
    },
    input: {
      properties: 'solesOfFeetForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '10. กินยาที่ทำให้เวียนหัวหรือเหนื่อยง่ายกว่าปกติ',
    },
    input: {
      properties: 'takingDizzyPillsForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '11. กินยานอนหลับหรือยาแก้เครียด',
    },
    input: {
      properties: 'takeSleepingPills',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '12. รู้สึกเศร้าหรือหดหู่',
    },
    input: {
      properties: 'dismalForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
];

const data_1_1 = [
  {
    type: 'radio',
    title: {
      title: 'การเดิน',
    },
    input: {
      properties: 'walkingForm',
      choice: [
        { label: 'เดินได้ด้วยตัวเอง' },
        { label: 'เดินโดยใช้อุปกรณ์' },
        { label: 'เดินไม่ได้ ระบุสาเหตุ' },
      ],
    },
  },
  {
    type: 'dropdown',
    title: {
      title: 'อุปกรณ์',
    },
    input: {
      properties: 'equipmentForm',
      choice: [
        { label: '' },
        { label: 'ไม้เท้า' },
        { label: 'ไม้ค้ำยัน' },
        { label: 'ไม้เท้าแบบ 3 ขา' },
        { label: 'Walker' },
        { label: 'อื่น ๆ ระบุ' },
      ],
      style: { height: 65, width: '100%' },
    },
    show: 'equipmentForm_show',
  },
  {
    type: 'input',
    input: [
      {
        properties: 'walkingForm_input',
        option: {
          label: 'สาเหตุ',
        },
      },
    ],
    show: 'walkingForm_input_show',
  },
  {
    type: 'input',
    title: {
      title: 'Time Up & Go',
    },
    input: [
      {
        properties: 'minuteTimeUpAndGoForm',
        option: {
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'นาที',
          style: { width: '49%' },
        },
      },
      {
        properties: 'secondTimeUpAndGoForm',
        option: {
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'วินาที',
          style: { width: '49%' },
        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 20,
      },
    },
  },
];

const data_1 = [
  {
    type: 'text',
    title: {
      title: 'ตอนที่ 1 การคัดกรองเบื้องต้น',
    },
  },
  {
    type: 'radio',
    title: {
      title: '1.1. ท่านมีอาการปวดเข่าหรือไม่',
    },
    input: {
      properties: 'kneePainForm',
      choice: [{ label: 'ไม่ใช่' }, { label: 'ใช่' }],
    },
  },
];

const data_2 = [
  {
    type: 'radio',
    title: {
      title:
        '1.2. หากท่านมีอาการปวดเข่า / หรือเคยมี ขณะนี้ท่านมีระดับความเจ็บปวดของข้อเข่าอยู่ในระดับใด',
    },
    input: {
      properties: 'kneePainFormLevel',
      choice: [
        { label: 'ไม่เจ็บ' },
        { label: 'เจ็บเล็กน้อย' },
        { label: 'เจ็บปานกลาง' },
        { label: 'เจ็บมาก' },
        { label: 'เจ็บมากที่สุด' },
        { label: 'เจ็บอย่างรุนแรง' },
      ],
    },
  },
  {
    type: 'text',
    title: {
      title: 'ตอนที่ 2 การคัดกรองข้อเข่าเสื่อมทางคลินิก',
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '2.1. มีอาการข้อเข่าฝืดตึง หลังตื่นนอนตอนเช้าน้อยกว่า 30 นาที (stiffness)',
    },
    input: {
      properties: 'stiffnessForm',
      choice: [{ label: 'ไม่ใช่' }, { label: 'ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2.1.1 หัวเข่าข้าง',
    },
    input: {
      properties: 'stiffnessFormSide',
      choice: [{ label: 'ขวา' }, { label: 'ซ้าย' }, { label: 'ทั้ง 2 ข้าง' }],
    },
    show: 'stiffnessFormSide_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.2. มีเสียงดังกรอบแกรบในข้อเข่าขณะเคลื่อนไหว (crepitus)',
    },
    input: {
      properties: 'crepitusForm',
      choice: [{ label: 'ไม่ใช่' }, { label: 'ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2.2.1 หัวเข่าข้าง',
    },
    input: {
      properties: 'crepitusFormSide',
      choice: [{ label: 'ขวา' }, { label: 'ซ้าย' }, { label: 'ทั้ง 2 ข้าง' }],
    },
    show: 'crepitusFormSide_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.3. กดเจ็บที่กระดูกข้อเข่า (bony tenderness)',
    },
    input: {
      properties: 'bonyTendernessForm',
      choice: [{ label: 'ไม่ใช่' }, { label: 'ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2.3.1 หัวเข่าข้าง',
    },
    input: {
      properties: 'bonyTendernessFormSide',
      choice: [{ label: 'ขวา' }, { label: 'ซ้าย' }, { label: 'ทั้ง 2 ข้าง' }],
    },
    show: 'bonyTendernessFormSide_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.4. มีข้อใหญ่ผิดรูป (bony enlargement)',
    },
    input: {
      properties: 'bonyEnlargementForm',
      choice: [{ label: 'ไม่ใช่' }, { label: 'ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2.4.1 หัวเข่าข้าง',
    },
    input: {
      properties: 'bonyEnlargementFormSide',
      choice: [{ label: 'ขวา' }, { label: 'ซ้าย' }, { label: 'ทั้ง 2 ข้าง' }],
    },
    show: 'bonyEnlargementFormSide_show',
  },
  {
    type: 'radio',
    title: {
      title: '2.5. ไม่พบข้อเข่าอุ่น (no palpable warmth)',
    },
    input: {
      properties: 'noPalpableWarmthForm',
      choice: [{ label: 'ไม่ใช่' }, { label: 'ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2.5.1 หัวเข่าข้าง',
    },
    input: {
      properties: 'noPalpableWarmthFormSide',
      choice: [{ label: 'ขวา' }, { label: 'ซ้าย' }, { label: 'ทั้ง 2 ข้าง' }],
    },
    show: 'noPalpableWarmthFormSide_show',
  },
];

const data_3 = [
  {
    type: 'text',
    title: {
      title:
        'ตอนที่ 3 แบบประเมินระดับความรุนแรงของโรคข้อเข่าเสื่อม (Oxford knee Score)',
      subtitle:
        'โปรดเลือกหัวข้อที่ตรงกับอาการที่เกิดขึ้นกับตัวท่านมากที่สุด ในช่วงเวลา 1 เดือนที่ผ่านมา',
    },
  },
  {
    type: 'radio',
    title: {
      title: '3.1. ให้ท่านบรรยายลักษณะอาการเจ็บปวดเข่าของท่าน',
    },
    input: {
      properties: 'oxford_1_choice',
      choice: [
        {
          label: 'ไม่มีอาการ',
          value: 4,
        },
        {
          label:
            'แทบไม่มีอาการ เช่น อาการปวดลึกๆที่เข่าเล็กน้อย เฉพาะเวลาขยับตัวหรือในบางท่าเท่านั้น',
          value: 3,
        },
        {
          label:
            'มีอาการปวดเล็กน้อย เช่น หลังใช้งานนาน อาการปวดเข่ามากขึ้น พักแล้วดีขึ้น เป็นๆ หายๆ',
          value: 2,
        },
        {
          label: 'มีอาการปวดปานกลาง เช่น อาการปวดเข่าเพิ่มมากขึ้น ปวดนานขึ้น',
          value: 1,
        },
        {
          label: 'มีอาการปวดรุนแรง เช่น อยู่เฉยๆ ก็ปวดมาก ขยับไม่ได้',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '3.2. ท่านมีปัญหาเรื่องเข่าในการทำกิจวัตรประจำวันด้วยตัวเองหรือไม่ เช่น การยืนอาบน้ำเป็นต้น',
    },
    input: {
      properties: 'oxford_2_choice',
      choice: [
        {
          label: 'ไม่มีปัญหา',
          value: 4,
        },
        {
          label: 'มีอาการปวดเข่า / ข้อเข่าฝืดตึงขัดเล็กน้อย แต่น้อยมาก',
          value: 3,
        },
        {
          label: 'มีอาการปวดเข่า / ข้อเข่าฝืดตึงปานกลาง',
          value: 2,
        },
        {
          label: 'เริ่มมีปัญหาทำกิจกรรมด้วยความยากลำบาก',
          value: 1,
        },
        {
          label: 'ไม่สามารถทำได้',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '3.3. ท่านมีปัญหาเรื่องเข่า เมื่อก้าวขึ้นลงรถ หรือรถประจำทางหรือไม่',
    },
    input: {
      properties: 'oxford_3_choice',
      choice: [
        {
          label: 'ไม่มีอาการใดๆ ',
          value: 4,
        },
        {
          label: 'มีอาการปวดเข่า / ข้อเข่าฝืดตึงขัดเล็กน้อย แต่น้อยมาก',
          value: 3,
        },
        {
          label: 'มีอาการปวดเข่า / ข้อเข่าฝืดปานกลาง ก้าวขึ้นลงได้ช้ากว่าปกติ',
          value: 2,
        },
        {
          label: 'มีอาการปวดเข่ามาก / ข้อเข่าฝืด ก้าวขึ้นลงด้วยความยากลำบาก',
          value: 1,
        },
        {
          label: 'ไม่สามารถทำได้',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '3.4. ระยะเวลานานเท่าไรที่ท่านเดินได้มากที่สุดก่อนที่ท่านจะมีอาการปวดเข่า',
    },
    input: {
      properties: 'oxford_4_choice',
      choice: [
        {
          label: 'เดินได้เกิน 1 ชั่วโมง โดยไม่มีอาการอะไร',
          value: 4,
        },
        {
          label: 'เดินได้ 6-60 นาที เริ่มมีอาการปวด',
          value: 3,
        },
        {
          label: 'เดินได้เพียง 5-15 นาที เริ่มมีอาการปวด',
          value: 2,
        },
        {
          label: 'เดินได้แค่รอบบ้านเท่านั้น เริ่มมีอาการปวด',
          value: 1,
        },
        {
          label: 'ทำไม่ได้และเดินไม่ไหว',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '3.5. หลังทานอาหารเสร็จ ในขณะที่ลุกขึ้นจากเก้าอี้นั่ง เข่าของท่านมีอาการอย่างไร',
    },
    input: {
      properties: 'oxford_5_choice',
      choice: [
        {
          label: 'ไม่มีอาการ',
          value: 4,
        },
        {
          label: 'มีอาการปวดเข่า / ข้อเข่าฝืดเล็กน้อย',
          value: 3,
        },
        {
          label: 'มีอาการปวดเข่าข้อเข่าฝืดปานกลาง',
          value: 2,
        },
        {
          label: 'มีอาการปวดเข่ามาก / ข้อเข่าฝืด ลุกขึ้นยืนได้ด้วยความยากลำบาก',
          value: 1,
        },
        {
          label: 'ปวดมากไม่สามารถลุกขึ้นได้',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '3.6. ท่านต้องเดินโยกตัว (เดินกระโผลกกระเผลก) เพราะอาการที่เกิดจากเข่าของท่านหรือไม่',
    },
    input: {
      properties: 'oxford_6_choice',
      choice: [
        {
          label: 'ไม่เคย',
          value: 4,
        },
        {
          label: 'ในช่วง 2-3 ก้าวแรกที่ออกเดินเท่านั้น',
          value: 3,
        },
        {
          label: 'เป็นบางครั้ง',
          value: 2,
        },
        {
          label: 'เป็นส่วนใหญ่',
          value: 1,
        },
        {
          label: 'ตลอดเวลา',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3.7. ท่านสามารถนั่งลงคุกเข่าและลุกขึ้นได้หรือไม่',
    },
    input: {
      properties: 'oxford_7_choice',
      choice: [
        {
          label: 'ลุกได้ง่าย',
          value: 4,
        },
        {
          label: 'ลุกได้ ลำบากเล็กน้อย',
          value: 3,
        },
        {
          label: 'ได้แต่ลำบากปานกลาง',
          value: 2,
        },
        {
          label: 'ลุกได้แต่ยากลำบากมาก',
          value: 1,
        },
        {
          label: 'ลุกไม่ไหว',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3.8. ท่านเคยมีปัญหาปวดเข่าในขณะที่นอนตอนกลางคืนหรือไม่',
    },
    input: {
      properties: 'oxford_8_choice',
      choice: [
        {
          label: 'ไม่เคย',
          value: 4,
        },
        {
          label: 'ใน 1 เดือน มี 1-2 ครั้ง',
          value: 3,
        },
        {
          label: 'บางคืน',
          value: 2,
        },
        {
          label: 'เกือบทุกคืน',
          value: 1,
        },
        {
          label: 'ทุกคืน',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3.9. ในขณะที่คุณทำงาน / ทำงานบ้าน ท่านมีอาการปวดเข่าหรือไม่',
    },
    input: {
      properties: 'oxford_9_choice',
      choice: [
        {
          label: 'ไม่มี',
          value: 4,
        },
        {
          label: 'น้อยมาก',
          value: 3,
        },
        {
          label: 'บางครั้ง',
          value: 2,
        },
        {
          label: 'ส่วนมาก',
          value: 1,
        },
        {
          label: 'ตลอดเวลา',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '3.10. ท่านเคยมีความรู้สึกว่าเข่าของท่านทรุดลงทันทีหรือหมดแรงทันทีจนตัวทรุดลง',
    },
    input: {
      properties: 'oxford_10_choice',
      choice: [
        {
          label: 'ไม่เคย',
          value: 4,
        },
        {
          label: 'ในช่วงแรกที่ก้าวเดินเท่านั้น',
          value: 3,
        },
        {
          label: 'บ่อยครั้ง',
          value: 2,
        },
        {
          label: 'แทบจะตลอดเวลา',
          value: 1,
        },
        {
          label: 'ตลอดเวลา',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3.11. ท่านสามารถไปซื้อของใช้ต่างๆ ได้ด้วยตัวท่านเอง',
    },
    input: {
      properties: 'oxford_11_choice',
      choice: [
        {
          label: 'ได้เป็นปกติ',
          value: 4,
        },
        {
          label: 'ได้ เริ่มมีอาการปวดเข่า / ตึงเข่าเล็กน้อย',
          value: 3,
        },
        {
          label: 'ไปได้ เริ่มมีอาการปวดเข่า / ตึงเข่าปานกลาง',
          value: 2,
        },
        {
          label: 'พอไปได้ แต่ด้วยความยากลำบากมาก',
          value: 1,
        },
        {
          label: 'ไปไม่ไหว',
          value: 0,
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3.12. ท่านสามารถเดินลงบันไดได้หรือไม่',
    },
    input: {
      properties: 'oxford_12_choice',
      choice: [
        {
          label: 'เดินลงได้ เป็นปกติ',
          value: 4,
        },
        {
          label: 'เดินลงได้ เริ่มมีอาการปวดเข่า / ตึงเข่าเล็กน้อย',
          value: 3,
        },
        {
          label: 'เดินลงได้ เริ่มมีอาการปวดเข่า / ตึงเข่าปานกลาง',
          value: 2,
        },
        {
          label: 'เดินลงได้ด้วยความยากลำบากมาก',
          value: 1,
        },
        {
          label: 'เดินลงไม่ได้',
          value: 0,
        },
      ],
    },
  },
];

export default class EldHForm_9 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_9',
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
      walkingForm_input_show: true,
      equipmentForm_show: true,
      stiffnessFormSide_show: true,
      crepitusFormSide_show: true,
      bonyTendernessFormSide_show: true,
      bonyEnlargementFormSide_show: true,
      noPalpableWarmthFormSide_show: true,
    });
    this._setValue({
      properties: 'minuteTimeUpAndGoForm',
      value: '0',
    });
    this._setValue({
      properties: 'secondTimeUpAndGoForm',
      value: '0',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      walkingForm,
      minuteTimeUpAndGoForm,
      secondTimeUpAndGoForm,
      kneePainForm,
      stiffnessForm,
      crepitusForm,
      bonyTendernessForm,
      bonyEnlargementForm,
      noPalpableWarmthForm,
    } = this.state;

    // equipment
    if (prevState?.walkingForm?.value !== walkingForm?.value) {
      if (walkingForm?.value === 'เดินโดยใช้อุปกรณ์') {
        this.setState({ walkingForm_input_show: true });
        this.setState({ equipmentForm_show: false });
      } else if (walkingForm?.value === 'เดินไม่ได้ ระบุสาเหตุ') {
        this.setState({ walkingForm_input_show: false });
        this.setState({ equipmentForm_show: true });
      } else {
        this.setState({ walkingForm_input_show: true });
        this.setState({ equipmentForm_show: true });
      }
    }

    //timeup&go
    if (
      minuteTimeUpAndGoForm?.value !==
        prevState?.minuteTimeUpAndGoForm?.value ||
      secondTimeUpAndGoForm?.value !== prevState?.secondTimeUpAndGoForm?.value
    ) {
      const m = minuteTimeUpAndGoForm?.value;
      const s = secondTimeUpAndGoForm?.value;
      const mTos = m * 60;
      const sumS = Number(mTos) + Number(s);
      if (sumS >= 30) {
        this._setValue({
          properties: 'summary_timeUpAndGo',
          value: 'เสี่ยงต่อการพลัดตกหกล้มสูง',
        });
      } else if (sumS >= 10) {
        this._setValue({
          properties: 'summary_timeUpAndGo',
          value: 'เสี่ยงต่อการพลัดตกหกล้มปานกลาง',
        });
      } else if (sumS > 0) {
        this._setValue({
          properties: 'summary_timeUpAndGo',
          value: 'ปกติ',
        });
      } else {
        this._setValue({
          properties: 'summary_timeUpAndGo',
          value: null,
        });
      }
    }

    // kneePainForm show form 2
    if (prevState?.kneePainForm?.value !== kneePainForm?.value) {
      if (kneePainForm?.value === 'ใช่') {
        this.setState({
          form_9_2_show: true,
        });
      } else {
        this.setState({
          form_9_2_show: false,
        });
      }
    }

    // kneePainForm_2 show side
    if (prevState?.stiffnessForm?.value !== stiffnessForm?.value) {
      if (stiffnessForm?.value === 'ใช่') {
        this.setState({ stiffnessFormSide_show: false });
      } else {
        this.setState({ stiffnessFormSide_show: true });
      }
    }
    if (prevState?.crepitusForm?.value !== crepitusForm?.value) {
      if (crepitusForm?.value === 'ใช่') {
        this.setState({ crepitusFormSide_show: false });
      } else {
        this.setState({ crepitusFormSide_show: true });
      }
    }
    if (prevState?.bonyTendernessForm?.value !== bonyTendernessForm?.value) {
      if (bonyTendernessForm?.value === 'ใช่') {
        this.setState({ bonyTendernessFormSide_show: false });
      } else {
        this.setState({ bonyTendernessFormSide_show: true });
      }
    }
    if (prevState?.bonyEnlargementForm?.value !== bonyEnlargementForm?.value) {
      if (bonyEnlargementForm?.value === 'ใช่') {
        this.setState({ bonyEnlargementFormSide_show: false });
      } else {
        this.setState({ bonyEnlargementFormSide_show: true });
      }
    }
    if (
      prevState?.noPalpableWarmthForm?.value !== noPalpableWarmthForm?.value
    ) {
      if (noPalpableWarmthForm?.value === 'ใช่') {
        this.setState({ noPalpableWarmthFormSide_show: false });
      } else {
        this.setState({ noPalpableWarmthFormSide_show: true });
      }
    }

    // kneePainForm show form 3
    const dataArr = [
      stiffnessForm?.value,
      crepitusForm?.value,
      bonyTendernessForm?.value,
      bonyEnlargementForm?.value,
      noPalpableWarmthForm?.value,
    ];
    const select = {};
    dataArr.forEach((data) => {
      select[data] = (select[data] || 0) + 1;
    });
    const validate = !!(
      prevState?.stiffnessForm?.value !== stiffnessForm?.value ||
      prevState?.crepitusForm?.value !== crepitusForm?.value ||
      prevState?.bonyTendernessForm?.value !== bonyTendernessForm?.value ||
      prevState?.bonyEnlargementForm?.value !== bonyEnlargementForm?.value ||
      prevState?.noPalpableWarmthForm?.value !== noPalpableWarmthForm?.value
    );
    // console.log('select', select);
    if (!select['undefined'] && validate) {
      if (select['ใช่'] >= 2) {
        this.setState({
          form_9_3_show: true,
        });
      } else {
        this.setState({
          form_9_3_show: false,
        });
      }
    }
  }

  renderForm() {
    const {
      form_9_2_show,
      form_9_3_show,
      oxford_1_choice,
      oxford_2_choice,
      oxford_3_choice,
      oxford_4_choice,
      oxford_5_choice,
      oxford_6_choice,
      oxford_7_choice,
      oxford_8_choice,
      oxford_9_choice,
      oxford_10_choice,
      oxford_11_choice,
      oxford_12_choice,
      summary_9,
    } = this.state;

    const setOxford = () => {
      let score = 0;
      const oxfordValidate = !!(
        oxford_1_choice &&
        oxford_2_choice &&
        oxford_3_choice &&
        oxford_4_choice &&
        oxford_5_choice &&
        oxford_6_choice &&
        oxford_7_choice &&
        oxford_8_choice &&
        oxford_9_choice &&
        oxford_10_choice &&
        oxford_11_choice &&
        oxford_12_choice
      );

      if (oxfordValidate) {
        for (let i = 1; i <= 12; i++) {
          score += data_3
            .find((x) => x?.input?.properties === `oxford_${i}_choice`)
            ?.input?.choice?.find(
              (x) => x?.label === this.state?.[`oxford_${i}_choice`]?.value,
            )?.value;
        }
        let oxford_group = '';
        let oxford_advice = '';
        if (score <= 19) {
          oxford_group = 'เป็นโรคข้อเข่าเสื่อมระดับรุนแรง ';
          oxford_advice =
            'ควรรับการรักษาจากศัลยแพทย์ผู้เชี่ยวชาญกระดูกและข้อทันที';
        } else if (score <= 29) {
          oxford_group = 'มีอาการโรคข้อเข่าเสื่อมระดับปานกลาง ';
          oxford_advice =
            'ควรปรึกษาศัลยแพทย์ผู้เชี่ยวชาญกระดูกและข้อเพื่อรับการตรวจรักษา \nเอกซเรย์ข้อเข่า และประเมินอาการของโรค';
        } else if (score <= 39) {
          oxford_group = 'เริ่มมีอาการของโรคข้อเข่าเสื่อม ';
          oxford_advice =
            'ควรได้รับคำแนะนำจากศัลยแพทย์ผู้เชี่ยวชาญกระดูกและข้อเรื่องการออกกำลังกายอย่างเหมาะสม \nการควบคุมน้ำหนักเพื่อไม่ให้อ้วน หลีกเลี่ยงท่าหรือกิจกรรมที่จะทำให้เกิดอาการและความรุนแรงของโรคมากขึ้น และการประเมินระดับอาการของโรค';
        } else if (score <= 49) {
          oxford_group = 'ยังไม่พบอาการผิดปกติ ';
          oxford_advice = 'แต่ควรตรวจร่างกายเป็นประจำทุกปี';
        } else {
          oxford_group = null;
        }
        this._setValue({
          properties: 'summary_9',
          value: {
            oxford_point: `${score}`,
            oxford_group: oxford_group,
            oxford_advice: oxford_advice,
          },
        });
        return true;
      } else {
        Alert.alert('แปลผลคะแนน ADL', 'กรุณาทำแบบทดสอบให้ครบทุกข้อ');
        return false;
      }
    };

    const oxford_point = summary_9?.value?.oxford_point;
    const oxford_group = summary_9?.value?.oxford_group;
    const oxford_advice = summary_9?.value?.oxford_advice;
    // console.log('point', summary?.value);

    const renderSummaryText = (text) => {
      return <Text style={styles.text}>{text}</Text>;
    };

    const summary_timeUpAndGo = this.state?.summary_timeUpAndGo?.value;
    return (
      <>
        <LabelBox title={{ title: 'การคัดกรองความเสี่ยงต่อการพลัดตกหกล้ม' }} />
        {data.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
        <LabelBox title={{ title: 'ประเมินสมรรถภาพทางกาย' }} />
        {data_1_1.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}

        {summary_timeUpAndGo
          ? renderSummaryText(
              `แปลผลความเสี่ยงต่อการพลัดตกหกล้ม "${summary_timeUpAndGo}"`,
            )
          : null}
        <LabelBox title={{ title: 'คัดกรองข้อเข่าเสื่อม' }} />
        {data_1.map((item, i) => (
          <React.Fragment key={i}>
            <RenderItem
              item={item}
              state={this.state}
              setState={(value) => this._setValue(value)}
            />
          </React.Fragment>
        ))}
        {form_9_2_show ? (
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
          </>
        ) : null}

        {form_9_3_show ? (
          <>
            {data_3.map((item, i) => (
              <React.Fragment key={i}>
                <RenderItem
                  item={item}
                  state={this.state}
                  setState={(value) => this._setValue(value)}
                />
              </React.Fragment>
            ))}
            {oxford_point ? (
              <>
                <Text style={styles.text}>
                  รวมคะแนนทั้งสิ้น {oxford_point} คะแนน
                </Text>
                <Text style={styles.textColor}>{oxford_group}</Text>
                <Text style={styles.textColor}>{oxford_advice}</Text>
              </>
            ) : null}
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
                    <Text style={styles.btnText}>
                      แปลผลคะแนนโรคข้อเข่าเสื่อม
                    </Text>
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

  // renderBottom() {
  //   const { step } = this.state;

  //   return (
  //     <View style={styles.bottomContainer}>
  //       {/* /* {aldPoint ? (
  //       <Text style={styles.text}>
  //         การแปลผล {aldPoint} คะแนน ({summary?.value?.adl_group})
  //       </Text>
  //     ) : null}
  //     {aldPoint < 11 ? (
  //       <Text
  //         style={[
  //           styles.text,
  //           { color: colors.textMuted, textAlign: 'center' },
  //         ]}>
  //         *เนื่องจากผลการประมาณต่ำกว่าเกณฑ์กรุณาทำแบบประเมิณ TAI Classified
  //         เพิ่มเติมด้วย
  //       </Text>
  //     ) : null} */}
  //       <TouchableOpacity
  //         onPress={() => {
  //           // setADL();
  //         }}
  //         style={[
  //           styles.btnBox,
  //           {
  //             backgroundColor: true ? '#347ec7' : colors.info,
  //           },
  //         ]}>
  //         <Button>
  //           {true ? (
  //             <Text style={styles.btnText}>แปลผลคะแนนโรคข้อเข่าเสื่อม</Text>
  //           ) : (
  //             <Text style={[styles.btnText, { fontSize: 18 }]}>SUMMARY</Text>
  //           )}
  //         </Button>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

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
  // rowContainer: {
  //   justifyContent: 'space-between',
  //   padding: 20,
  // },
  textColor: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
