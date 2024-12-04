import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles';

const HEIGHT_IMAGE = Dimensions.get('window').height / 2.5;
const WIDTH_IMAGE = Dimensions.get('window').width / 1.2;

export default function ErrorRequest({ hiddenBtn, onPress }) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/images/no-internet.png')} />
      <Text style={styles.title}>Ooops!</Text>
      <Text style={styles.descriptions}>
        Slow or not internet connection. Check your internet settings.
      </Text>
      {!hiddenBtn && (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.textBtn}>TRY AGAIN</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

ErrorRequest.defaultProps = {
  hiddenBtn: false,
  onPress() {},
};

ErrorRequest.propTypes = {
  hiddenBtn: PropTypes.bool,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: WIDTH_IMAGE,
    height: HEIGHT_IMAGE,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)',
    marginLeft: 15,
    marginRight: 15,
  },
  descriptions: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(0,0,0,0.4)',
    marginLeft: 15,
    marginRight: 15,
  },
  btn: {
    margin: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  textBtn: {
    color: colors.textWhite,
  },
});
