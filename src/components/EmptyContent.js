import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { colors } from '../styles';

const HEIGHT_IMAGE = Dimensions.get('window').height / 2.5;
const WIDTH_IMAGE = Dimensions.get('window').width / 1.2;
const WIDTH_WEB = Dimensions.get('window').width;

export default function EmptyContent({
  hiddenBtn,
  type,
  activityLoader,
  textBtn,
  onPress,
  source,
  body,
}) {
  return (
    <View style={styles.container}>
      {type === 'image' && <Image style={styles.image} source={source} />}
      {type === 'web' && (
        <WebView
          source={source}
          style={styles.webSize}
          bounces={false}
          scrollEnabled={false}
          javaScriptEnable
          useWebKit
        />
      )}
      {typeof body.title !== 'undefined' && (
        <Text style={styles.title}>{body.title}</Text>
      )}
      {typeof body.descriptions !== 'undefined' && (
        <Text style={styles.descriptions}>{body.descriptions}</Text>
      )}
      {!hiddenBtn && (
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.textBtn}>{textBtn}</Text>
        </TouchableOpacity>
      )}
      {activityLoader && (
        <ActivityIndicator size="large" style={styles.actInt} />
      )}
    </View>
  );
}

EmptyContent.defaultProps = {
  source: {
    uri: 'https://cdn.dribbble.com/users/486498/screenshots/3300290/bike.jpg',
  },
  type: 'image',
  hiddenBtn: false,
  activityLoader: false,
  onPress() {},
  body: {},
  textBtn: 'Add',
};

EmptyContent.propTypes = {
  body: PropTypes.shape({
    title: PropTypes.string,
    descriptions: PropTypes.string,
  }),
  type: PropTypes.string,
  source: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
      headers: PropTypes.objectOf(PropTypes.string),
    }),
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.shape({
        uri: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        headers: PropTypes.objectOf(PropTypes.string),
      }),
    ),
  ]),
  onPress: PropTypes.func,
  hiddenBtn: PropTypes.bool,
  activityLoader: PropTypes.bool,
  textBtn: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  webSize: {
    width: WIDTH_WEB,
    height: 160,
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
    marginTop: 20,
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
  actInt: {
    marginTop: 20,
  },
});
