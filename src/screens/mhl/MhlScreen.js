import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import BackButton from '../../components/buttons/BackButton';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
export default function MhlScreen({
  t,
  navigation,
  availableDeviceTypes,
  config,
}) {
  //   const { navigation } = this.props;
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });
  const WidthMoreThenHeight = window.width > window.height;
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });
  const source = { uri: navigation.getParam('url') };
  // const source = { uri: 'http://110.49.2.20:5002/signin' };
  // const source = { uri: 'https://myhealthlink-ikhalas.web.app/signin' };
  console.log('source', navigation.getParam('url'));
  return (
    <>
      {WidthMoreThenHeight ? (
        <>
          <View style={styles.WidthHeight}>
            <BackButton onPress={() => navigation.navigate('Home')} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.HeightWidth}>
            <BackButton onPress={() => navigation.navigate('Home')} />
          </View>
        </>
      )}

      <WebView source={source} />
    </>
  );
}

const styles = StyleSheet.create({
  WidthHeight: {
    position: 'absolute',
    top: 5,
    left: 200,
    zIndex: 2,
  },
  HeightWidth: {
    position: 'absolute',
    top: -10,
    left: 10,
    zIndex: 2,
  },
});
