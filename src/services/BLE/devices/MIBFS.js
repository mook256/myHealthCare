import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';

import { WEIGHT } from '../types';

const NAME = 'MIBFS'; // MIBFS Xiao Mi body composition scale
const DEVICE_NAME = 'Xiaomi Mi Body Composition Scale';
const KEY = 'mi_scale_weight';
const TYPE = WEIGHT; // Weight
const SERVICE_UUID = '0000181b-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a9c-0000-1000-8000-00805f9b34fb';

function readWeight(bytes) {
  return [
    Number(((bytes[12] * 256 + bytes[11]) * 0.005).toFixed(2)),
    bytes[10],
  ];
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
          const [weight, isValid] = readWeight(bytes);
          if (isValid) {
            // valid value is 255
            subject.next({
              name: NAME,
              type: TYPE,
              payload: {
                weight: weight,
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
