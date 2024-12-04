import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Video from 'react-native-video';
import { INSTRUCTION_VIDEO_URL } from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';

class InstructionVideoScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.backBtnPosition}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <Video
          style={styles.videoScreen}
          source={{ uri: INSTRUCTION_VIDEO_URL }}
          resizeMode="stretch"
          controls
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backBtnPosition: {
    // layout
    position: 'absolute',
    top: 20,
    left: 30,
    zIndex: 2,

    height: 80,
    width: 200,

    flexDirection: 'row',
  },
  backImg: {
    flex: 1,
    height: 80,
    resizeMode: 'contain',
  },
  videoScreen: {
    width: '100%',
    height: '100%',
  },
});

export default InstructionVideoScreen;
