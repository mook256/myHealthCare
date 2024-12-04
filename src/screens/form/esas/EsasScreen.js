import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import BackButton from '../../../components/buttons/BackButton';

import EsasWebView from './EsasWebView';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export class EsasScreen extends Component {
  state = {
    dimensions: {
      window: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      },
      screen: screenDimensions,
    },
  };
  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };
  componentDidMount() {
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
      navigation,
      t,
      currentuser,
      user,
      authentication,
      config,
    } = this.props;
    const {
      dimensions: { window },
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <BackButton onPress={() => navigation.goBack()} />
        <EsasWebView
          currentuser={currentuser}
          user={user}
          authentication={authentication}
          config={config}
        />
      </View>
    );
  }
}

export default EsasScreen;
