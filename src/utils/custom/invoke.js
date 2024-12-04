import { NativeModules, Platform } from 'react-native';

const { ReactNativeCustomInvoke } = NativeModules;

export { ReactNativeCustomInvoke };

export default (data = {}) => {
  if (Platform.OS === 'android') {
    ReactNativeCustomInvoke.invokeApp(typeof data !== 'object' ? {} : data);
  }
};
