import { getGeolocation } from '../../services/geolocation';
import deviceInfo from 'react-native-device-info';
import { MHC_SOS_URL, MHW_API_SERVICE_KEY } from '../../utils/constants';

export const SOS_SENDING = 'SOS/SENDING';
export const SOS_SEND_SUCCESS = 'SOS/SEND_SUCCESS';
export const SOS_SEND_FAILURE = 'SOS/SEND_FAILURE';
export const SOS_CLEAR = 'SOS/CLEAR';

const loading = () => ({ type: SOS_SENDING });
const sendSuccess = () => ({ type: SOS_SEND_SUCCESS });
const sendFailure = (error) => ({ type: SOS_SEND_FAILURE, error });
export const sendSOSClear = () => ({ type: SOS_CLEAR });

export function sendSOS() {
  return async (dispatch, getState) => {
    const { config } = getState();
    const { deviceName } = config;
    dispatch(loading());
    try {
      const location = await getGeolocation();
      const phoneNumber = await deviceInfo.getPhoneNumber();
      const latitude = location?.coords?.latitude;
      const longitude = location?.coords?.longitude;
      const formData = new FormData();
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('devicename', deviceName);
      formData.append('devicekey', deviceInfo.getUniqueId());
      if (phoneNumber?.length > 0) {
        formData.append('phone', phoneNumber);
      }
      const response = await fetch(MHC_SOS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-api-key': MHW_API_SERVICE_KEY,
          'partner-key': '7fhegkkgjfjdcgr3724',
        },
        body: formData,
      });
      dispatch(sendSuccess());
      if (response.ok) {
        dispatch(sendSuccess());
      } else {
        dispatch(sendFailure(new Error('sending fail')));
      }
    } catch (e) {
      dispatch(sendFailure(e));
    }
  };
}
