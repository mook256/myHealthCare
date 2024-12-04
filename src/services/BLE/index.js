import FT95 from './devices/FT95';
import Kinsa from './devices/Kinsa';
import BM77 from './devices/BM77';
import BM57 from './devices/BM57';
import MIBFS from './devices/MIBFS';
import PO60 from './devices/PO60';
import AccuChek from './devices/AccuChek';
import AccuChekIntant from './devices/AccuChekInstant';
import MI1 from './devices/MI1';
import TAIDOC from './devices/TAIDOC';

import { Device } from 'react-native-ble-plx';
import HEM7361T from './devices/HEM7361T';
import BF600 from './devices/BF600';

export const DEVICES = [
  FT95,
  Kinsa,
  BM77,
  BM57,
  MIBFS,
  PO60,
  AccuChek,
  AccuChekIntant,
  MI1,
  TAIDOC,
  HEM7361T,
  BF600,
];

export const DEVICES_BY_UUIDS = DEVICES.reduce((acc, device) => {
  if (acc.hasOwnProperty(device.serviceUUID)) {
    const newArr = acc[device.serviceUUID];
    return { ...acc, [device.serviceUUID]: [...newArr, device] };
  }
  return { ...acc, [device.serviceUUID]: [device] };
}, {});

export const AVAILABLE_SERVICE_UUIDS = DEVICES.map(
  (device) => device.serviceUUID,
).reduce((list, uuid) => {
  // remove duplicated serviceUUIDs
  if (list.indexOf(uuid) === -1) {
    return [...list, uuid];
  }
  return list;
}, []);

/**
 *
 * @param {Device} device
 * @returns device wrapper
 *
 * get device wrapper for monitor based on proirity
 * 1) device key in bleConfig
 * 2) device name
 * 3) default wrapper (usally first device on service)
 *
 */
export function getDeviceMonitorInstance(device: Device, bleConfig) {
  // v2 is check by device key
  const deviceConfig = Object.values(bleConfig).find(
    (d) => d?.id === device.id,
  );
  if (deviceConfig?.device?.key) {
    const deviceWrapperByKey = DEVICES.find(
      (d) => d.key === deviceConfig?.device?.key,
    );
    if (deviceWrapperByKey) {
      return deviceWrapperByKey;
    }
  }

  // backward to v1
  const deviceWrapperEntry = Object.entries(
    DEVICES_BY_UUIDS,
  ).find(([uuid, _]) => device.serviceUUIDs.includes(uuid));
  const deviceWrapperList = deviceWrapperEntry?.[1];
  const defaultDeviceWrapper = deviceWrapperList?.[0];

  const deviceWrapper = deviceWrapperList.find((d) => {
    return d.name === device.name;
  });
  return deviceWrapper ?? defaultDeviceWrapper;
}
