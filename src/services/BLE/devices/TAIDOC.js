import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';
import { filter as filterRxjs, map as mapRxjs } from 'rxjs/operators';

import { OXYGEN_SATURATION } from '../types';

const NAME = 'TAIDOC TD8255';
const DEVICE_NAME = 'TAIDOC TD-8255 Fingertip Palse Oximeter';
const KEY = 'taidoc_td8255_spo2';
const TYPE = OXYGEN_SATURATION;
const SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb';
const SERVICE_UUID_2 = '00001523-1212-efde-1523-785feabcd123';
const CHARACTERISTIC_UUID = '00001524-1212-efde-1523-785feabcd123';

const chksum = (numbers: number[]) =>
  // eslint-disable-next-line no-bitwise
  numbers.reduce((acc, n) => acc + n, 0) & 0xff;

function monitor(device: Device) {
  const subject = new Subject();
  let intervalTimeoutId: NodeJS.Timer;

  const subscription = device.onDisconnected(() => {
    if (intervalTimeoutId != null) {
      clearInterval(intervalTimeoutId);
    }
    subscription.remove();
  });

  device
    .connect()
    .then((device) => device.discoverAllServicesAndCharacteristics())
    .then((device) => {
      const subscription = device.monitorCharacteristicForService(
        SERVICE_UUID_2,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            subject.error(error);
            subscription.remove();
            return;
          }

          if (characteristic == null) {
            return;
          }

          subject.next([...Buffer.from(characteristic.value, 'base64')]);
        },
      );
      return device;
    })
    .then((device) => {
      const data = [0x51, 0x49, 0x00, 0x00, 0x00, 0x00, 0xa3];
      intervalTimeoutId = setInterval(async () => {
        device.writeCharacteristicWithResponseForService(
          SERVICE_UUID_2,
          CHARACTERISTIC_UUID,
          Buffer.from([...data, chksum(data)]).toString('base64'),
        );
      }, 1000);
    });

  return subject.pipe(
    filterRxjs((data) => {
      return data[1] === 0x49 && data[2] !== 0;
    }),
    mapRxjs((data) => {
      return {
        name: NAME,
        type: TYPE,
        payload: {
          spo2: data[2],
        },
      };
    }),
  );
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
