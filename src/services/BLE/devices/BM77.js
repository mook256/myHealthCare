import { Device, BleErrorCode } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';
import { take, filter as rxjsFilter } from 'rxjs/operators';

import { readDateTime } from '../bufferUtils';
import { BLOOD_PRESSURE } from '../types';

const NAME = 'BM77'; // beurer medical BM77 Sphygmomanometer
const DEVICE_NAME = 'Beurer medical BM77 Sphygmomanometer';
const KEY = 'beurer_bm77_bp';
const TYPE = BLOOD_PRESSURE; // Blood pressure
const SERVICE_UUID = '00001810-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a35-0000-1000-8000-00805f9b34fb';

function readSphygmomanometer(bytes) {
  return {
    sbp: bytes[1],
    dbp: bytes[3],
    hr: bytes[14],
    dateTime: readDateTime(bytes, 7),
    userId: bytes[16],
  };
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
            if (error.errorCode === BleErrorCode.DeviceDisconnected) {
              subject.complete();
            } else {
              subject.error(error);
            }
            subscription.remove();
            return;
          }
          const bytes = [...Buffer.from(characteristic.value, 'base64')];
          subject.next({
            name: NAME,
            type: TYPE,
            payload: readSphygmomanometer(bytes),
          });
        },
      );
    });

  // return subject.pipe(take(1));
  return subject.pipe(
    rxjsFilter((data) => data?.payload?.userId === 0),
    take(1),
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
