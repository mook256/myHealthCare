import RNPushNotification from 'react-native-push-notification';
import { GCM_ID } from '../utils/constants';
import { updateInstallation } from './ParseService';

export default class PushNotification {
  static configure(onRegister, onNotification) {
    RNPushNotification.configure({
      onRegister,
      onNotification,
      senderID: GCM_ID,
      popInitialNotification: true,
      vibration: 300,
      vibrate: true,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      requestPermissions: true,
    });
  }

  static setBadgeNumber(number) {
    return updateInstallation({ badge: number });
  }

  static getIconBadgeNumberIOS(callback) {
    return RNPushNotification.getApplicationIconBadgeNumber(callback);
  }
}
