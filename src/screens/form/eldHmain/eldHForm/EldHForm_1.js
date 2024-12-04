import { Row } from 'native-base';
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';
import moment from 'moment';
import { MHW_HOST_V2 } from '../../../../utils/constants';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const WidthMoreThenHeight = SCREEN_WIDTH > SCREEN_HEIGHT;

const roadArr = [
  { label: '' },
  { label: 'ข้าวหลาม' },
  { label: 'เทศบาลพัฒนา 1' },
  { label: 'เทศบาลพัฒนา 2' },
  { label: 'เนตรดี' },
  { label: 'บางแสนสาย 1' },
  { label: 'บางแสนสาย 2' },
  { label: 'บางแสนสาย 3' },
  { label: 'บางแสนสาย 4 เหนือ' },
  { label: 'บางแสนสาย 4 ใต้' },
  { label: 'บางแสนล่าง' },
  { label: 'บางแสน-อ่างศิลา' },
  { label: 'เปรมใจราษฎร์' },
  { label: 'มาบมะยม' },
  { label: 'มิตรสัมพันธ์' },
  { label: 'รอบเขาสามมุข' },
  { label: 'ลงหาดบางแสน' },
  { label: 'สันติเกษม' },
  { label: 'แสนสุข' },
  { label: 'สุขุมวิท' },
  { label: 'หลังวัดกลางดอน' },
  { label: 'อื่น ๆ ระบุ' },
];

const districtArr = [
  { label: '' },
  { label: 'แสนสุข' },
  { label: 'เหมือง' },
  { label: 'ห้วยกะปิ' },
  { label: 'อื่น ๆ ระบุ' },
];
const villageArr = [
  { label: '' },
  { label: 'ชุมชนมณีแก้ว' },
  { label: 'ชุมชนดอนบน' },
  { label: 'ชมุชนบางแสนทาวเวอร์' },
  { label: 'ชุมชนตาลล้อม 1' },
  { label: 'ชุมชนตาลล้อม 2' },
  { label: 'ชุมชนบ้านเหมือง' },
  { label: 'ชมุชนพัฒนา 2' },
  { label: 'ชุมชนดอนนารา' },
  { label: 'ชุมชนวัดกลางดอน' },
  { label: 'ชุมชนแสนสุข' },
  { label: 'ชุมชนมาบมะยม' },
  { label: 'ชุมชนท้ายตลาด' },
  { label: 'ชุมชนร่วมใจพัฒนา' },
  { label: 'ชุมชนบางแสนบน' },
  { label: 'ชุมชนหาดวอนนภา' },
  { label: 'ชุมชนบางเป้ง' },
  { label: 'ชุมชนหน้ามอ' },
  { label: 'ชุมชนโชคดี' },
  { label: 'ชุมชนสมใจนึก' },
  { label: 'ชุมชนหน้าเทศบาล' },
  { label: 'ชุมชนวัดแสนสุข' },
  { label: 'ชุมชนมุขแสนเจริญ 1' },
  { label: 'ชุมชนมุขแสนเจริญ 2' },
  { label: 'ชุมชนเขาสามมุข' },
  { label: 'ชุมชนบ้านแหลมแท่น' },
  { label: 'อื่น ๆ ระบุ' },
];

const amphoeArr = [
  { label: '' },
  { label: 'เมืองชลบุรี' },
  { label: 'อื่น ๆ ระบุ' },
];

const provinceArr = [
  { label: '' },
  { label: 'ชลบุรี' },
  { label: 'อื่น ๆ ระบุ' },
];

const diseaseArr = [
  { label: 'เบาหวาน' },
  { label: 'ความดันโลหิตสูง' },
  { label: 'โรคหัวใจ' },
  { label: 'โรคหลอดเลือดสมอง' },
  { label: 'ไขมันในเลือดสูง' },
  { label: 'โรคไต' },
  { label: 'มะเร็ง' },
  { label: 'สมองเสื่อม' },
  { label: 'วัณโรค' },
  { label: 'เก๊าท์' },
  { label: 'หอบหืด' },
  // { label: 'โรคประจำตัว(อื่นๆ)' },
];

const basicInformation_1 = [
  {
    type: 'input',
    title: {
      title: 'รหัสบัตรประชาชน 13 หลัก',
      subtitle:
        'ในกรณีที่ผู้สูงอายุไม่มีรหัสบัตรประชาชน ให้กรอกเครื่องหมาย " - " ในช่องรหัสบัตรประชาชน',
    },
    input: [
      {
        properties: 'idcard',
        option: {
          placeholder: 'รหัสบัตรประชาชน 13 หลัก',
          keyboardType: 'numeric',
          maxLength: 13,
        },
      },
    ],
  },
  {
    type: 'dropdown',
    title: {
      title: 'ชื่อ-สกุล',
    },
    input: {
      properties: 'namePrefix',
      label: 'คำนำหน้า',
      choice: [
        { label: '' },
        { label: 'นาย' },
        { label: 'นาง' },
        { label: 'นางสาว' },
        { label: 'อื่น ๆ ระบุ' },
      ],
      style: WidthMoreThenHeight ? { width: '97%' } : { width: '100%' },

    },
  },

  {
    type: 'input',
    input: [
      {
        properties: 'name',
        option: {
          label: 'ชื่อ',
          style: WidthMoreThenHeight ? { width: '48%' } : { width: '100%' },
        },
      },
      {
        properties: 'surname',
        option: {
          label: 'นามสกุล',
          style: WidthMoreThenHeight ? { width: '48%' } : { width: '100%' },
        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      },
    },
  },
  {
    type: 'date',
    title: {
      title: 'วันเดือนปีเกิด (พ.ศ.)',
      subtitle:
        'วันเดือนปีเกิด (หากไม่ทราบ เดือน หรือวัน ให้เลือกเป็น “วันที่ 1 เดือน มกราคม”',
    },
    properties: 'dob',
  },
  {
    type: 'input',
    title: {
      title: 'อายุ',
    },
    input: [
      {
        properties: 'age',
        option: {
          keyboardType: 'numeric',
          maxLength: 2,
          unit: 'ปี',
          style: { width: '97%' },
        },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      },
    },
  },
  {
    type: 'radio',
    title: {
      title: 'เพศ',
    },
    input: {
      properties: 'gender',
      choice: [{ label: 'ชาย' }, { label: 'หญิง' }],
    },
  },

  {
    type: 'input',
    title: {
      title: 'เบอร์โทรศัพท์ (ถ้ามี)',
    },
    input: [
      {
        properties: 'tel',
        option: {
          placeholder: '+66',
          keyboardType: 'phone-pad',
          maxLength: 10,
        },
      },
    ],
  },
];

//addr type[{byID: ''},{cur: '_cur'}]
const basicInformation_addr = (specifyAddr, type) => [
  {
    type: 'input',
    title: {
      title: 'ที่อยู่ตามบัตรประชาชน',
    },
    input: [
      {
        properties: 'addrID' + type,
        option: {
          label: 'เลขที่',
          keyboardType: 'phone-pad',
          style: { width: '48%' },
        },
      },
      {
        properties: 'alley' + type,
        option: {
          label: 'ตรอก/ซอย',
          style: { width: '48%' },
        },
      },
      // {
      //   properties: 'road' + type,
      //   option: {
      //     label: 'ถนน',
      //     style: { width: '97%' },
      //   },
      // },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      },
    },
  },
  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'road' + type,
          label: 'ถนน',
          choice: roadArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'road' + type,
            option: {
              label: 'ถนน',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'district' + type,
          label: 'ตำบล',
          choice: districtArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'district' + type,
            option: {
              label: 'ตำบล',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'village' + type,
          label: 'ชุมชน',
          choice: villageArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'village' + type,
            option: {
              label: 'ชุมชน',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
    No: false,
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'amphoe' + type,
          label: 'อำเภอ',
          choice: amphoeArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'amphoe' + type,
            option: {
              label: 'อำเภอ',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
    No: false,
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'province' + type,
          label: 'จังหวัด',
          choice: provinceArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'province' + type,
            option: {
              label: 'จังหวัด',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
    No: false,
  },

  // {
  //   type: 'input',
  //   input: [
  //     {
  //       properties: 'amphoe' + type,
  //       option: {
  //         label: 'อำเภอ',
  //         style: { width: '48%' },
  //       },
  //       disabled: specifyAddr,
  //     },
  //     {
  //       properties: 'province' + type,
  //       option: {
  //         label: 'จังหวัด',
  //         style: { width: '48%' },
  //       },
  //       disabled: specifyAddr,
  //     },
  //   ],
  //   style: {
  //     wrapper: {
  //       flexDirection: 'row',
  //       justifyContent: 'space-evenly',
  //     },
  //   },
  // },
];

const basicInformation_addr_current = (specifyAddr, type) => [
  {
    type: 'input',
    title: {
      title: 'ที่อยู่ปัจจุบัน',
    },
    input: [
      {
        properties: 'addrID_current' + type,
        option: {
          label: 'เลขที่',
          keyboardType: 'phone-pad',
          style: { width: '48%' },
        },
      },
      {
        properties: 'alley_current' + type,
        option: {
          label: 'ตรอก/ซอย',
          style: { width: '48%' },
        },
      },
      // {
      //   properties: 'road' + type,
      //   option: {
      //     label: 'ถนน',
      //     style: { width: '97%' },
      //   },
      // },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      },
    },
  },
  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'road_current' + type,
          label: 'ถนน',
          choice: roadArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'road_current' + type,
            option: {
              label: 'ถนน',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'district_current' + type,
          label: 'ตำบล',
          choice: districtArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'district_current' + type,
            option: {
              label: 'ตำบล',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'village_current' + type,
          label: 'ชุมชน',
          choice: villageArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'village_current' + type,
            option: {
              label: 'ชุมชน',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
    No: false,
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'amphoe_current' + type,
          label: 'อำเภอ',
          choice: amphoeArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'amphoe_current' + type,
            option: {
              label: 'อำเภอ',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
    No: false,
  },

  {
    type: specifyAddr ? 'dropdown' : 'input',
    input: specifyAddr
      ? {
          properties: 'province_current' + type,
          label: 'จังหวัด',
          choice: provinceArr,
          style: { width: '97%' },
        }
      : [
          {
            properties: 'province_current' + type,
            option: {
              label: 'จังหวัด',
              style: { width: '97%' },
            },
          },
        ],
    style: {
      wrapper: {
        alignItems: 'center',
      },
    },
    No: false,
  },

  // {
  //   type: 'input',
  //   input: [
  //     {
  //       properties: 'amphoe' + type,
  //       option: {
  //         label: 'อำเภอ',
  //         style: { width: '48%' },
  //       },
  //       disabled: specifyAddr,
  //     },
  //     {
  //       properties: 'province' + type,
  //       option: {
  //         label: 'จังหวัด',
  //         style: { width: '48%' },
  //       },
  //       disabled: specifyAddr,
  //     },
  //   ],
  //   style: {
  //     wrapper: {
  //       flexDirection: 'row',
  //       justifyContent: 'space-evenly',
  //     },
  //   },
  // },
];

const basicInformation_addrQuestion = [
  {
    type: 'radio',
    title: {
      title: 'ที่อยู่ปัจจุบันเป็นที่อยู่เดียวกับบัตรประชาชนใช่หรือไม่',
    },
    input: {
      properties: 'currentAddr',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
];

const basicInformation_2 = [
  {
    type: 'dropdown',
    title: {
      title: 'สถานภาพ',
    },
    input: {
      properties: 'marital_status',
      choice: [
        { label: '' },
        { label: 'โสด' },
        { label: 'สมรส' },
        { label: 'หม้าย' },
        { label: 'หย่าร้าง' },
        { label: 'แยกกันอยู่' },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'ความเป็นอยู่',
    },
    input: {
      properties: 'being_status',
      choice: [{ label: 'อยู่ลำพัง' }, { label: 'ไม่ได้อยู่ลำพัง' }],
    },
  },
  {
    type: 'dropdown',
    input: {
      properties: 'have_being_status',
      label: 'อยู่ลำพัง',
      choice: [
        { label: '' },
        { label: 'กลางวัน' },
        { label: 'กลางคืน' },
        { label: 'ทั้งกลางวัน - กลางคืน' },
      ],
    },
    show: 'have_being_show',
  },
  {
    type: 'input',
    input: [
      {
        option: {
          label: 'ระบุ',
          style: { width: '100%', alignSelf: 'center', height: 55 },
        },
        properties: 'donthave_being_status_input',
      },
    ],
    show: 'donthave_being_status_show',
  },
  {
    type: 'dropdown',
    title: {
      title: 'ศาสนา',
    },
    input: {
      properties: 'religion',
      choice: [
        { label: '' },
        { label: 'พุทธ' },
        { label: 'คริสต์' },
        { label: 'อิสลาม' },
        { label: 'อื่น ๆ ระบุ' },
      ],
    },
  },

  {
    type: 'dropdown',
    title: {
      title: 'ระดับการศึกษา',
    },
    input: {
      properties: 'education',
      choice: [
        { label: '' },
        { label: 'ไม่ได้เรียนหนังสือ' },
        { label: 'ประถมศึกษา' },
        { label: 'มัธยมศึกษา' },
        { label: 'อนุปริญญา/ ปวช./ ปวส.' },
        { label: 'ปริญญาตรี' },
        { label: 'สูงกว่าปริญญาตรี' },
      ],
    },
  },
  {
    type: 'dropdown',
    title: {
      title: 'อาชีพ',
    },
    input: {
      properties: 'job',
      choice: [
        { label: '' },
        { label: 'ไม่ได้ประกอบอาชีพ' },
        { label: 'ค้าขาย' },
        { label: 'ข้าราชการบำนาญ' },
        { label: 'รับจ้าง' },
        { label: 'ธุรกิจส่วนตัว' },
        { label: 'อื่น ๆ ระบุ' },
      ],
    },
  },

  {
    type: 'dropdown',
    title: {
      title: 'สิทธิการรักษา',
    },
    input: {
      properties: 'access_to_treatment',
      choice: [
        { label: '' },
        { label: 'เบิกต้นสังกัด' },
        { label: 'ชําระเงินเอง' },
        { label: 'บัตรทอง' },
        { label: 'บัตรผู้พิการ' },
        { label: 'บัตรประกันสังคม' },
        { label: 'อื่น ๆ ระบุ' },
      ],
    },
  },

  {
    type: 'dropdown',

    input: {
      properties: 'gold_card',
      label: 'บัตรทอง',
      choice: [
        { label: '' },
        { label: 'รพ.สต.เหมือง' },
        { label: 'รพ.สต.แสนสุข' },
        { label: 'ศูนย์บริการสาธารณสุข' },
      ],
    },
    show: 'gold_card_list_show',
  },

  {
    type: 'dropdown',

    input: {
      properties: 'handicapped_card',
      label: 'บัตรผู้พิการ',
      choice: [
        { label: '' },
        { label: 'รพ.ชลบุรี' },
        { label: 'รพ.ม.บูรพา' },
        { label: 'อื่นๆ' },
      ],
    },
    show: 'handicapped_card_list_show',
  },

  {
    type: 'dropdown',
    title: {
      title: 'รายได้ต่อเดือน(บาท)',
    },
    input: {
      properties: 'monthly_income',
      choice: [
        { label: '' },
        { label: 'ไม่มีรายได้' },
        { label: 'ไม่เกิน 5,000' },
        { label: '5,001 - 10,000' },
        { label: '10,001 - 15,000' },
        { label: '15,001 - 20,000' },
        { label: '20,001 - 25,000		' },
        { label: '25,001 ขึ้นไป' },
      ],
    },
  },
  {
    type: 'dropdown',
    title: {
      title: 'ประวัติการแพ้ยา',
    },
    input: {
      properties: 'drug_allergy',
      choice: [
        { label: '' },
        { label: 'แพ้ยา' },
        { label: 'ไม่แพ้ยา' },
        { label: 'ไม่ทราบ / ไม่แน่ใจ' },
      ],
    },
  },
  {
    type: 'inputList',
    title: {
      title: 'รายการยาที่แพ้',
    },
    input: {
      properties: 'drug_allergy_list',
    },
    show: 'drug_allergy_list_show',
  },
  {
    type: 'dropdown',
    title: {
      title: 'ประวัติการแพ้อาหาร',
    },
    input: {
      properties: 'food_allergy',
      choice: [
        { label: '' },
        { label: 'แพ้อาหาร' },
        { label: 'ไม่แพ้อาหาร' },
        { label: 'ไม่ทราบ / ไม่แน่ใจ' },
      ],
    },
  },
  {
    type: 'inputList',
    title: {
      title: 'รายการอาหารที่แพ้',
    },
    input: {
      properties: 'food_allergy_list',
    },
    show: 'food_allergy_list_show',
  },
  {
    type: 'checkbox',
    title: {
      title: 'โรคประจำตัว',
    },
    input: {
      properties: 'congenital_disease',
      choice: diseaseArr,
    },
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
    },
  },
  {
    type: 'inputList',
    title: {
      title: 'โรคประจำตัว(อื่นๆ)',
    },
    input: {
      properties: 'congenital_disease_other',
    },
    // show: 'congenital_disease_other_show',
  },
];

// const basicInformation_3 = [];

const basicInformation_4 = [
  {
    type: 'radio',
    title: {
      title: 'ข้อมูลญาติผู้ดูแล',
      subtitle: 'มีญาติหรือผู้ดูแลหรือไม่',
    },
    input: {
      properties: 'hasRelative_1',
      choice: [{ label: 'มี' }, { label: 'ไม่มี' }],
    },
  },
  // {
  //   type: 'radio',
  //   title: {
  //     subtitle: 'มีญาติหรือผู้ดูแลคนที่ 2 หรือไม่',
  //   },
  //   input: {
  //     properties: 'hasRelative_2',
  //     choice: [{ label: 'มี' }, { label: 'ไม่มี' }],
  //   },
  // },
];

const relativeInfo = (relativeNo) => [
  {
    type: 'dropdown',
    title: {
      // title: 'ญาติคนที่ ' + relativeNo,
      title: 'ญาติผู้ดูแล',
    },
    input: {
      properties: 'relative_namePrefix_' + relativeNo,
      label: 'คำนำหน้า',
      choice: [{ label: 'นาย' }, { label: 'นาง' }, { label: 'นางสาว' }],
      style: { width: '97%' },
    },
  },
  {
    type: 'input',
    input: [
      {
        properties: 'relative_name_' + relativeNo,
        option: { label: 'ชื่อ', style: { width: '48%' } },
      },
      {
        properties: 'relative_surname_' + relativeNo,
        option: { label: 'นามสกุล', style: { width: '48%' } },
      },
    ],
    style: {
      wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
      },
    },
  },
  {
    type: 'radio',
    title: {
      title: 'เพศ',
    },
    input: {
      properties: 'relative_gender_' + relativeNo,
      choice: [{ label: 'ชาย' }, { label: 'หญิง' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'เวลาที่อยู่กับผู้สูงอายุ',
    },
    input: {
      properties: 'relative_timespent_' + relativeNo,
      choice: [
        { label: 'ทั้งวัน' },
        { label: ' เฉพาะกลางวัน' },
        { label: 'เฉพาะกลางคืน' },
      ],
    },
  },
  {
    type: 'dropdown',
    title: {
      title: 'ความสัมพันธ์กับผู้สูงอายุ',
    },
    input: {
      properties: 'relative_' + relativeNo,
      choice: [
        { label: 'บุตรชาย/บุตรสาว' },
        { label: ' ลูกเขยลูกสะใภ้' },
        { label: 'หลานชาย/หลานสาว' },
        { label: 'พี่น้อง' },
        { label: 'บิดามารดา' },
        { label: 'สามี/ภรรยา' },
        { label: 'บุคคลอื่น' },
      ],
    },
  },
  {
    type: 'input',
    title: {
      title: 'เบอร์โทรศัพท์ (ถ้ามี)',
    },
    input: [
      {
        properties: 'relative_tel_' + relativeNo,
        option: {
          placeholder: '+66',
          keyboardType: 'phone-pad',
          maxLength: 10,
        },
      },
    ],
  },
];

export default class EldHForm_1 extends Component {
  constructor(props) {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_1',
      specifyAddr: false,
    };
  }

  _setValue = ({ properties, value }) => {
    this.setState({ [properties]: { value } }, () => {
      this.props.onFormChange(this.state);
    });
  };

  _getUserData = async (userid) => {
    const url = `${MHW_HOST_V2}/mobile/mhcgetuserdetail?userid=${userid}`;
    const response = await fetch(url);
    const userData = await response.json();
    if (userData?.status === true) {
      const payload = userData?.payload;
      let dob = payload?.dob.substr(0, 4);
      dob < 2300
        ? (dob = moment(payload?.dob).add(543, 'year'))
        : (dob = payload?.dob);
      this.setState({ userData: payload });
      this.setState({ dob: moment(dob).format('YYYY-MM-DD') });
    } else {
      console.log(userData?.status);
    }
  };

  async componentDidMount() {
    const { partnerid, user } = this.props;
    await this._getUserData(user?.userid);

    this.setState(this.props.state);
    this.setState({ step: 1 });
    this.setState({
      drug_allergy_list_show: true,
      food_allergy_list_show: true,
      have_being_show: true,
      donthave_being_status_show: true,
      gold_card_list_show: true,
      handicapped_card_list_show: true,
    });
    if (partnerid === 'hosp32a0369b8a2cd444e62c5c1951339a0e') {
      this.setState({
        specifyAddr: true,
        // amphoe: { value: '' },
        // province: { value: '' },
        amphoe_cur: { value: 'เมืองชลบุรี' },
        province_cur: { value: 'ชลบุรี' },
      });
    }

    this._setValue({
      properties: 'idcard',
      value: this.state?.userData?.idcard,
    });

    if (this.state?.userData?.gender === 'male') {
      this._setValue({
        properties: 'namePrefix',
        value: 'นาย',
      });
    } else if (this.state?.userData?.gender === 'female') {
      this._setValue({
        properties: 'namePrefix',
        value: 'นางสาว',
      });
    }

    this._setValue({
      properties: 'name',
      value: this.state?.userData?.firstname,
    });

    this._setValue({
      properties: 'surname',
      value: this.state?.userData?.surname,
    });

    this._setValue({
      properties: 'dob',
      value: this.props.state?.dob?.value
        ? this.props.state?.dob?.value
        : this.state?.dob || moment(new Date()).add(543, 'year'),
    });
    this._setValue({
      properties: 'gender',
      value: this.state?.userData?.gender === 'male' ? 'ชาย' : 'หญิง',
    });

    this._setValue({
      properties: 'tel',
      value:
        this.state?.userData.tel && this.state?.userData.tel !== 'undefined'
          ? this.state?.userData.tel
          : '',
    });

    this._setValue({
      properties: 'addrID',
      value: this.state?.userData?.addr?.no,
    });

    this._setValue({
      properties: 'alley',
      value: this.state?.userData?.addr?.alley,
    });

    this._setValue({
      properties: 'road',
      value: this.state?.userData?.addr?.road,
    });

    this._setValue({
      properties: 'district',
      value: this.state?.userData?.addr?.subdistrict,
    });

    this._setValue({
      properties: 'village',
      value: this.state?.userData?.addr?.village,
    });

    this._setValue({
      properties: 'amphoe',
      value: this.state?.userData?.addr?.district,
    });

    this._setValue({
      properties: 'province',
      value: this.state?.userData?.addr?.province,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      drug_allergy,
      food_allergy,
      being_status,
      dob,
      access_to_treatment,
    } = this.state;
    if (prevState.drug_allergy?.value !== drug_allergy?.value) {
      if (drug_allergy?.value === 'แพ้ยา') {
        this.setState({
          drug_allergy_list_show: false,
        });
      } else {
        this.setState({
          drug_allergy_list_show: true,
        });
      }
    }
    const now = moment(new Date()).add(543, 'year')?.format('Y');
    const end = moment(dob?.value)?.format('Y');
    const age = now - end;
    if (prevState?.dob?.value !== dob?.value) {
      if (age > 0) {
        this._setValue({
          properties: 'age',
          value: age.toString(),
        });
      }
    }

    if (prevState.food_allergy?.value !== food_allergy?.value) {
      if (food_allergy?.value === 'แพ้อาหาร') {
        this.setState({
          food_allergy_list_show: false,
        });
      } else {
        this.setState({
          food_allergy_list_show: true,
        });
      }
    }

    if (prevState.being_status?.value !== being_status?.value) {
      if (being_status?.value === 'อยู่ลำพัง') {
        this.setState({
          have_being_show: false,
          donthave_being_status_show: true,
        });
      } else {
        this.setState({
          have_being_show: true,
          donthave_being_status_show: false,
        });
      }
    }
    if (prevState.access_to_treatment?.value !== access_to_treatment?.value) {
      if (access_to_treatment?.value === 'บัตรทอง') {
        this.setState({
          gold_card_list_show: false,
          handicapped_card_list_show: true,
        });
      } else if (access_to_treatment?.value === 'บัตรผู้พิการ') {
        this.setState({
          gold_card_list_show: true,
          handicapped_card_list_show: false,
        });
      } else {
        this.setState({
          gold_card_list_show: true,
          handicapped_card_list_show: true,
        });
      }
    }
  }

  renderForm() {
    const { step, currentAddr, hasRelative_1, specifyAddr } = this.state;

    const defaultInfo = () => {
      return (
        <>
          {basicInformation_1.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))}
          {true ? (
            <>
              {basicInformation_addr(specifyAddr, '').map((item, i) => (
                <React.Fragment key={i}>
                  <RenderItem
                    item={item}
                    state={this.state}
                    setState={(value) => this._setValue(value)}
                  />
                </React.Fragment>
              ))}
              {basicInformation_addrQuestion.map((item, i) => (
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
          {currentAddr?.value === 'ไม่ใช่'
            ? basicInformation_addr_current(specifyAddr, '_cur').map(
                (item, i) => (
                  <React.Fragment key={i}>
                    <RenderItem
                      item={item}
                      state={this.state}
                      setState={(value) => this._setValue(value)}
                    />
                  </React.Fragment>
                ),
              )
            : null}
        </>
      );
    };

    const renderPage2 = () => {
      return (
        <>
          {basicInformation_2.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))}
          {/* {haveBeingStatus.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))} */}
          {/* {basicInformation_3.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))} */}
        </>
      );
    };

    const relationInfo = () => {
      return (
        <>
          {basicInformation_4.map((item, i) => (
            <React.Fragment key={i}>
              <RenderItem
                item={item}
                state={this.state}
                setState={(value) => this._setValue(value)}
              />
            </React.Fragment>
          ))}
          {hasRelative_1?.value === 'มี'
            ? relativeInfo(1).map((item, i) => (
                <React.Fragment key={i}>
                  <RenderItem
                    item={item}
                    state={this.state}
                    setState={(value) => this._setValue(value)}
                  />
                </React.Fragment>
              ))
            : null}
        </>
      );
    };

    switch (step) {
      case 1:
        return defaultInfo();
      case 2:
        return renderPage2();
      case 3:
        return relationInfo();

      default:
        return defaultInfo();
    }
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
              if (step === 2) {
                this.setState({ step: 3 });
              } else {
                this.setState({ step: 2 });
              }
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
  btn: {},
});
