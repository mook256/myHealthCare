import AsyncStorage from '@react-native-community/async-storage';

export const SET_DEVICES = 'BLE/SET_DEVICES';
export const SET_BLE_DEVICE = 'BLE/SET_DEVICE';
export const UNSET_BLE_DEVICE = 'BLE/UNSET_DEVICE';

/**
 *
 * @param {{[string]: string}} devices
 * @returns
 */
export const setDevices = (devices) => ({
  type: SET_DEVICES,
  payload: devices,
});

/**
 *
 * @param {string} deviceType
 * @param {{deviceId: string, name: string}} device
 * @returns
 */
export const setDevice = (deviceType, { id, name, device }) => ({
  type: SET_BLE_DEVICE,
  payload: {
    deviceType,
    id,
    name,
    device,
  },
});

/**
 *
 * @param {string} id
 */
export const unsetDevice = (deviceType) => ({
  type: UNSET_BLE_DEVICE,
  payload: deviceType,
});

export const saveBleDevices = (devices) => {
  return async (dispatch) => {
    dispatch(setDevices(devices));
    await AsyncStorage.setItem('bleDevices', JSON.stringify(devices));
  };
};

export const loadBleDevices = () => {
  return async (dispatch) => {
    const bleDeviceJSON = await AsyncStorage.getItem('bleDevices');
    const devices = JSON.parse(bleDeviceJSON);
    if (devices != null) {
      dispatch(setDevices(devices));
    }
  };
};
