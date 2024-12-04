import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';

import { WEIGHT } from '../types';

const NAME = 'MI SCALE2'; // MIBFS Xiao Mi body composition scale 1
const DEVICE_NAME = 'Xiaomi Mi Body Composition Scale 2';
const KEY = 'mi_scale_2_weight';
const TYPE = WEIGHT; // Weight
const SERVICE_UUID = '0000181d-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a9d-0000-1000-8000-00805f9b34fb';

/**
 *
 * @param {*} bytes array of bytes
 * @returns tuple with weight in kg. unit and this data is stable or not.
 */
function readWeight(bytes) {
  // Notes
  // MI Scale 1 use org.bluetooth.characteristic.weight_measurement as spec
  // in first bytes contains
  // (bit0): units (0 => SI (kg.)) (1 => Imperial (pound.))
  // (bit1): has timestamp or not
  // (bit2): has user id or not
  // (bit3): has bmi and height or not
  // (bit4-7): reserved bit
  const unit = bytes[0] & (1 << 0) ? 'Imperial' : 'SI';
  let weight = 0;
  if (unit === 'SI') {
    weight = Number(((bytes[2] * 256 + bytes[1]) * 0.005).toFixed(2));
  } else {
    weight = Number((((bytes[2] * 256 + bytes[1]) * 0.01) / 2.2046).toFixed(2));
  }

  // I think MI SCALE use bit5 to tell this weight is stable or not.
  const valid = Boolean(bytes[0] & (1 << 5));
  return [weight, valid];
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
