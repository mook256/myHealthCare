import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../../styles';

export default class ErrorBox extends Component {
  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.massage}>Massage</Text>
        <Ionicons name="md-close" style={styles.close} size={20} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: colors.danger,
  },
  massage: {
    flex: 1,
    color: colors.textWhite,
    fontSize: fonts.regular,
  },
  close: {
    width: 30,
    textAlign: 'center',
    color: colors.textWhite,
  },
});
