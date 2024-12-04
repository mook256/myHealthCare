/* eslint-disable */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
// import PropTypes from 'prop-types';
import Interactable from 'react-native-interactable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const widthFactor = Dimensions.get('window').width / 375;
const heightFactor = (Dimensions.get('window').height - 75) / 667;
const width_multi = 120;
const height_multiplier = 250;

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
// const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
// const END_POSITION = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
// const START_POSITION = STATUS_BAR_HEIGHT + 10;

const fullSnapPoints = [
  { x: -width_multi * widthFactor, y: 0 },
  { x: -width_multi * widthFactor, y: -width_multi * heightFactor },
  { x: -width_multi * widthFactor, y: width_multi * heightFactor },
  { x: -width_multi * widthFactor, y: -height_multiplier * heightFactor },
  { x: -width_multi * widthFactor, y: height_multiplier * heightFactor },
  { x: width_multi * widthFactor, y: 0 },
  { x: width_multi * widthFactor, y: width_multi * heightFactor },
  { x: width_multi * widthFactor, y: -width_multi * heightFactor },
  { x: width_multi * widthFactor, y: -height_multiplier * heightFactor },
  { x: width_multi * widthFactor, y: height_multiplier * heightFactor },
];

const padSnapPoints = [
  { x: -width_multi * widthFactor, y: 0 },
  { x: -width_multi * widthFactor, y: -width_multi * heightFactor },
  { x: -width_multi * widthFactor, y: width_multi * heightFactor },
  { x: -width_multi * widthFactor, y: -height_multiplier * heightFactor },
  // { x: -width_multi * widthFactor, y: height_multiplier * heightFactor },
  { x: width_multi * widthFactor, y: 0 },
  { x: width_multi * widthFactor, y: width_multi * heightFactor },
  { x: width_multi * widthFactor, y: -width_multi * heightFactor },
  { x: width_multi * widthFactor, y: -height_multiplier * heightFactor },
  // { x: width_multi * widthFactor, y: height_multiplier * heightFactor },
];

export default class VideoCall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snapPoints: [],
      renderVideo: false,
    };

    this._deltaX = new Animated.Value(0);
    this._deltaY = new Animated.Value(0);
    this.localViewContainer = new Animated.Value(1);
  }

  componentDidMount() {
    const { hidden } = this.props;
    if (hidden) {
      this.setState({ snapPoints: fullSnapPoints });
    } else {
      this.setState({ snapPoints: padSnapPoints });
    }
  }

  componentDidUpdate(prevProps) {
    const { hidden, peerIds } = this.props;
    if (prevProps.hidden !== hidden) {
      if (hidden) {
        this.setState({ snapPoints: fullSnapPoints });
      } else {
        this.setState({ snapPoints: padSnapPoints });
      }
    }
    if (prevProps.peerIds.length !== peerIds.length) {
      setTimeout(() => this.setState({ renderVideo: true }), 1000);
    }
  }

  absLocalView() {
    const { RtcLocalView, VideoRenderMode, channelName } = this.props;
    const { snapPoints } = this.state;
    return (
      <View style={localViewStyle.localView}>
        <RtcLocalView.SurfaceView
          style={{ flex: 1 }}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {this.renderVidMuteView()}
        {this.rendermicMuteView()}
      </View>
    );
  }

  staticLocalView() {
    const { RtcLocalView, VideoRenderMode, channelName } = this.props;
    const { renderVideo } = this.state;
    if (renderVideo && RtcLocalView) {
      return (
        <View style={{ flex: 1 }}>
          <RtcLocalView.SurfaceView
            style={{ flex: 1 }}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />
          {this.renderVidMuteView()}
          {this.rendermicMuteView()}
        </View>
      );
    }
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  renderVidMuteView() {
    const { isVidMute } = this.props;
    if (isVidMute) {
      return (
        <>
          <View style={localViewStyle.muteVideoIconContainer}>
            <MaterialIcons
              style={localViewStyle.muteIcon}
              size={35}
              name="videocam-off"
            />
            <Text style={localViewStyle.muteText}>Your camera is off</Text>
          </View>
        </>
      );
    }
    return null;
  }

  rendermicMuteView() {
    const { isMute } = this.props;
    if (isMute) {
      return (
        <View style={localViewStyle.muteAudioIconContainer}>
          <FontAwesome5
            style={localViewStyle.muteIcon}
            size={18}
            name="microphone-slash"
          />
        </View>
      );
    }
    return null;
  }

  remoteView() {
    const {
      peerIds,
      leaving,
      RtcLocalView,
      RtcRemoteView,
      VideoRenderMode,
      channelName,
    } = this.props;
    if (peerIds.length > 2) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <RtcRemoteView.SurfaceView
              style={{ flex: 1 }}
              uid={peerIds[1]}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
            {this.staticLocalView()}
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <RtcRemoteView.SurfaceView
              style={{ flex: 1 }}
              uid={peerIds[0]}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
            <RtcRemoteView.SurfaceView
              style={{ flex: 1 }}
              uid={peerIds[2]}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          </View>
        </View>
      );
    }
    if (peerIds.length > 1) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <RtcRemoteView.SurfaceView
              style={{ flex: 1 }}
              uid={peerIds[1]}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
            {this.staticLocalView()}
          </View>
          <RtcRemoteView.SurfaceView
            style={{ flex: 1 }}
            uid={peerIds[0]}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        </View>
      );
    }
    if (peerIds.length > 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.staticLocalView()}
          <RtcRemoteView.SurfaceView
            style={{ flex: 1 }}
            uid={peerIds[0]}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        </View>
      );
    }
    return (
      <View style={mainStyle.container}>
        <View style={remoteViewStyle.container}>
          <RtcLocalView.SurfaceView
            style={{ flex: 1 }}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />
        </View>
        <View style={mainStyle.absView}>
          <View style={mainStyle.centerView}>
            <ActivityIndicator animating size="large" color="#222222" />
            <Text numberOfLines={1} style={mainStyle.waitingText}>
              {leaving
                ? 'Participant is Leaving'
                : 'Waiting for Participant Connections...'}
            </Text>
          </View>
        </View>
      </View>
      // <View style={mainStyle.centerView}>
      //   //<ActivityIndicator animating size="large" color="#222222" />
      //   <Text numberOfLines={1} style={mainStyle.waitingText}>
      //     {leaving ? 'Participant is Leaving' : 'Waiting for Participant Connections...'}
      //   </Text>
      // </View>
    );
  }

  render() {
    const { toggleHidden } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => toggleHidden()}>
        <View style={mainStyle.container}>{this.remoteView()}</View>
      </TouchableWithoutFeedback>
    );
  }
}

const mainStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  absView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
  centerView: {
    flex: 1,
    // justifyContent: 'center',
    marginTop: 250,
    alignItems: 'center',
  },
  waitingText: {
    marginTop: 20,
    color: '#222222',
    fontSize: 16,
    fontFamily: 'NotoSansThaiUI-SemiBold',
  },
});

const remoteViewStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  remoteView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const localViewStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  localViewContainer: {
    width: 120,
    height: 170,
    borderRadius: 15,
    borderWidth: 0,
    // backgroundColor: '#222222',
    borderColor: '#dddddd',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  localView: {
    width: 180,
    height: 260,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 300,
    borderRadius: 15,
  },
  frame: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 200,
  },
  muteVideoIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  muteIcon: {
    color: '#fff',
    zIndex: 250,
  },
  muteText: {
    color: '#fff',
    fontFamily: 'NotoSansThaiUI-Regular',
    fontSize: 15,
  },
  muteAudioIconContainer: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 15,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 200,
  },
  // blurView: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   right: 0,
  //   zIndex: 150,
  // },
});

// VideoCall.propTypes = {
//   toggleHidden: PropTypes.any.isRequired,
//   AgoraView: PropTypes.any.isRequired,
//   leaving: PropTypes.any.isRequired,
//   peerIds: PropTypes.any.isRequired,
//   hidden: PropTypes.any.isRequired,
//   isVidMute: PropTypes.any.isRequired,
//   isMute: PropTypes.any.isRequired,
// };
