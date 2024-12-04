import React, { useEffect, useState } from 'react';

import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BackButton({ onPress }) {
  const [dimensions, setDimensions] = useState({
    window: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
    },
    screen: screenDimensions,
  });
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });
  const WidthMoreThenHeight =
    dimensions.window.width > dimensions.window.height;
  const width = dimensions.window.width;
  const height = dimensions.window.height;
  return (
    <>
      {WidthMoreThenHeight ? (
        <>
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <FontAwesome
              name="chevron-left"
              style={styles.icon}
              size={30}
              color="#cfd8dc"
              // color="black"
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              marginTop: 15,
              marginLeft: width > 400 ? 10 : 0,
              width: width > 400 ? 70 : 60,
              height: width > 400 ? 70 : 60,
              borderRadius: 50,
              backgroundColor: '#FFFFFF',
            }}
            onPress={onPress}>
            <FontAwesome
              name="chevron-left"
              style={styles.icon}
              size={width > 400 ? 30 : 20}
              color="#cfd8dc"
              // color="black"
            />
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    marginTop: 10,
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
