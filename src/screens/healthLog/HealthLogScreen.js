import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Input, Item, Label } from 'native-base';
import { Row, Col } from 'react-native-easy-grid';

class HealthLogScreen extends Component {
  NUMBER_RE = /^\d*\.?\d*$/g;
  INPUT_FIELDS = {
    sbp: {
      field: 'sbp',
      title: 'Systolic Bloood Pressure (SBP)',
      placeHolder: '',
      unit: 'มิลลิเมตรปรอท',
    },
    dbp: {
      field: 'dbp',
      title: 'Diastolic Blood Pressure (DBP)',
      placeHolder: '',
      unit: 'มิลลิเมตรปรอท',
    },
    hr: {
      field: 'hr',
      title: 'Heart Rate',
      placeHolder: '',
      unit: 'ครั้งต่อนาที',
    },
    weight: {
      field: 'weight',
      title: 'Weight',
      placeHolder: '',
      unit: 'กิโลกรัม',
    },
    temp: {
      field: 'temp',
      title: 'Tempurature',
      placeHolder: '',
      unit: 'องศาเซลเซียส',
    },
    spo2: {
      field: 'spo2',
      title: 'Oxygen Saturation',
      placeHolder: '',
      unit: '%',
    },
  };
  constructor(props) {
    super(props);
    const { sbp, dbp, hr, weight, temp, spo2 } = props;
    this.state = {
      // blood pressure
      sbp: sbp.toString(),
      dbp: dbp.toString(),
      // heart rate
      hr: hr.toString(),
      // weight
      weight: weight.toString(),
      // tempurature
      temp: temp.toString(),
      // oxygen saturation
      spo2: spo2.toString(),
    };
  }

  onChange = () => {
    const { handleChange, navigation } = this.props;
    const { sbp, dbp, hr, weight, temp, spo2 } = this.state;
    handleChange({
      sbp: Number(sbp),
      dbp: Number(dbp),
      hr: Number(hr),
      weight: Number(weight),
      temp: Number(temp),
      spo2: Number(spo2),
    });
    navigation.goBack();
  };

  handleChangeText = (field, text) => {
    if (text.match(this.NUMBER_RE)) {
      this.setState({ [field]: text });
    }
  };

  renderField({ field, title = '', placeHolder = '', unit = '' }) {
    const value = this.state[field];
    return (
      <Item style={{ padding: 10, backgroundColor: 'white' }}>
        <Label style={{ fontWeight: 'bold' }}>{title} : </Label>
        <Input
          placeholder={placeHolder}
          maxLength={10}
          value={value}
          keyboardType="decimal-pad"
          onChangeText={(text) => this.handleChangeText(field, text)}
        />
        <View style={styles.pillBox}>
          <Text style={styles.pillBoxText}>{unit}</Text>
        </View>
      </Item>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <ScrollView>
          <Row>
            <Col>{this.renderField(this.INPUT_FIELDS.sbp)}</Col>
            <Col>{this.renderField(this.INPUT_FIELDS.dbp)}</Col>
          </Row>
          <Row>
            <Col>{this.renderField(this.INPUT_FIELDS.hr)}</Col>
          </Row>
          <Row>
            <Col>{this.renderField(this.INPUT_FIELDS.weight)}</Col>
          </Row>
          <Row>
            <Col>{this.renderField(this.INPUT_FIELDS.temp)}</Col>
          </Row>
          <Row>
            <Col>{this.renderField(this.INPUT_FIELDS.spo2)}</Col>
          </Row>
        </ScrollView>
        <TouchableOpacity
          style={{
            height: 70,
            marginTop: 10,
            backgroundColor: '#fe1a6a',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.onChange}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontWeight: 'bold',
            }}>
            บันทึกข้อมูล
          </Text>
        </TouchableOpacity>
        {/* <Button title="Save" color="#fe1a6a" onPress={this.onChange} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  inputField: {
    borderRadius: 10,
    marginLeft: 10,
    fontSize: 16,
    height: 40,
  },
  pillBox: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pillBoxText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default HealthLogScreen;
