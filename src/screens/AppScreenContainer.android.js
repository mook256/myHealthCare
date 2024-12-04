import React, { PureComponent } from 'react';
import { AppState, Platform } from 'react-native';

import { connect } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
// import NetInfo from '@react-native-community/netinfo';
import uuid from 'react-native-uuid';

import { incomingCall } from '../redux/actions/phonecall';
import Screen from './AppScreen';
import {
  registerDevice,
  receivedMessage,
  fetchInstallation,
} from '../redux/actions/notification';
import { deviceNetworkConnectivityChange } from '../redux/actions/device';
import { fetchConversation } from '../redux/actions/conversation';

export class ScreenContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { appState: AppState.currentState };
    this.messageUnsubscription = null;

    // this.netInfoSubscription = null;
    this.isNetConnected = true;
    this.onConnectivityChange = this.onConnectivityChange.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    AppState.addEventListener('change', this.handleAppStateChange);

    // Subscribe to network
    // this.netInfoSubscription = NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   this.onConnectivityChange,
    // );

    // set up phone call
    const token = await messaging().getToken();
    if (token) {
      dispatch(registerDevice(token));
    }

    this.messageUnsubscription = messaging().onMessage((remoteMessage) => {
      const { data } = remoteMessage.data;
      console.log('notification', data);
      if (data) {
        const dataObj = JSON.parse(data);
        dispatch(receivedMessage({ data: dataObj }));

        if (
          dataObj.type === 'VideoCall' &&
          typeof dataObj.channel === 'string'
        ) {
          // const { channel, callerName } = dataObj;
          const { channel, alert } = dataObj;
          // console.log(dataObj);
          dispatch(
            incomingCall(uuid.v4(), {
              channelName: channel,
              // participantName: callerName,
              participantName: alert?.body,
            }),
          );
        }
      }
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    if (this.eventEmitter) {
      this.eventEmitter.remove();
    }

    // if (this.netInfoSubscription) {
    //   // Unsubscribe to network
    //   this.netInfoSubscription.remove();
    // }
    // if (this.messageUnsubscription) {
    //   this.messageUnsubscription();
    // }
  }

  onConnectivityChange(isConnected) {
    if (isConnected !== this.isNetConnected) {
      const { dispatch } = this.props;
      dispatch(deviceNetworkConnectivityChange(isConnected));
      this.isNetConnected = isConnected;
    }
  }

  handleAppStateChange(nextAppState) {
    const { dispatch } = this.props;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // dispatch(fetchConversation());
      // if (Platform.OS === 'ios') {
      //   dispatch(fetchInstallation());
      // }
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    return <Screen />;
  }
}

export default connect(null, null)(ScreenContainer);
