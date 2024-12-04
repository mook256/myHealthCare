import { SET_DEVICES, SET_BLE_DEVICE, UNSET_BLE_DEVICE } from '../actions/ble';
import {
  BLOOD_PRESSURE,
  WEIGHT,
  TEMPURATURE,
  BLOOD_GLUCOSE,
  OXYGEN_SATURATION,
} from '../../services/BLE/types';

// v1
// availableDeviceTypes: {type: {id: string, name: string}}

// v2
// availableDeviceTypes:
// {type: {
//    id: string,  // id of real device
//    name: string, // name of real device
//    device: {
//      key: string (unique device key based on object)
//      setting: any  (any setting data for each device)
//    }
// }}
const initialState = {
  enable: true,
  availableDeviceTypes: {
    [BLOOD_PRESSURE]: null,
    [WEIGHT]: null,
    [TEMPURATURE]: null,
    [OXYGEN_SATURATION]: null,
    [BLOOD_GLUCOSE]: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DEVICES:
      return { ...state, availableDeviceTypes: action.payload };
    default:
      return state;
    case SET_BLE_DEVICE:
      const { deviceType, id, name, device } = action.payload;
      return {
        ...state,
        availableDeviceTypes: {
          ...state.availableDeviceTypes,
          [deviceType]: {
            id: id,
            name: name,
            device: device,
          },
        },
      };
    case UNSET_BLE_DEVICE:
      return {
        ...state,
        availableDeviceTypes: {
          ...state.availableDeviceTypes,
          [action.payload]: null,
        },
      };
  }
}
