import React from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions } from 'react-native';

export default function Input(props) {
  return (
    <View style={styles.menuBoxInputSet}>
      <TextInput
        style={styles.menuBoxInput}
        keyboardType={props?.keyboardType || 'default'}
        maxLength={props?.maxLength}
        placeholder={props?.placeholder}
        value={props?.value}
        onChangeText={(text) => props?.onChangeText(text)}
      />
      <View style={styles.menuBoxInputIcon}>
        <Text style={styles.menuBoxInputIconText}>{`${props?.iconText}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuBoxInputSet: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  menuBoxInput: {
    borderRadius: 10,
    marginLeft: 10,
    fontSize: 16,
    height: 40,
    width: Dimensions.get('window').width * 0.7,
  },
  menuBoxInputIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuBoxInputIconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
