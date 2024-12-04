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
      title: '1. นับนิ้วในระยะ 3 เมตรผิด 2 ครั้งขึ้นไปจาก 4 ครั้ง',
    },
    input: {
      properties: 'countingFingersForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '2. อ่านหนังสือพิมพ์ในระยะ 1 ฟุต ไม่ได้',
    },
    input: {
      properties: 'readNewspaperForm',
      choice: [{ label: 'ใช่' }, { label: 'ไม่ใช่' }],
    },
  },
  {
    type: 'radio',
    title: {
      title: '3. ตามัวคล้ายมีหมอกบัง',
    },
    input: {
      properties: 'blurredVisionForm',
      choice: [
        { label: 'ตาข้างขวา' },
        { label: 'ตาข้างซ้าย' },
        { label: 'ทั้งสองข้าง ' },
        { label: 'ไม่ใช่' },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title:
        '4. ตามองเห็นชัดตรงกลาง แต่ไม่เห็นสิ่งรอบข้าง หรือ มักเดินชนประตู/สิ่งของบ่อยๆ',
    },
    input: {
      properties: 'visibleMiddleForm',
      choice: [
        { label: 'ตาข้างขวา' },
        { label: 'ตาข้างซ้าย' },
        { label: 'ทั้งสองข้าง ' },
        { label: 'ไม่ใช่' },
      ],
    },
  },
  {
    type: 'radio',
    title: {
      title: '5. ตามองเห็นจุดดํากลางภาพหรือเห็นภาพบิดเบี้ยว',
    },
    input: {
      properties: 'blackDotMiddleForm',
      choice: [
        { label: 'ตาข้างขวา' },
        { label: 'ตาข้างซ้าย' },
        { label: 'ทั้งสองข้าง ' },
        { label: 'ไม่ใช่' },
      ],
    },
  },
];

export default class EldHForm_4 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_4',
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
