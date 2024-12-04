import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import { NavigationActions } from 'react-navigation';
import RNRestart from 'react-native-restart';
import _ from 'lodash';
import { logUserIn } from './authentication';
import { CONFIG_URL } from '../../utils/constants';

import { loadBleDevices } from './ble';

export const SET_DEVICE_KEY = 'CONFIG/SET_DEVICE_KEY';
export const SET_CONFIG = 'CONFIG/SET_CONFIG';
export const SET_DEVICE_NAME = 'CONFIG/SET_DEVICE_NAME';
export const SET_USERS = 'CONFIG/SET_USERS';
export const SET_AUTH = 'CONFIG/SET_AUTH';
export const RESET_ERROR = 'CONFIG/RESET_ERROR';

export const FETCH_CONFIG_ATTEMPT = 'CONFIG/FETCH_CONFIG_ATTEMPT';
export const FETCH_CONFIG_SUCCESS = 'CONFIG/FETCH_CONFIG_SUCCESS';
export const FETCH_CONFIG_FAILURE = 'CONFIG/FETCH_CONFIG_FAILURE';

export const REGISTER_CONFIG_ATTEMPT = 'CONFIG/REGISTER_CONFIG_ATTEMPT';
export const REGISTER_CONFIG_SUCCESS = 'CONFIG/REGISTER_CONFIG_SUCCESS';
export const REGISTER_CONFIG_FAILURE = 'CONFIG/REGISTER_CONFIG_FAILURE';

export const setDeviceKey = (key) => ({
  type: SET_DEVICE_KEY,
  payload: key,
});

export const setConfig = (config) => ({
  type: SET_CONFIG,
  payload: config,
});

export const setAuth = (auth) => ({
  type: SET_AUTH,
  payload: auth,
});

export const setusers = (users) => ({
  type: SET_USERS,
  payload: users,
});

export const setDeviceName = (deviceName) => ({
  type: SET_DEVICE_NAME,
  payload: deviceName,
});

export const resetError = () => ({
  type: RESET_ERROR,
});

export const fetchConfigAttempt = () => ({ type: FETCH_CONFIG_ATTEMPT });
export const fetchConfigSuccess = (config) => ({
  type: FETCH_CONFIG_SUCCESS,
  payload: config,
});
export const fetchConfigFailure = (error) => ({
  type: FETCH_CONFIG_FAILURE,
  payload: error,
});

export const registerConfigAttempt = () => ({ type: REGISTER_CONFIG_ATTEMPT });
export const registerConfigSuccess = (config) => ({
  type: REGISTER_CONFIG_SUCCESS,
  payload: config,
});
export const registerConfigFailure = (error) => ({
  type: REGISTER_CONFIG_FAILURE,
  payload: error,
});

export const saveDeviceKey = (deviceKey) => {
  return async (dispatch) => {
    await AsyncStorage.setItem('deviceKey', deviceKey);
    dispatch(setDeviceKey(deviceKey));
  };
};

export const loadDeviceKey = () => {
  return async (dispatch) => {
    const deviceKey = await AsyncStorage.getItem('deviceKey');
    dispatch(setDeviceKey(deviceKey));
  };
};

export const removeDeviceKey = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem('deviceKey');
    dispatch(setDeviceKey(null));
  };
};

export const saveAuth = (auth) => {
  return async (dispatch) => {
    await AsyncStorage.setItem('deviceAuth', JSON.stringify(auth));
    dispatch(setAuth(auth));
  };
};

export const loadAuth = () => {
  return async (dispatch) => {
    const authJsonStr = await AsyncStorage.getItem('deviceAuth');
    dispatch(setAuth(JSON.parse(authJsonStr)));
  };
};

export const registerConfig = (deviceKey) => {
  return async (dispatch, getState) => {
    const deviceId = DeviceInfo.getUniqueId();

    try {
      dispatch(registerConfigAttempt());
      const response = await fetch(`${CONFIG_URL}/registerDevice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-key': deviceKey,
        },
        body: JSON.stringify({ deviceId }),
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      if (!response.ok) {
        return dispatch(registerConfigFailure(jsonResponse.message));
      }

      await dispatch(saveAuth(jsonResponse.auth));
      await dispatch(saveDeviceKey(deviceKey));
      dispatch(registerConfigSuccess());
      RNRestart.Restart();
    } catch (e) {
      dispatch(registerConfigFailure(e.message));
    }
  };
};

export const loadConfig = () => {
  return async (dispatch, getState) => {
    await dispatch(loadDeviceKey());
    const config = getState().config;
    const deviceId = DeviceInfo.getUniqueId();

    if (_.isEmpty(config.deviceKey)) {
      // No device Key
      return;
    }

    const appVersion = DeviceInfo.getVersion();

    try {
      dispatch(fetchConfigAttempt());
      const response = await fetch(`${CONFIG_URL}/getDeviceConfig`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-key': config.deviceKey,
        },
        body: JSON.stringify({ deviceId, appVersion }),
      });
      const jsonResponse = await response.json();
      if (!response.ok) {
        return dispatch(fetchConfigFailure(jsonResponse.message));
      }
      dispatch(fetchConfigSuccess(jsonResponse.payload));
    } catch (e) {
      dispatch(fetchConfigFailure(e.message));
    }
  };
};

export const loadSystem = () => {
  return async (dispatch, getState) => {
    await dispatch(loadConfig());
    await dispatch(loadAuth());
    const { auth, deviceKey } = getState().config;

    // if load success, try to login
    if (!_.isEmpty(auth)) {
      await dispatch(loadBleDevices());
      return dispatch(
        logUserIn({
          username: auth?.username,
          password: auth?.password,
        }),
      );
    }
    // if no device key, go to setting page
    if (_.isEmpty(deviceKey)) {
      return dispatch(NavigationActions.navigate({ routeName: 'KeyConfig' }));
    }
  };
};
