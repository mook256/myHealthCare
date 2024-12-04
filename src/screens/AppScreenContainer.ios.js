import React, {PureComponent} from 'react';
import {AppState, Platform, Vibration} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import uuid from 'react-native-uuid';
import moment from 'moment';

import {incomingCall} from '../redux/actions/phonecall';
import Screen from './AppScreen';
import PushNotification from '../../services/PushNotification';
import {
  registerDevice,
  receivedMessage,
  fetchInstallation,
} from '../redux/actions/notification';
import {deviceNetworkConnectivityChange} from '../redux/actions/device';
import {fetchConversation} from '../redux/actions/conversation';

export class ScreenContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {appState: AppState.currentState};
    this.messageUnsubscription = null;

    this.netInfoSubscription = null;
    this.isNetConnected = true;
    this.onRegister = this.onRegister.bind(this);
    this.onNotification = this.onNotification.bind(this);
    this.onConnectivityChange = this.onConnectivityChange.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // Subscribe to network
    this.netInfoSubscription = NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.onConnectivityChange,
    );

    PushNotification.configure(this.onRegister, this.onNotification);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    if (this.eventEmitter) {
      this.eventEmitter.remove();
    }

    if (this.netInfoSubscription) {
      // Unsubscribe to network
      this.netInfoSubscription.remove();
    }
  }

  onRegister({token}) {
    const {dispatch} = this.props;
    dispatch(registerDevice(token));
  }

  onNotification(notification) {
    const {dispatch} = this.props;
    if (this.state.appState === 'active') {
      const DURATION = 500;
      Vibration.vibrate(DURATION);
    }
    dispatch(receivedMessage(notification));

    if (
      notification.data.route &&
      notification.data.route.name === 'telemedv2'
    ) {
      const {
        callId,
        participantName,
        channelName,
        timeout,
      } = notification.data.route.params;

      // Bypass timeout check if no timeout data
      if (timeout == null) {
        dispatch(
          incomingCall(uuid.v4(), {callId, participantName, channelName}),
        );
        return;
      }

      if (typeof timeout === 'number' && moment() < moment.unix(timeout)) {
        dispatch(
          incomingCall(uuid.v4(), {callId, participantName, channelName}),
        );
      }
    }
  }

  onConnectivityChange(isConnected) {
    if (isConnected !== this.isNetConnected) {
      const {dispatch} = this.props;
      dispatch(deviceNetworkConnectivityChange(isConnected));
      this.isNetConnected = isConnected;
    }
  }

  handleAppStateChange(nextAppState) {
    const {dispatch} = this.props;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      dispatch(fetchConversation());
      if (Platform.OS === 'ios') {
        dispatch(fetchInstallation());
      }
    }
    this.setState({appState: nextAppState});
  }

  render() {
    return <Screen />;
  }
}

export default connect(null, null)(ScreenContainer);
