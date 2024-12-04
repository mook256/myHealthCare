import { Device, BleErrorCode } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

import { readThermometer } from '../bufferUtils';
import { Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { TEMPURATURE } from '../types';

const NAME = 'FT95'; // FT95 beurer non-contact thermometer
const DEVICE_NAME = 'FT95 beurer non-contact thermometer';
const KEY = 'beurer_ft95_temp';
const TYPE = TEMPURATURE; // Temperature
const SERVICE_UUID = '00001809-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a1c-0000-1000-8000-00805f9b34fb';

function monitor(device: Device) {
  const subject = new Subject();

  device
    .connect({ autoConnect: true })
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
            payload: readThermometer(bytes),
          });
        },
      );
    });

  return subject.pipe(
    map((v) => {
      // due to bluetooth value in this device depend on unit, so it's should change it back to celcius
      if (v.payload?.unit === 'Fahrenheit') {
        const temp = v.payload?.temp || 32; // 0 celcius
        const newPayload = {
          ...v.payload,
          unit: 'Celcius',
          temp: Number((((temp - 32) * 5) / 9).toFixed(1)),
        };
        return { ...v, payload: newPayload };
      }
      return v;
    }),
    debounceTime(300),
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
