import { Row } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { InputBox, LabelBox } from '../../component/FormItem';
import { RenderItem } from '../../component/RenderFormItem';

const data = [
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
        { label: 'มีปัญหาเรื่องการตัดสินใจและความจำ ( ด้านพฤติกรรมปกติ )' },
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

export default class EldHForm_6_1 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_6_1',
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
    return (
      <>
        {this.renderForm()}
        {/* {this.renderBottom()} */}
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
