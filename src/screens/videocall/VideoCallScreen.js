/* eslint-disable */
import React, { Component } from 'react';
import { View, Dimensions, Platform, Text } from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

// import PropTypes from 'prop-types';
import KeepAwake from 'react-native-keep-awake';
// import RNRestart from 'react-native-restart';
import RNCallKeep from 'react-native-callkeep';
import {
  AGORA_APP_ID,
  VIDEO_CALL_URL_V2,
  VIDEO_CALL_API_KEY_V2,
} from '../../utils/constants';
import Drawer from './components/Drawer';
import Toolbars from './components/Toolbars';
import AddPeople from './components/AddPeople';
import VideoCall from './components/VideoCall';

// 85% of window height
const maxDrawerHeight = (Dimensions.get('window').height * 15) / 100;

const dialSoundPath =
  Platform.OS === 'ios'
    ? `${RNFS.MainBundlePath}/dial.mp3`
    : '/assets/sounds/dial.mp3';

export default class VideoCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerIds: [],
      userJoined: false,
      joinSucceed: false,
      isMute: false,
      isSwitch: false,
      isVidMute: false,
      hidden: false,
      leaving: false,
      drawerStatus: 'down',
      uid: null,
      channelName: null,
      isRecord: false,
    };
  }

  async componentDidMount() {
    const { navigation, addVideoCall, callType, rehpid } = this.props;
    KeepAwake.activate();
    this._engine = await RtcEngine.create(AGORA_APP_ID);
    await this._engine.enableVideo();
    this._engine.addListener('UserJoined', async (uid, elapsed) => {
      const { peerIds, userJoined } = this.state;

      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          peerIds: [...peerIds, uid],
        });
      }

      if (callType == 'outgoing' && !userJoined) {
        // garantee stop audio mixin once
        await this._engine.stopAudioMixing();
      }
      this.setState({ userJoined: true });
    });
    this._engine.addListener('UserOffline', (uid, reason) => {
      const { peerIds } = this.state;
      this.setState({
        peerIds: peerIds.filter((id) => id !== uid),
        leaving: true,
      });
      navigation.goBack();
    });
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      this.setState({
        joinSucceed: true,
      });
    });
    if (callType == 'outgoing') {
      await this._engine.startAudioMixing(dialSoundPath, true, false, -1);
    }

    if (Platform.OS === 'ios') {
      RNCallKeep.addEventListener('endCall', this.onEndCallAction);
    }
    this.startCall().then((uid) => {
      if (uid != null) {
        addVideoCall(uid, {});
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.navigation.isFocused();
  }

  async componentWillUnmount() {
    const { callUUID, removeVideoCall, navigation } = this.props;
    const { joinSucceed, uid } = this.state;
    KeepAwake.deactivate();
    if (joinSucceed) {
      await this._engine?.leaveChannel();
      await this._engine?.destroy();
    } else {
      await this._engine?.destroy();
    }

    if (uid != null) {
      removeVideoCall(uid);
    }
    if (Platform.OS === 'ios') {
      RNCallKeep.removeEventListener('endCall', this.onEndCallAction);
      RNCallKeep.endCall(callUUID);
    }

    this.handleCancel();
    // this.toggleHidden();
    // RNRestart.Restart();
  }

  startCall = async () => {
    const { participant, callType, channelName, currentuser } = this.props;
    let requestResult = undefined;
    let uid = undefined;
    let chan = channelName ?? undefined;
    let token = undefined;
    let callerName = `${currentuser?.firstname ?? ''} ${
      currentuser?.surname ?? ''
    }`.trim();

    // note: Incoming call has callId but outgoing call doesn't have callId
    if (callType === 'outgoing') {
      requestResult = await this.requestCall(
        participant.userid,
        callerName.length > 0 ? callerName : '',
      );
      if (requestResult == null) {
        return;
      }
      chan = requestResult.objectId;
    }

    requestResult = await this.joinCall(chan);
    if (requestResult == null) {
      return;
    }
    uid = requestResult.uid;
    token = requestResult.token;
    this.setState({
      uid: uid,
      channelName: chan,
    });

    await this._engine?.joinChannel(token, chan, null, uid);
    await this._engine?.enableAudioVolumeIndication(500, 3, true);

    return uid;
  };

  requestCall = async (userid, callerName) => {
    // console.log('request call');
    const { authentication } = this.props;
    try {
      let body = { userId: userid, callerName };
      const response = await fetch(`${VIDEO_CALL_URL_V2}/createDirectSession`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: authentication.token,
          'X-Api-Key': VIDEO_CALL_API_KEY_V2,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const json = await response.json();
        // console.log(json);
        return json;
      }
      // console.log('error', response.status);
      return null;
    } catch (e) {
      return null;
    }
  };

  joinCall = async (channelName) => {
    const { authentication } = this.props;
    try {
      const response = await fetch(
        `${VIDEO_CALL_URL_V2}/${channelName}/requestToken`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-Api-Key': VIDEO_CALL_API_KEY_V2,
            Authorization: authentication.token,
          },
        },
      );

      if (response.ok) {
        const json = await response.json();
        return json;
      }
      // console.log('error', await response.json());
      return null;
    } catch (e) {
      return null;
    }
  };

  onEndCallAction = (data) => {
    const { navigation, callUUID } = this.props;
    if (data.callUUID === callUUID) {
      navigation.goBack();
    }
  };

  handleCancel = async () => {
    const { navigation } = this.props;
    await this._engine?.leaveChannel();
    this.setState({ joinSucceed: false }, () => {
      navigation.goBack();
    });
  };

  toggleHidden = () => {
    const { peerIds, hidden, drawerStatus } = this.state;
    if (peerIds.length > 0 && drawerStatus === 'down') {
      this.setState({ hidden: !hidden });
    }
  };

  switchCamera = async () => {
    const { isSwitch } = this.state;
    await this._engine?.switchCamera();
    this.setState({ isSwitch: !isSwitch });
  };

  toggleMicrophone = async () => {
    const { isMute } = this.state;
    await this._engine?.muteLocalAudioStream(!isMute);
    this.setState({ isMute: !isMute });
  };

  toggleVideo = async () => {
    const { isVidMute } = this.state;
    await this._engine?.muteLocalVideoStream(!isVidMute);
    this.setState({ isVidMute: !isVidMute });
  };

  detectDrawerStatus = (drawerStatus) => {
    this.setState({ drawerStatus });
  };

  render() {
    const {
      peerIds,
      leaving,
      hidden,
      isMute,
      isSwitch,
      isVidMute,
      channelName,
    } = this.state;

    return (
      <Drawer
        finalDrawerHeight={maxDrawerHeight}
        hidden={hidden}
        detectDrawerStatus={this.detectDrawerStatus}
        peerIds={peerIds}
        renderContainerView={() => (
          <VideoCall
            peerIds={peerIds}
            leaving={leaving}
            hidden={hidden}
            // AgoraView={AgoraView}
            RtcLocalView={RtcLocalView}
            RtcRemoteView={RtcRemoteView}
            VideoRenderMode={VideoRenderMode}
            channelName={channelName}
            isMute={isMute}
            isVidMute={isVidMute}
            toggleHidden={this.toggleHidden}
          />
        )}
        renderDrawerView={null}
        renderInitDrawerView={() => (
          <View>
            <Toolbars
              handleCancel={this.handleCancel}
              toggleMicrophone={this.toggleMicrophone}
              isMute={isMute}
              switchCamera={this.switchCamera}
              isSwitch={isSwitch}
              toggleVideo={this.toggleVideo}
              isVidMute={isVidMute}
            />
          </View>
        )}
      />
    );
  }
}
