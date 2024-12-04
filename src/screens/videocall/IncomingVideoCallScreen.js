/* eslint-disable react/no-multi-comp */

import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Sound from 'react-native-sound';
import RNBackgroundTime from 'react-native-background-timer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  centerView: {
    paddingTop: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  bottomView: {
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  iconLg: {
    backgroundColor: '#cfd8dc',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
  },
  redIcon: {
    backgroundColor: '#ff5252',
  },
  greenIcon: {
    backgroundColor: '#64dd17',
  },
  headerTitle: {
    fontFamily: 'NotoSansThaiUI-Regular',
    color: 'rgba(0,0,0,0.4)',
    fontSize: 20,
    marginBottom: 50,
  },
  nameFonts: {
    fontFamily: 'NotoSansThaiUI-Regular',
    color: 'rgba(0,0,0,0.8)',
    fontSize: 26,
    marginTop: 50,
  },
});

class IconButton extends PureComponent {
  render() {
    const { name, onPress, style = styles.icon } = this.props;
    return (
      <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.7}>
        <Icon name={name} size={30} color="white" />
      </TouchableOpacity>
    );
  }
}
IconButton.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};
IconButton.defaultProps = {
  style: styles.icon,
};

class IncomingVideoCallScreen extends Component {

  componentDidMount() {
    this.sound = new Sound('dial.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return;
      }
      this.sound.setNumberOfLoops(-1);
    
      // Play the sound with an onEnd callback
      this.sound.play();
    });
    this.timeout = RNBackgroundTime.setTimeout(() => {
      this.handleCancel();
    }, 90 * 1000);
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.release();
    }
    if (this.timeout != null) {
      clearInterval(this.timeout);
    }
  }

  handleCancel = () => {
    const { navigation, endCall } = this.props;
    const callUUID = navigation.getParam('callUUID');
    endCall(callUUID);
    navigation.goBack();
  };

  handleAccept = () => {
    const { navigation, endCall } = this.props;
    const callUUID = navigation.getParam('callUUID');
    const callId = navigation.getParam('callId');
    const participantName = navigation.getParam('participantName');
    const channelName = navigation.getParam('channelName');

    endCall(callUUID);
    navigation.replace('VideoCall', {
      callUUID,
      callId,
      participantName,
      channelName,
      callType: 'incoming',
    });
  };

  renderButtons = () => (
    <View style={styles.bottomView}>
      <IconButton name="times" style={[styles.icon, styles.redIcon]} onPress={this.handleCancel} />
      <IconButton
        name="video"
        style={[styles.icon, styles.greenIcon]}
        onPress={this.handleAccept}
      />
    </View>
  );

  render() {
    const { navigation } = this.props;
    const participantName = navigation.getParam('participantName', 'Telemed');
    return (
      <View style={styles.container}>
        <View style={styles.centerView}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Incoming Telemedicine
          </Text>
          <View style={styles.iconLg}>
            <Icon name="user-alt" size={75} style={{ color: '#eceff1' }} />
          </View>
          <Text style={styles.nameFonts} numberOfLines={1}>
            {participantName}
          </Text>
        </View>
        <View style={styles.absView}>{this.renderButtons()}</View>
      </View>
    );
  }
}

export default IncomingVideoCallScreen;
