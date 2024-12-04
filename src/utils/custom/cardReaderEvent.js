import { NativeModules, NativeEventEmitter } from 'react-native';

NativeModules.RNCardReader.connect();

export const CARD_STATUS = {
  IDLE: 'IDLE',
  READER_DETECTED: 'READER_DETECTED',
  CARD_DETECTED: 'CARD_DETECTED',
};

export default new NativeEventEmitter(NativeModules.RNCardReader);
