import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

class ModalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: props.value[0].toString(),
      value2: props.value[1].toString(),
    };
  }

  handleChangeValue1 = (value) => {
    this.setState({ value1: value });
  };

  handleChangeValue2 = (value) => {
    this.setState({ value2: value });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const { value1, value2 } = this.state;
    onSubmit([Number(value1), Number(value2)]);
  };

  render() {
    const { title, icon, iconColor, maxLength, unit } = this.props;
    const { value1, value2 } = this.state;
    return (
      <KeyboardAvoidingView style={styles.centeredView} behavior={'padding'}>
        <View style={styles.modalView}>
          <View style={styles.leftPanel}>
            <View style={styles.titlePanel}>
              <Text style={styles.titleText}>{title}</Text>
              <FontAwesome
                name={icon}
                style={[styles.titleIcon, { marginRight: 5, color: iconColor }]}
              />
            </View>
            <View style={styles.inputPanel}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  keyboardType={'decimal-pad'}
                  maxLength={maxLength}
                  value={value1}
                  onChangeText={this.handleChangeValue1}
                />
              </View>
              <Text style={{ fontSize: 36, fontWeight: 'bold' }}>/</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  keyboardType={'decimal-pad'}
                  maxLength={maxLength}
                  value={value2}
                  onChangeText={this.handleChangeValue2}
                />
              </View>
              <Text style={styles.pillbox}>{unit}</Text>
            </View>
          </View>
          <View style={styles.rightPanel}>
            <View style={styles.btnPanel}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={this.handleCancel}>
                <Text style={styles.btnText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={this.handleSubmit}>
                <Text style={styles.btnText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  leftPanel: {
    flex: 2,
    marginRight: 20,
  },
  rightPanel: {
    flex: 1,
  },
  titlePanel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleIcon: {
    marginLeft: 15,
    fontSize: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  centeredKeyboardView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
    width: 600,
    height: 200,
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
  },
  inputPanel: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInputContainer: {
    width: 75,
    borderBottomWidth: 4,
    borderColor: 'grey',
    marginRight: 20,
  },
  textInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -10,
  },
  pillbox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'grey',
    color: 'white',
  },
  btnPanel: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ff2014',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#25a18d',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ModalView;
