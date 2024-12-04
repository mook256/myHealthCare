/* eslint-disable */
import React, {Component} from 'react';
import {
  // NativeModules,
  Platform,
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addVideoCall, removeVideoCall} from '../../redux/actions/videocall';
import VideoCallScreen from './VideoCallScreen';

// const { Agora } = NativeModules;
// const { Host } = Agora;

class VideoCallScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allow: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    if (Platform.OS === 'android') {
      this.requestCameraAndAudioPermission().then((grant) => {
        if (grant) {
          this.setState({allow: true});
        } else {
          navigation.goBack();
        }
      });
    } else {
      this.setState({allow: true});
    }
  }

  requestCameraAndAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  render() {
    const {allow} = this.state;
    const {
      authentication,
      navigation,
      user,
      currentuser,
      addVideoCallFunc,
      removeVideoCallFunc,
    } = this.props;
    const channelName = navigation.getParam('channelName');
    const participant = navigation.getParam('participants');
    const callId = navigation.getParam('callId');
    const callUUID = navigation.getParam('callUUID');
    const callType = navigation.getParam('callType', 'incoming');
    const uid = navigation.getParam(
      'uid',
      Math.floor(Math.random() * 10000000),
    );
    const onCancel = navigation.getParam('onCancel', () => null);

    return allow ? (
      <VideoCallScreen
        user={user}
        currentuser={currentuser}
        authentication={authentication}
        navigation={navigation}
        channelProfile={1}
        channelName={channelName}
        callId={callId}
        // clientRole={Host}
        uid={uid}
        participant={participant}
        onCancel={onCancel}
        callType={callType}
        callUUID={callUUID}
        addVideoCall={addVideoCallFunc}
        removeVideoCall={removeVideoCallFunc}
      />
    ) : null;
  }
}
VideoCallScreenContainer.propTypes = {
  user: PropTypes.any.isRequired,
  addVideoCallFunc: PropTypes.func.isRequired,
  removeVideoCallFunc: PropTypes.func.isRequired,
  authentication: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.authentication,
  currentuser: state.currentuser,
  authentication: state.authentication,
});

const mapDispatchToProps = {
  addVideoCallFunc: addVideoCall,
  removeVideoCallFunc: removeVideoCall,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoCallScreenContainer);

// import React, { Component } from 'react';
// import {
//   NativeModules,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import { connect } from 'react-redux';
// class VideoCallScreenContainer extends Component {
//   render() {
//     return (
//       <VideoCallScreen />
//     );
//   }
// }

// const mapStateToProps = state => ({
// });

// const mapDispatchToProps = {
// };

// export default connect(mapStateToProps, mapDispatchToProps)(VideoCallScreenContainer);
