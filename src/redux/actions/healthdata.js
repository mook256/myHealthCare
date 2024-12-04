import isEmpty from 'lodash/isEmpty';
import DeviceInfo from 'react-native-device-info';

import { MHW_HOST, MHW_API_SERVICE_KEY } from '../../utils/constants';

export const SET_RECORD = 'HEALTH_DATA/SET_RECORD';
export const SAVE_RECORD_PROCESS = 'HEALTH_DATA/SAVE_RECORD_PROCESS';
export const SAVE_RECORD_SUCCESS = 'HEALTH_DATA/SAVE_RECORD_SUCCESS';
export const SAVE_RECORD_FAIL = 'HEALTH_DATA/SAVE_RECORD_FAIL';
export const CLEAR_RECORD = 'HEALTH_DATA/CLEAR_RECORD';

export const setHealthRecord = (payload) => (dispatch) => {
  if (!isEmpty(payload)) {
    dispatch({ type: SET_RECORD, payload });
  }
};

export const saveHealthRecordProcess = () => ({
  type: SAVE_RECORD_PROCESS,
});

export const saveHealthRecordSuccess = () => ({
  type: SAVE_RECORD_SUCCESS,
});

export const saveHealthRecordFail = () => ({
  type: SAVE_RECORD_FAIL,
});

export const clearHealthRecord = () => ({ type: CLEAR_RECORD });

export const saveHealthRecord = () => async (dispatch, getState) => {
  const { healthdata, currentuser, config } = getState();
  const { record } = healthdata;
  console.log('record', record);

  // not save data value if it's not number
  const validRecords = Object.entries(record).filter(([_, v]) => {
    return Number.isFinite(v);
  });

  const databaseMapper = {
    sbp: 'sbp1',
    dbp: 'dbp1',
    hr: 'hr1',
    weight: 'wei1',
    height: 'hei1',
    temp: 'temp',
    spo2: 'spo2',
    spo2before: 'spo2before',
    spo2after: 'spo2after',
    bgc: 'bgc',
    resp: 'resp1',
  };

  const formData = new FormData();
  formData.append('idcard', currentuser.idcard);
  formData.append('deviceKey', DeviceInfo.getUniqueId());
  formData.append('deviceName', config?.deviceName);

  let shouldUpload = false;
  validRecords.forEach(([type, value]) => {
    if (databaseMapper.hasOwnProperty(type)) {
      if (value !== 0) {
        shouldUpload = true;
        formData.append(databaseMapper[type], value);
      }
    }
  });

  if (!shouldUpload) {
    return {
      ok: false,
      reason: 'noData',
    };
  }

  try {
    dispatch(saveHealthRecordProcess());
    const response = await fetch(`${MHW_HOST}/service/rtclinic/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-api-key': MHW_API_SERVICE_KEY,
        'partner-key': '7fhegkkgjfjdcgr3724',
      },
      body: formData,
    });

    // console.log(response);
    // console.log('response', response.body);

    if (!response.ok) {
      dispatch(saveHealthRecordFail());
      return {
        ok: false,
        reason: 'invalidData',
      };
    }
    dispatch(saveHealthRecordSuccess());
    return {
      ok: true,
      record: record,
    };
  } catch (e) {
    dispatch(saveHealthRecordFail());
    return {
      ok: false,
      reason: 'noInternet',
    };
  }
};
