import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { colors } from '../../../styles';
import 'moment/locale/th';
import moment from 'moment';

export default class DateInput extends Component {
  constructor() {
    super();
    moment.locale = 'th';
    this.state = {
      openDatePicker: false,
      date: moment().add(543, 'year'),
    };
  }

  _toggleDatePicker = () => {
    const { openDatePicker } = this.state;
    this.setState({ openDatePicker: !openDatePicker });
  };

  _onDateChange = (value) => {
    const { onChange } = this.props;
    // console.log(value);
    // console.log(moment(value).format('DD/MM/YYYY'));
    if (onChange) {
      this.setState({ date: value }, () => {
        onChange(value);
      });
    }
  };

  renderDatePickerModal() {
    const { openDatePicker, date } = this.state;
    const locale = 'th';
    return (
      <Modal
        isVisible={openDatePicker}
        onBackdropPress={() => this._toggleDatePicker()}
        backdropOpacity={0.1}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver
        hideModalContentWhileAnimating
        style={styles.modalView}>
        <View style={styles.modalContainer}>
          <View style={styles.dateContainer}>
            <DatePicker
              date={date}
              onDateChange={(value) => {
                this._onDateChange(value);
              }}
              maximumDate={moment().add(543, 'year')}
              mode="date"
              locale={locale}
            />
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => this._toggleDatePicker()}>
              <Button style={styles.confirmText}>Confirm</Button>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    const { placeholder, value } = this.props;
    return (
      <>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this._toggleDatePicker()}
          activeOpacity={1}>
          {value ? (
            <Text style={styles.textValue}>
              {moment(value).format('DD/MM/YYYY')}
            </Text>
          ) : (
            <Text style={styles.textPlaceholderValue}>{placeholder}</Text>
          )}
        </TouchableOpacity>
        {this.renderDatePickerModal()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textMuted,
  },
  textPlaceholderValue: {
    fontSize: 16,
  },
  // modal
  modalView: {
    alignSelf: 'center',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderRadius: 20,
  },
  modalHeader: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  confirmText: {
    fontSize: 24,
    marginVertical: 3,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
