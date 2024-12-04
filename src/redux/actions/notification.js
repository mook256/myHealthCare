import { Platform } from 'react-native';
import Parse from 'parse/react-native';
import PushNotification from '../../services/PushNotification';
import { installation, currentInstallation } from '../../services/ParseService';

export const notificationDeviceRegisteredSuccess = json => ({
  type: 'NOTIFICATION_DEVICE_REGISTERED_SUCCESS',
  json,
});
export const notificationDeviceRegisteredFailure = error => ({
  type: 'NOTIFICATION_DEVICE_REGISTERED_FAILURE',
  error,
});

export const notificationsInstallationFetchSuccess = json => ({
  type: 'NOTIFICATION_INSTALLATION_FETCH_SUCCESS',
  json,
});
export const notificationInstallationFetchFailure = error => ({
  type: 'NOTIFICATION_INSTALLATION_FETCH_FAILURE',
  error,
});

export const notificationBadgeResetPending = () => ({
  type: 'NOTIFICATION_BADGE_RESET_PENDING',
});
export const notificationBadgeResetSuccess = () => ({
  type: 'NOTIFICATION_BADGE_RESET_SUCCESS',
});
export const notificationBadgeResetFailure = error => ({
  type: 'NOTIFICATION_BADGE_RESET_FAILURE',
  error,
});

export const notificationReceived = json => ({
  type: 'NOTIFICATION_RECEIVED',
  json,
});

export const notificationPending = () => ({
  type: 'NOTIFICATION_PENDING',
});
export const notificationFetchSuccess = json => ({ type: 'NOTIFICATION_FETCH_SUCCESS', json });
export const notificationFetchFailure = error => ({
  type: 'NOTIFICATION_FETCH_FAILURE',
  error,
});

export function registerDevice(token) {
  return async (dispatch) => {
    try {
      const installate = await installation(token);
      const installateToJSON = installate.toJSON();
      // console.log("registerDevice",installateToJSON);
      dispatch(notificationDeviceRegisteredSuccess(installateToJSON));
    } catch (error) {
      // console.log("registerDevice e: ",error);
      dispatch(notificationDeviceRegisteredFailure(error.message));
    }
  };
}

export function fetchInstallation() {
  return async (dispatch, getState) => {
    const { isRegisteredDevice } = getState().device;
    // console.log("fetchInstallation: ",isRegisteredDevice);
    if (isRegisteredDevice) {
      try {
        const installate = await currentInstallation();
        const installateToJSON = installate.toJSON();
        // console.log(installateToJSON);
        dispatch(notificationsInstallationFetchSuccess(installateToJSON));
      } catch (error) {
        // console.log(error);
        dispatch(notificationInstallationFetchFailure(error.message));
      }
    }
  };
}

export function receivedMessage(notification) {
  return async (dispatch, getState) => {
    const { data } = notification;
    // TODO recevice category chat
    if (data.type === 'Chat') {
      return undefined;
    }

    const currentUser = await Parse.User.currentAsync();
    const object = Parse.Object.extend('Inbox');
    const query = new Parse.Query(object);
    query.containedIn('to', [currentUser.get('userid'), 'all']);
    query.descending('createdAt');
    const result = await query.first().catch(() => null);
    let newItem = null;
    if (result) {
      const { items } = getState().notification;
      const newResult = result.toJSON();
      const validNewItem = items.some(o => o.objectId === newResult.objectId);
      if (!validNewItem) {
        newItem = newResult;
      }
    }

    // TODO handle error data empty
    if (!newItem) {
      return undefined;
    }

    if (Platform.OS === 'ios') {
      const { badge } = notification;
      return dispatch(notificationReceived({ badge, data: newItem }));
    }

    return dispatch(notificationReceived({ badge: data.badge, data: newItem }));
  };
}

export function resetBadgeNumber() {
  return async (dispatch, getState) => {
    dispatch(notificationBadgeResetPending());
    const { isRegisteredDevice } = getState().device;
    if (isRegisteredDevice) {
      try {
        await PushNotification.setBadgeNumber(0);
        dispatch(notificationBadgeResetSuccess());
      } catch (error) {
        dispatch(notificationBadgeResetFailure(new Error(error)));
      }
    }
  };
}

export function fetchNotification() {
  return async (dispatch) => {
    try {
      dispatch(notificationPending());

      const currentUser = await Parse.User.currentAsync();
      const object = Parse.Object.extend('Inbox');
      const query = new Parse.Query(object);
      query.containedIn('to', [currentUser.get('userid'), 'all']);
      query.descending('createdAt');
      query.limit(100);
      const result = await query.find();
      const newResult = result.map(o => o.toJSON());

      return dispatch(notificationFetchSuccess(newResult));
    } catch (error) {
      return dispatch(notificationFetchFailure(error));
    }
  };
}
