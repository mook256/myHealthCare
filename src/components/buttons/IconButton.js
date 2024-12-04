import React from 'react';

import { TouchableOpacity, StyleSheet } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function IconButton({ name, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <FontAwesome name={name} style={styles.icon} size={30} color="#cfd8dc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    alignSelf: 'center',
  },
});
