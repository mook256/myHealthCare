import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';
import { mergeMap, bufferCount, tap, last, map } from 'rxjs/operators';

import { OXYGEN_SATURATION } from '../types';

const NAME = 'PO60'; // beurer PO60 pulse oxymeter
const DEVICE_NAME = 'beurer PO60 pulse oxymeter';
const KEY = 'beurer_p60_spo2';
const TYPE = OXYGEN_SATURATION; // blood Oxygen
const SERVICE_UUID = '0000ff12-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000ff02-0000-1000-8000-00805f9b34fb';

const WRITE_CHARCTERIS_UUID = '0000ff01-0000-1000-8000-00805f9b34fb';

const READ_VALUE_BUFFER = Buffer.from([-103, 0, 25]).toString('base64');
const READ_NEXT_INDEX_BUFFER = Buffer.from([-103, 1, 26]).toString('base64');

function getCurrentDateTimeBuffer() {
  const dateObj = new Date();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear() - 2000;
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const checkSum = year + 131 + month + day + hour + minute + 15;
  const penultimateByte = checkSum & 127;
  return Buffer.from([
    -125,
    year,
    month,
    day,
    hour,
    minute,
    5,
    5,
    5,
    penultimateByte,
  ]).toString('base64');
}

function readDate(buffer, offset) {
  if (offset + 6 > buffer.length) {
    return null;
  }
  const year = buffer[offset] + 2000;
  const month = buffer[offset + 1];
  const day = buffer[offset + 2];
  const hour = buffer[offset + 3];
  const minute = buffer[offset + 4];
  const second = buffer[offset + 5];

  return new Date(year, month, day, hour, minute, second);
}

function monitor(device: Device) {
  const subject = new Subject();

  device
    .connect({
      requestMTU: 23,
    })
    .then((device) => device.discoverAllServicesAndCharacteristics())
    .then((device) => {
      let status = 'readDate';
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

          if (status === 'readDate' && bytes[0] == 243 && bytes[1] == 0) {
            status = 'readData';
            device.writeCharacteristicWithResponseForService(
              SERVICE_UUID,
              WRITE_CHARCTERIS_UUID,
              READ_VALUE_BUFFER,
            );
            return;
          }
          subject.next(bytes); // send encode data (decoding code below)
        },
      );

      device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        WRITE_CHARCTERIS_UUID,
        getCurrentDateTimeBuffer(),
      );
    });

  return subject.pipe(
    mergeMap((x) => x), // make array to stream to seq
    bufferCount(24), // header ('e9') (1) + data (23)
    tap((b) => {
      // check for create side effect
      if (b[1] & 0x40) {
        // if has finish signal, complete it
        subject.complete();
        return;
      }
      if (b[1] % 10 === 9) {
        // if it's last index request new
        device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          WRITE_CHARCTERIS_UUID,
          READ_NEXT_INDEX_BUFFER,
        );
      }
    }),
    // change to readable data
    map((b) => {
      return {
        name: NAME,
        type: TYPE,
        payload: {
          spo2: b[17], // max value , b[18]: min value, b[19]: avg value
          // hr: b[22],
          dateTime: readDate(b, 2),
        },
      };
    }),
    last(),
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
