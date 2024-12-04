import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';

import { TEMPURATURE } from '../types';

const NAME = 'Kinsa'; // Kinsa Smart Ear Digital Thermometer
const DEVICE_NAME = 'Kinsa Smart Ear Digital Thermometer';
const KEY = 'kinsa_smartear_temp';
const TYPE = TEMPURATURE; // Temperature
const SERVICE_UUID = '00000000-0068-746c-6165-4861736e694b';
const CHARACTERISTIC_UUID = '00000002-0068-746c-6165-4861736e694b';

function readKinsaThermometer(bytes) {
  if (bytes[0] & 0x60) {
    return (bytes[2] * 256 + bytes[3]) / 100;
  }
  return null;
}

function monitor(device: Device) {
  const subject = new Subject();

  device
    .connect()
    .then((device) => device.discoverAllServicesAndCharacteristics())
    .then((device) => {
      const subscription = device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            subject.error(error);
            subscription.remove();
            return;
          }
          const bytes = [...Buffer.from(characteristic.value, 'base64')];
          const temp = readKinsaThermometer(bytes);
          if (!Number.isNaN(temp)) {
            subject.next({
              name: NAME,
              type: TYPE,
              payload: {
                temp: temp,
              },
            });
          }
        },
      );
    });

  return subject;
}

export default {
  name: NAME,
  deviceName: DEVICE_NAME,
  key: KEY,
  type: TYPE,
  serviceUUID: SERVICE_UUID,
  register: undefined,
  monitor: monitor,
};
