import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../../../styles';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';

const data = [
  {
    type: 'radio',
    title: {
      title: '1. กินอาหารได้เอง เมื่อเตรียมสํารับไว้ให้ต่อหน้า',
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
      title: '2. ล้างหน้า หวีผม แปรงฟัน โกนหนวด 1-2 วันที่ผ่านมา',
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
      title: '3. ลุกนั่งจากที่นอน หรือจากเตียงไปเก้าอี้',
    },
    input: {
      properties: 'adl_3',
      choice: [
        { label: 'ทําได้เอง', value: 3 },
        { label: 'ต้องช่วยเหลือบ้าง', value: 2 },
        { label: 'ต้องช่วยเหลืออย่างมาก', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '4. การใช้ห้องน้ำ ห้องส้วม',
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
      title: '5. การเคลื่อนที่ภายในห้องหรือบ้าน',
    },
    input: {
      properties: 'adl_5',
      choice: [
        { label: 'เดินได้เอง', value: 3 },
        { label: 'เดินได้ต้องช่วยพยุง', value: 2 },
        { label: 'ใช้รถเข็น แต่ไม่ต้องช่วย', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '6. การสวมเสื้อผ้า',
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
      title: '7. การขึ้นลงบันได',
    },
    input: {
      properties: 'adl_7',
      choice: [
        {
          label: 'ขึ้นลงได้เอง / ถ้าใช้เครื่องช่วยต้องเอาขึ้นลงได้',
          value: 2,
        },
        { label: 'ต้องมีคนช่วย จึงจะขึ้นได้', value: 1 },
        { label: 'ทําไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '8. การอาบน้ำ',
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
      title: '9. การกลั้นอุจจาระ ในระยะ 1 สัปดาห์ที่ผ่านมา',
    },
    input: {
      properties: 'adl_9',
      choice: [
        { label: 'กลั้นได้ปกติ', value: 2 },
        {
          label: 'กลั้นไม่ได้บางครั้ง แต่น้อยกว่าวันละ 1 ครั้ง/สัปดาห์',
          value: 1,
        },
        { label: 'กลั้นไม่ได้', value: 0 },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '10. การกลั้นปัสสาวะ ในระยะ 1 สัปดาห์ที่ผ่านมา',
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

const data_taiClassified = [
  {
    type: 'radio',
    title: {
      title: 'Immobilize',
    },
    input: {
      properties: 'immobilizeForm',
      choice: [
        { label: 'นอนบนเตียงตะแคงไม่ได้' },
        { label: 'นอนบนเตียงตะแคงไปมาได้' },
        { label: 'ลุกนั่งและลงมายืนข้างเตียงได้' },
        { label: 'เดินทางราบได้โดยไม่ต้องช่วย' },
        { label: 'ขึ้นบันไดไม่ได้ แต่เดินทางราบได้โดยไม่ต้องช่วย' },
        { label: 'เดินขึ้นบันไดได้' },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'Feed',
    },
    input: {
      properties: 'feedForm',
      choice: [
        { label: 'IV' },
        { label: ' NG Tube' },
        { label: 'ต้องป้อนและกลืนลำบาก' },
        { label: 'ต้องป้อน แต่กลืนเองได้ปกติ' },
        { label: 'กินเองได้ หกเลอะเทอะ' },
        { label: 'กินได้เอง ไม่หกเลอะเทอะ' },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'Mental',
    },
    input: {
      properties: 'mentalForm',
      choice: [
        { label: 'No Response' },
        { label: 'มีปัญหาทั้ง Orientation อย่างรุนแรงและปัญหาพฤติกรรม' },
        { label: 'มีปัญหาเฉพาะเรื่อง Orientation อย่างรุนแรง' },
        {
          label:
            'ไม่มีปัญหาเรื่อง Orientation แต่มีปัญหาพฤติกรรมจนสร้างความรำคาญ',
        },
        { label: 'มีปัญหาเรื่องการตัดสินใจและความจำ ด้านพฤติกรรมปกติ' },
        {
          label: 'ไม่มีปัญหาเรื่องความจำ / การตัดสินใจ Orientation & พฤติกรรม',
        },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: 'Toilet',
    },
    input: {
      properties: 'toiletForm',
      choice: [
        { label: 'คาสายสวนปัสสาวะ' },
        { label: 'ใส่ / เปลี่ยนผ้าอ้อมด้วยความยากลำบาก' },
        { label: 'ใส่ / เปลี่ยนผ้าอ้อมไม่ลำบาก ต้องช่วยบ้าง' },
        { label: 'ต้องช่วยประคองไปห้องน้ำและช่วยจัดการหลังถ่ายเสร็จ' },
        { label: 'ไปห้องน้ำเองได้ แต่ถ่ายไม่สำเร็จเป็นบางครั้ง' },
        { label: 'ไปห้องน้ำเองได้ ถ่ายสำเร็จทุกครั้งใน 2 อาทิตย์ที่ผ่านมา' },
      ],
    },
  },
];

export default class EldHForm_4 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_6',
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

  renderForm() {
    const { step } = this.state;

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
      </>
    );
  }

  renderBottom() {
    const {
      adl_1,
      adl_2,
      adl_3,
      adl_4,
      adl_5,
      adl_6,
      adl_7,
      adl_8,
      adl_9,
      adl_10,
      summary,
    } = this.state;

    // console.log('summary');

    const setADL = () => {
      let score = 0;
      const validate = !!(
        adl_1 &&
        adl_2 &&
        adl_3 &&
        adl_4 &&
        adl_5 &&
        adl_6 &&
        adl_7 &&
        adl_8 &&
        adl_9 &&
        adl_10
      );

      if (validate) {
        for (let i = 1; i <= 10; i++) {
          score += data
            .find((x) => x?.input?.properties === `adl_${i}`)
            ?.input?.choice?.find(
              (x) => x?.label === this?.state?.[`adl_${i}`]?.value,
            )?.value;
        }
        let adl_group = '';
        if (score >= 12) {
          adl_group = 'กลุ่ม 1';
        } else if (score >= 5) {
          adl_group = 'กลุ่ม 2';
        } else {
          adl_group = 'กลุ่ม 3';
        }
        this._setValue({
          properties: 'summary',
          value: {
            adl_point: `${score}`,
            adl_group: adl_group,
          },
        });
        return true;
      } else {
        Alert.alert('แปลผลคะแนน ADL', 'กรุณาทำแบบทดสอบให้ครบทุกข้อ');
        return false;
      }
    };

    const aldPoint = summary?.value?.adl_point;

    return (
      <View style={styles.bottomContainer}>
        {aldPoint ? (
          <Text style={styles.text}>
            การแปลผล {aldPoint} คะแนน ({summary?.value?.adl_group})
          </Text>
        ) : null}
        {aldPoint < 11 ? (
          <Text
            style={[
              styles.text,
              { color: colors.textMuted, textAlign: 'center' },
            ]}>
            *เนื่องจากผลการประมาณต่ำกว่าเกณฑ์กรุณาทำแบบประเมิณ TAI Classified
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
            {true ? (
              <Text style={styles.btnText}>แปลผลคะแนน ADL</Text>
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
        {this.renderBottom()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottomContainer: {
    // justifyContent: 'space-between',
    padding: 10,
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
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.success,
  },
});
