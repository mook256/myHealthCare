import Parse from 'parse/react-native';
import { decrementProgress, incrementProgress } from './progress';
import DeviceInfo from 'react-native-device-info';
import { SilverCareBearer } from '../../utils/constants';

export const staffLoginFailure = (error) => ({
  type: 'STAFF_LOGIN_FAILURE',
  error,
});

export const updateStaffInfo = (json) => ({
  type: 'UPDATE_LOGIN_INFO',
  json,
});

// Look up a user
export function staffLogin(citizenID) {
  return async (dispatch) => {
    try {
      // turn on spinner
      dispatch(incrementProgress());

      const DeviceObject = Parse.Object.extend('Device');
      const DeviceQuery = new Parse.Query(DeviceObject);

      DeviceQuery.equalTo('deviceId', DeviceInfo.getUniqueId());
      const Device = await DeviceQuery.first();
      const deviceKey = Device.get('deviceKey');

      const url = `https://silvercare.io/api/v1/domain/session/in`;
      const formData = new FormData();
      formData.append('citizen_id', citizenID);
      formData.append('tablet_id', deviceKey);

      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + SilverCareBearer,
        },
        body: formData,
      };

      const response = await fetch(url, options);
      const res = await response.json();

      dispatch(decrementProgress());

      return response;
    } catch (error) {
      dispatch(staffLoginFailure(error.message));
    }

    return dispatch(decrementProgress());
  };
}

export function getStaffInfo(citizenID) {
  return async (dispatch) => {
    try {
      // turn on spinner
      dispatch(incrementProgress());

      const UserObject = Parse.Object.extend('UserDetail');
      const UserQuery = new Parse.Query(UserObject);
      UserQuery.equalTo('idcard', citizenID);
      const UserDetail = await UserQuery.first();
      const staffDetail = UserDetail.get('user');

      const url = `https://silvercare.io/api/v1/domain/session/info?staff_citizen_id=${citizenID}`;

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + SilverCareBearer,
        },
      };

      const response = await fetch(url, options);
      const res = await response.json();

      if (response.ok && staffDetail) {
        dispatch(
          updateStaffInfo({
            citizen_id: res?.citizen_id,
            fullname: res?.fullname,
            is_logged_in: res?.is_logged_in,
            avatar: staffDetail?.avatar,
            fullname_en: staffDetail?.fullname_en,
            fullname_th: staffDetail?.fullname_th,
            username: staffDetail?.username,
          }),
        );
      }

      dispatch(decrementProgress());

      return response;
    } catch (error) {
      dispatch(staffLoginFailure(error.message));
    }

    return dispatch(decrementProgress());
  };
}
