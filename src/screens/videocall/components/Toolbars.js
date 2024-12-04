/* eslint-disable */
import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class Toolbars extends Component {
  render() {
    const {
      handleCancel,
      toggleMicrophone,
      isMute,
      switchCamera,
      isSwitch,
      toggleVideo,
      isVidMute,
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.moreBarContainer}>
            <View style={styles.moreBar} />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={
                isVidMute ? styles.iconContainerSlash : styles.iconContainer
              }
              onPress={() => toggleVideo()}
              activeOpacity={0.7}>
              <MaterialIcons
                style={isVidMute ? styles.iconSlash : styles.icon}
                size={24}
                name={isVidMute ? 'videocam-off' : 'videocam'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconEndcallContainer}
              onPress={() => handleCancel()}
              activeOpacity={0.7}>
              <MaterialIcons style={styles.icon} size={33} name="call-end" />
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={isSwitch ? styles.iconContainerSlash : styles.iconContainer}
              onPress={() => switchCamera()}
              activeOpacity={0.7}
            >
              <AntDesign
                style={isSwitch ? styles.iconSlash : styles.icon}
                size={24}
                name="retweet"
              />
            </TouchableOpacity> */}

            <TouchableOpacity
              style={isMute ? styles.iconContainerSlash : styles.iconContainer}
              onPress={() => toggleMicrophone()}
              activeOpacity={0.7}>
              <FontAwesome5
                style={isMute ? styles.iconSlash : styles.icon}
                size={24}
                name={isMute ? 'microphone-slash' : 'microphone'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(34,34,34,0.7)',
    height: (SCREEN_HEIGHT * 18) / 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  moreBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  moreBar: {
    width: 35,
    height: 6,
    backgroundColor: '#4C4C4C',
    borderRadius: 10,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 20 : 25,
  },
  // btn: {
  //   width: 60,
  //   height: 60,
  // },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#777777',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  iconContainerSlash: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  icon: {
    color: '#ffffff',
  },
  iconSlash: {
    color: '#000000',
  },
  iconEndcallContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#fe3a37',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
});

// Toolbars.propTypes = {
//   handleCancel: PropTypes.any.isRequired,
//   toggleMicrophone: PropTypes.any.isRequired,
//   isMute: PropTypes.any.isRequired,
//   switchCamera: PropTypes.any.isRequired,
//   isSwitch: PropTypes.any.isRequired,
//   toggleVideo: PropTypes.any.isRequired,
//   isVidMute: PropTypes.any.isRequired,
// };
