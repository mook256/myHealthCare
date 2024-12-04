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
      title:
        'ปัสสาวะเล็ดหรือราดทําให้การใช้ชีวิตประจําวันของผู้สูงอายุมีปัญหาหรือไม่',
    },
    input: {
      properties: 'urinaryIncontinence2Form',
      choice: [{ label: 'มี' }, { label: 'ไม่มี' }],
    },
  },
];

export default class EldHForm_10 extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      formName: 'EldHForm_10',
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
