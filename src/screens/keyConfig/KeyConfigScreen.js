import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-paper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default class KeyConfigScreen extends Component {
  state = {
    text: '',
    dimensions: {
      window: {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
      },
      screen: screenDimensions,
    },
  };
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };

  onChangeText = (text) => {
    this.setState({ text });
  };

  onSubmit = () => {
    const { registerConfig } = this.props;
    const { text } = this.state;
    registerConfig(text);
  };

  componentDidMount() {
    const { resetError } = this.props;
    resetError();
    this.dimensionsSubscription = Dimensions.addEventListener(
      'change',
      this.onChange,
    );
  }
  componentWillUnmount() {
    this.dimensionsSubscription?.remove();
  }
  render() {
    const {
      text,
      dimensions: { window, screen },
    } = this.state;
    console.log(window.width);
    const { config, navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text
            style={{ fontSize: window.width > window.height ? 24 : window.width>400? 24:20, fontWeight: 'bold', textAlign: 'center' }}>
            This Device doesn't been registered!
          </Text>
          <Text
            style={{
              textAlign: window.width > window.height ? 'left' : 'center',
            }}>
            Please insert device key below
          </Text>
        </View>
        <TextInput
          style={{
            height: 60,
            width: window.width > window.height ? '50%' : '80%',
            letterSpacing: 3,
            margin: 10,
            borderWidth: 1,
            fontSize: window.width > window.height ? 24 : window.width>400? 18:14,
          }}
          onChangeText={this.onChangeText}
          placeholder={'Insert Device Key here.'}
          value={text}
        />
        <View style={styles.errorField}>
          {config.error && (
            <>
              <MaterialIcons name="error-outline" size={25} color={'red'} />
              <Text style={styles.textError}>{config.error}</Text>
            </>
          )}
        </View>
        <View style={{ flex: 1, width: window.width>window.height?'50%':'80%' }}>
          <Button
            style={styles.btn}
            contentStyle={styles.btnContent}
            labelStyle={[styles.btnText,{fontSize: window.width > window.height ? 20 : window.width>400? 20:16,}]}
            mode="contained"
            disabled={config.loading}
            onPress={this.onSubmit}>
            <Text>Submit</Text>
          </Button>
          <Button
            style={[styles.btn, styles.bgOrange]}
            contentStyle={styles.btnContent}
            labelStyle={[styles.btnText,{fontSize: window.width > window.height ? 20 : window.width>400? 20:16,}]}
            mode="contained"
            disabled={config.loading}
            onPress={() => navigation.navigate('QRConfig')}>
            <FontAwesome name="qrcode" size={24} /> Register with QR code
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 15,
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 60,
    width: '40%',
    letterSpacing: 3,
    margin: 10,
    borderWidth: 1,
    fontSize: 24,
  },
  errorField: {
    height: 25,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textError: {
    alignItems: 'center',
    color: 'red',
  },
  bgOrange: {
    backgroundColor: 'orange',
  },
  btnContainer: {
    flex: 1,
    width: '50%',
  },
  btn: {
    marginTop: 15,
  },
  btnContent: {
    height: 50,
  },
  btnText: {
    fontSize: 20,
  },
});
