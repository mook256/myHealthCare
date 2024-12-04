import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject } from 'rxjs';

import { WEIGHT } from '../types';
import { take, tap, filter, map, finalize } from 'rxjs/operators';

const NAME = 'BF600'; // MIBFS Xiao Mi body composition scale
const DEVICE_NAME = 'Beurer BF600 Weighing machine';
const KEY = 'beurer_bf600_weight';
const TYPE = WEIGHT; // Weight
const SERVICE_UUID = '0000181d-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a9d-0000-1000-8000-00805f9b34fb';

async function waitfor(milliSeconds) {
  return new Promise((resolve, _) => {
    setTimeout(resolve, milliSeconds);
  });
}

function swapKV(obj) {
  const ret = {};
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key;
  });
  return ret;
}
function monitorService(
  device: Device,
  serviceUUID: String,
  characteristicUUID: string,
) {
  const subject = new Subject();
  const subscription = device.monitorCharacteristicForService(
    serviceUUID,
    characteristicUUID,
    (error, characteristic) => {
      if (error) {
        subscription.remove();
        throw new Error('Device Disconnect');
      }
      const values = [...Buffer.from(characteristic.value, 'base64')];
      subject.next(values);
    },
  );
  return subject.pipe(finalize(() => subject.unsubscribe()));
}

const userService = {
  SERVICE_UUID: '0000181c-0000-1000-8000-00805f9b34fb',
  CONTROL_POINT: {
    CHARACTERISTIC_UUID: '00002a9f-0000-1000-8000-00805f9b34fb',
    COMMANDS: {
      CREATE_USER: 0x01,
      CONSENT_USER: 0x02,
      DELETE_USER: 0x03,
    },
    RESPONSE: {
      HEADER_CODE: 0x20,
      SUCCESS: 0x01,
      OP_CODE_NOT_SUPPORT: 0x02,
      INVALID_PARAMETER: 0x03,
      OPERATION_FAILED: 0x04,
      NOT_AUTHORIZED: 0x05,
    },
  },
  monitorControlPoint(device: Device) {
    const subject = monitorService(
      device,
      userService.SERVICE_UUID,
      userService.CONTROL_POINT.CHARACTERISTIC_UUID,
    );

    return subject.pipe(
      tap((bytes) => {
        // debug only
        // if (bytes[0] === userService.CONTROL_POINT.RESPONSE.HEADER_CODE) {
        //   const commands = swapKV(userService.CONTROL_POINT.COMMANDS);
        //   const responses = swapKV(userService.CONTROL_POINT.RESPONSE);
        //   console.log('control', {
        //     command: commands[bytes[1]],
        //     response: responses[bytes[2]],
        //     raw: bytes,
        //   });
        // }
      }),
    );
  },
};

const currentTimeService = {
  SERVICE_UUID: '00001805-0000-1000-8000-00805f9b34fb',
  CURRENT_TIME_CHARACTERISTIC: '00002a2b-0000-1000-8000-00805f9b34fb',
};

const customService = {
  SERVICE_UUID: '0000fff0-0000-1000-8000-00805f9b34fb',
  SCALE_SETTING_CHARACTERISTIC_UUID: '0000fff1-0000-1000-8000-00805f9b34fb',
  TAKE_MEASUREMENT_CHARACTERISTIC_UUID: '0000fff4-0000-1000-8000-00805f9b34fb',
};

function readWeight(bytes) {
  return Number(((bytes[2] * 256 + bytes[1]) * 0.005).toFixed(2));
}

function createDeviceDateTimeBytes() {
  const d = new Date();
  const yearBytes = [d.getFullYear() % 256, (d.getFullYear() >> 8) % 256];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();
  return yearBytes.concat([month, day, hour, minute, second, 0x00, 0x00, 0x00]);
}

function register(device: Device) {
  const code = Math.floor(Math.random() * 10000) % 10000; //  random 4 digit code when to register when consent
  const codeBytes = [code % 256, (code >> 8) % 256];
  const subject = new Subject();

  device
    .connect()
    .then((device) => device.discoverAllServicesAndCharacteristics())
    .then(async (device) => {
      const controlPointSubject = userService.monitorControlPoint(device);
      controlPointSubject.subscribe(subject);

      try {
        // set date time
        const dt = createDeviceDateTimeBytes();
        const c2 = await device.writeCharacteristicWithResponseForService(
          currentTimeService.SERVICE_UUID,
          currentTimeService.CURRENT_TIME_CHARACTERISTIC,
          Buffer.from(dt).toString('base64'),
        );

        // await waitfor(500);

        // // set weight treshold
        const weightTreshold = Math.trunc(25.5 / 0.005);
        const weightBytes = [weightTreshold % 256, (weightTreshold >> 8) % 256];
        const c3 = await device.writeCharacteristicWithResponseForService(
          customService.SERVICE_UUID,
          customService.SCALE_SETTING_CHARACTERISTIC_UUID,
          Buffer.from([0xff, 0x00, 0xff, 0xff].concat(weightBytes)).toString(
            'base64',
          ),
        );
        // await waitfor(500);

        const c1 = await device.writeCharacteristicWithResponseForService(
          userService.SERVICE_UUID,
          userService.CONTROL_POINT.CHARACTERISTIC_UUID,
          Buffer.from(
            [userService.CONTROL_POINT.COMMANDS.CREATE_USER].concat(codeBytes),
          ).toString('base64'), // sent create user data
        );
      } catch (e) {
        subject.error(e);
      }
    });

  return subject.pipe(
    finalize(() => subject.unsubscribe()),
    filter((bytes) => {
      return (
        bytes[0] === userService.CONTROL_POINT.RESPONSE.HEADER_CODE &&
        bytes[1] === userService.CONTROL_POINT.COMMANDS.CREATE_USER
      );
    }),
    map((bytes) => {
      if (bytes[2] === userService.CONTROL_POINT.RESPONSE.SUCCESS) {
        // response value
        const userIndex = bytes[3]; // get user index
        return {
          userIndex: userIndex,
          consentCode: code.toString().padStart(4, '0'),
        };
      } else if (
        bytes[2] === userService.CONTROL_POINT.RESPONSE.OP_CODE_NOT_SUPPORT
      ) {
        throw new Error('OP code not support');
      } else if (
        bytes[2] === userService.CONTROL_POINT.RESPONSE.INVALID_PARAMETER
      ) {
        throw new Error('Invalid Parameter');
      } else if (
        bytes[2] === userService.CONTROL_POINT.RESPONSE.OPERATION_FAILED
      ) {
        throw new Error('Operation failed');
      }
    }),
    take(1),
  );
}

function monitor(device: Device, bleConfig: any) {
  const config = bleConfig[TYPE];
  const subject = new Subject();

  device
    .connect()
    .then((device) => device.discoverAllServicesAndCharacteristics())
    .then(async (device) => {
      const dataSubject = monitorService(
        device,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
      );
      dataSubject.subscribe(subject);

      const controlPointSubject = userService.monitorControlPoint(device);
      controlPointSubject.subscribe();

      // set date time
      const dt = createDeviceDateTimeBytes();
      const c2 = await device.writeCharacteristicWithResponseForService(
        currentTimeService.SERVICE_UUID,
        currentTimeService.CURRENT_TIME_CHARACTERISTIC,
        Buffer.from(dt).toString('base64'),
      );
      const userIndex = config.device.setting.userIndex;
      const code = parseInt(config.device.setting.consentCode, 10);
      const codeBytes = [code % 256, (code >> 8) % 256];

      await device.writeCharacteristicWithResponseForService(
        userService.SERVICE_UUID,
        userService.CONTROL_POINT.CHARACTERISTIC_UUID,
        Buffer.from(
          [userService.CONTROL_POINT.COMMANDS.CONSENT_USER].concat(
            [userIndex],
            codeBytes,
          ),
        ).toString('base64'),
      );
    });

  return subject.pipe(
    finalize(() => subject.unsubscribe()),
    map((bytes) => {
      return {
        name: NAME,
        type: TYPE,
        payload: {
          weight: readWeight(bytes),
        },
      };
    }),
    tap((data) => {
      // force disconnect due to device not sent data again if it still connect.
      device.cancelConnection();
    }),
  );
}

export default {
  name: NAME,
  deviceName: DEVICE_NAME,
  key: KEY,
  type: TYPE,
  serviceUUID: SERVICE_UUID,
  register: register,
  monitor: monitor,
};
