/* eslint-disable */
import React, { Component } from 'react';
import { LogBox, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import Parse from 'parse/react-native';
import store from './redux/stores';
import AppScreen from './screens/AppScreenContainer';
import {
  PARSE_HOST,
  PARSE_APP_ID,
  PARSE_MASTER_KEY,
  PARSE_WS_HOST,
} from './utils/constants';
import RestartTimer from './RestartTimer';
import './i18n';

// setup parse server
Parse.initialize(PARSE_APP_ID);
Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = PARSE_HOST;
Parse.liveQueryServerURL = PARSE_WS_HOST;
Parse.masterKey = PARSE_MASTER_KEY;

RestartTimer.start();

LogBox.ignoreAllLogs(true);
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppScreen />
        <StatusBar hidden />
      </Provider>
    );
  }
}
