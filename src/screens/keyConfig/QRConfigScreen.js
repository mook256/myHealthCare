import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import _ from 'lodash';

import BackButton from '../../components/buttons/BackButton';

export default class QRConfigScreen extends Component {
  state = {
    enableScan: true,
  };
  onReadCode = (event) => {
    const { registerConfig } = this.props;
    const qrcodeValue = event?.nativeEvent?.codeStringValue; // event is very mutable, so just read as fast as possible
    if (!_.isString(qrcodeValue)) {
      return;
    }
    this.setState(
      {
        enableScan: false,
      },
      () => {
        Alert.alert(`Register code '${qrcodeValue}'?`, null, [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              this.setState({ enableScan: true });
            },
          },
          {
            text: 'Confirm',
            onPress: async () => {
              await registerConfig(qrcodeValue);
              this.setState({ enableScan: true });
            },
          },
        ]);
      },
    );
  };

  render() {
    const { navigation, config } = this.props;
    const { enableScan } = this.state;
    return (
      <View style={styles.container}>
        <Camera
          style={styles.container}
          cameraType={CameraType.Front}
          scanBarcode={enableScan}
          onReadCode={(event) => this.onReadCode(event)}
          hideControls
          showFrame={enableScan}
          laserColor="transparent"
          frameColor="white"
        />
        <View style={styles.backButtonPosition}>
          <BackButton onPress={() => navigation.navigate('KeyConfig')} />
        </View>
        <View>
          <Text>Error: {config.error}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonPosition: {
    position: 'absolute',
    top: 30,
    left: 30,
  },
});
