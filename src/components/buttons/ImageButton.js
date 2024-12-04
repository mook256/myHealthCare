import React from 'react';

import { TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function ImageButton({
  source,
  onPress,
  width = 75,
  height = 75,
}) {
  return (
    <TouchableOpacity style={{ width, height }} onPress={onPress}>
      <Image style={styles.img} source={source} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
