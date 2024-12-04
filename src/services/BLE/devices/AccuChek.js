import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Subject, combineLatest } from 'rxjs';
import { BLOOD_GLUCOSE } from '../types';
import Big from 'big.js/big';

import {
  buffer as rxjsBuffer,
  map as rxjsMap,
  take,
  concatAll,
} from 'rxjs/operators';

import { readSFloat } from '../bufferUtils';

const NAME = 'glocose'; // Accu chek
const DEVICE_NAME = 'Accu-Chek Guide';
const KEY = 'accuchek_guide_bgc';
const TYPE = BLOOD_GLUCOSE; // Temperature
const SERVICE_UUID = '00001808-0000-1000-8000-00805f9b34fb';

const CHARACTERISTIC_UUID = {
  MEASUREMENT: '00002A18-0000-1000-8000-00805f9b34fb',
  MEASUREMENT_CONTEXT: '00002A34-0000-1000-8000-00805f9b34fb',
  FEATURE: '00002A51-0000-1000-8000-00805f9b34fb',
  RECORD_ACCESS_CONTROL: '00002A52-0000-1000-8000-00805f9b34fb',
};

const OP_CODE = {
  REPORT_STORED_RECORDS: 1,
  DELETE_STORED_RECORDS: 2,
  ABORT_OPERATION: 3,
  REPORT_NUMBER_OF_RECORDS: 4,
  NUMBER_OF_STORED_RECORDS_RESPONSE: 5,
  RESPONSE_CODE: 6,
};

// for debug
const OP_CODE_TEXT = {
  [OP_CODE.REPORT_STORED_RECORDS]: 'report stored records',
  [OP_CODE.DELETE_STORED_RECORDS]: 'delete stored records',
  [OP_CODE.ABORT_OPERATION]: 'abort operation',
  [OP_CODE.REPORT_NUMBER_OF_RECORDS]: 'report number of records',
  [OP_CODE.NUMBER_OF_STORED_RECORDS_RESPONSE]:
    'number of stored record response',
  [OP_CODE.RESPONSE_CODE]: 'response code',
};

const OPERATOR = {
  NULL: 0,
  ALL_RECORDS: 1,
  LESS_THAN_OR_EQUAL: 2,
  GREATER_THAN_OR_EQUAL: 3,
  WITHING_RANGE: 4,
  FIRST_RECORD: 5,
  LAST_RECORD: 6,
};

// for debug
const OPERATOR_TEXT = {
  [OPERATOR.NULL]: 'null',
  [OPERATOR.ALL_RECORDS]: 'all records',
  [OPERATOR.LESS_THAN_OR_EQUAL]: 'less than or equal',
  [OPERATOR.GREATER_THAN_OR_EQUAL]: 'greater than or equal',
  [OPERATOR.WITHING_RANGE]: 'withing range',
  [OPERATOR.FIRST_RECORD]: 'first record',
  [OPERATOR.LAST_RECORD]: 'last record',
};

/**
 * The filter type is used for range operators ({@link #OPERATOR_LESS_THEN_OR_EQUAL},
 * {@link #OPERATOR_GREATER_THEN_OR_EQUAL}, {@link #OPERATOR_WITHING_RANGE}.<br/>
 * The syntax of the operand is: [Filter Type][Minimum][Maximum].<br/>
 */

/**
 * Info:
 * Operators OPERATOR_LESS_THEN_OR_EQUAL and OPERATOR_RANGE are not supported by
 * Nordic Semiconductor Glucose Service in SDK 4.4.2.
 */

/**
 * The filter type is used for range operators ({@link #OPERATOR_LESS_THEN_OR_EQUAL},
 * {@link #OPERATOR_GREATER_THEN_OR_EQUAL}, {@link #OPERATOR_WITHING_RANGE}.<br/>
 * The syntax of the operand is: [Filter Type][Minimum][Maximum].<br/>
 * This filter selects the records by the sequence number.
 */

/**
 * The filter type is used for range operators ({@link #OPERATOR_LESS_THEN_OR_EQUAL},
 * {@link #OPERATOR_GREATER_THEN_OR_EQUAL}, {@link #OPERATOR_WITHING_RANGE}.<br/>
 * The syntax of the operand is: [Filter Type][Minimum][Maximum].<br/>
 * This filter selects the records by the user facing time (base time + offset time).
 */

const FILTER_TYPE = {
  SEQUENCE_NUMBER: 1,
  USER_FACING_TIME: 2,
};

const RESPONSE = {
  SUCCESS: 1,
  OP_CODE_NOT_SUPPORT: 2,
  INVALID_OPERATOR: 3,
  OPERATOR_NOT_SUPPORTED: 4,
  INVALID_OPERAND: 5,
  NO_RECORDS_FOUND: 6,
  ABORT_UNSUCCESSFUL: 7,
  PROCEDURE_NOT_COMPLETED: 8,
  OPERAND_NOT_SUPPORTED: 9,
};

const RESPONSE_TEXT = {
  [RESPONSE.SUCCESS]: 'success',
  [RESPONSE.OP_CODE_NOT_SUPPORT]: 'opCode not support',
  [RESPONSE.INVALID_OPERATOR]: 'invalid operator',
  [RESPONSE.OPERATOR_NOT_SUPPORTED]: 'operator not supported',
  [RESPONSE.INVALID_OPERAND]: 'invalid operand',
  [RESPONSE.NO_RECORDS_FOUND]: 'no records found',
  [RESPONSE.ABORT_UNSUCCESSFUL]: 'abort unsuccessful',
  [RESPONSE.PROCEDURE_NOT_COMPLETED]: 'procedure not completed',
  [RESPONSE.OPERAND_NOT_SUPPORTED]: 'operand not supported',
};

const CHARBOHYDRATE = {
  RESERVED: 0,
  BREAKFAST: 1,
  LUNCH: 2,
  DINNER: 3,
  SNACK: 4,
  DRINK: 5,
  SUPPER: 6,
  BRANCH: 7,
};

const CHARBOHYDRATE_TEXT = {
  [CHARBOHYDRATE.RESERVED]: 'Reserved for future use',
  [CHARBOHYDRATE.BREAKFAST]: 'Breakfast',
  [CHARBOHYDRATE.LUNCH]: 'Lunch',
  [CHARBOHYDRATE.DINNER]: 'Dinner',
  [CHARBOHYDRATE.SNACK]: 'Snack',
  [CHARBOHYDRATE.DRINK]: 'Drink',
  [CHARBOHYDRATE.SUPPER]: 'Supper',
  [CHARBOHYDRATE.BRANCH]: 'Branch',
};

const CHARBOHYDRATE_SIMPLE_TEXT = {
  [CHARBOHYDRATE.RESERVED]: null,
  [CHARBOHYDRATE.BREAKFAST]: 'morning',
  [CHARBOHYDRATE.LUNCH]: 'lunch',
  [CHARBOHYDRATE.DINNER]: 'afternoon',
  [CHARBOHYDRATE.SUPPER]: 'night',
};

const MEAL = {
  RESERVE: 0,
  PREPRANDIAL: 1,
  POSTPRANDIAL: 2,
  FASTING: 3,
  CASUAL: 4,
  BEDTIME: 5,
};

const MEAL_TEXT = {
  [MEAL.RESERVE]: 'Reserved for future use',
  [MEAL.PREPRANDIAL]: 'Preprandial (before meal)',
  [MEAL.POSTPRANDIAL]: 'Postprandial (after meal)',
  [MEAL.FASTING]: 'Fasting',
  [MEAL.CASUAL]: 'Casual (snacks, drinks, etc.)',
  [MEAL.BEDTIME]: 'Bedtime',
};

const MEAL_SIMPLE_TEXT = {
  [MEAL.RESERVE]: null,
  [MEAL.PREPRANDIAL]: 'before',
  [MEAL.POSTPRANDIAL]: 'after',
};

const TESTER = {
  RESERVE: 0,
  SELF: 1,
  PROFESSIONAL: 2,
  LAB_TEST: 3,
  NOT_AVAILABLE: 15,
};

const TESTER_TEXT = {
  [TESTER.RESERVE]: 'Reserved for future use',
  [TESTER.SELF]: 'Self',
  [TESTER.PROFESSIONAL]: 'Health Care Professional',
  [TESTER.LAB_TEST]: 'Lab test',
  [TESTER.NOT_AVAILABLE]: 'Tester value not available',
};

const HEALTH = {
  RESERVED: 0,
  MINOR_ISSUES: 1,
  MAJOR_ISSUES: 2,
  DURING_MENSES: 3,
  UNDER_STRESS: 4,
  NO_ISSUES: 5,
  NOT_AVAILABLE: 15,
};

const HEALTH_TEXT = {
  [HEALTH.RESERVED]: 'Reserved for future use',
  [HEALTH.MINOR_ISSUES]: 'Minor health issues',
  [HEALTH.MAJOR_ISSUES]: 'Major health issues',
  [HEALTH.DURING_MENSES]: 'During menses',
  [HEALTH.UNDER_STRESS]: 'Under stress',
  [HEALTH.NO_ISSUES]: 'No health issues',
  [HEALTH.NOT_AVAILABLE]: 'Health value not available',
};

function readGlocoseRecord(value: Buffer) {
  const record = {};
  let offset = 0;

  // flag byte (1 byte)
  const flags = value.readUInt8(offset);
  const timeOffsetPresent = (flags & 0x01) > 0;
  const typeAndLocationPresent = (flags & 0x02) > 0;
  const concentrationUnit = (flags & 0x04) > 0 ? 'mol/l' : 'kg/l';
  const sensorStatusAnnunciationPresent = (flags & 0x08) > 0;
  //  const contextInfoFollows = (flags & 0x10) > 0;
  offset += 1;

  // sequence byte (2 type)
  record.sequenceNumber = value.readUInt16LE(offset);
  offset += 2;

  const year = value.readUInt16LE(offset);
  const month = value.readUInt8(offset + 2) - 1; // months are 1-based
  const day = value.readUInt8(offset + 3);
  const hours = value.readUInt8(offset + 4);
  const minutes = value.readUInt8(offset + 5);
  const seconds = value.readUInt8(offset + 6);
  record.date = new Date(year, month, day, hours, minutes, seconds);
  offset += 7;

  if (timeOffsetPresent) {
    record.timeOffset = value.readUInt16LE(offset);
    record.date.setMinutes(record.date.getMinutes() + record.timeOffset);
    offset += 2;
  }

  if (typeAndLocationPresent) {
    record.glucoseConcentration = readSFloat(value, offset);
    record.unit = concentrationUnit;
    const typeAndLocation = value.readUInt8(offset + 2);
    record.type = typeAndLocation & 0x0f;
    record.sampleLocation = (typeAndLocation & 0xf0) >> 4;
    offset += 3;
  }

  if (sensorStatusAnnunciationPresent) {
    record.status = value.readUInt16LE(offset);
  }

  return record;
}

function readMeasurementContext(value: Buffer) {
  let offset = 0;
  const result = {};

  // flag: 1 byte
  const flag = value.readUInt8(offset);
  const carbohydratePresent = (flag & 1) > 0;
  const mealPresent = (flag & 2) > 0;
  const testerHealthPresent = (flag & 4) > 0;
  const exerciseDurationPresent = (flag & 8) > 0;
  const medicationPresent = (flag & 16) > 0;
  const medicationUnit = (flag & 32) > 0 ? 'l' : 'kg';
  const hbA1cPresent = (flag & 64) > 0;
  const extendFlagPresent = (flag & 128) > 0;
  offset += 1;

  // sequence number: 2 byte
  result.sequenceNumber = value.readUInt16LE(offset);
  offset += 2;

  if (extendFlagPresent) {
    result.extendFlag = value.readInt8(offset);
    offset += 1;
  }

  if (carbohydratePresent) {
    const carbohydrateID = value.readInt8(offset);
    const carbohydrateValue = readSFloat(value, offset + 1);
    result.carbohydrate =
      CHARBOHYDRATE_TEXT[carbohydrateID] || CHARBOHYDRATE_TEXT[0];
    // eslint-disable-next-line max-len
    result.carbohydrateSimple =
      CHARBOHYDRATE_SIMPLE_TEXT[carbohydrateID] || CHARBOHYDRATE_SIMPLE_TEXT[0];
    result.carbohydrateValue = carbohydrateValue;
    offset += 3;
  }

  if (mealPresent) {
    const mealID = value.readUInt8(offset);
    result.meal = MEAL_TEXT[mealID] || MEAL_TEXT[0];
    result.mealSimple = MEAL_SIMPLE_TEXT[mealID] || MEAL_SIMPLE_TEXT[0];
    offset += 1;
  }

  if (testerHealthPresent) {
    const testerHealth = value.readUInt8(offset);
    const testerFlag = (testerHealth & 0xf0) << 4;
    const healthFlag = testerHealth & 0x0f;
    result.tester = TESTER_TEXT[testerFlag] || TESTER_TEXT[0];
    result.health = HEALTH_TEXT[healthFlag] || HEALTH_TEXT[0];
    offset += 1;
  }

  if (exerciseDurationPresent) {
    result.exerciseDuration = value.readInt16LE(offset);
    result.exerciseIntensity = value.readInt8(offset + 2);
    offset += 3;
  }

  if (medicationPresent) {
    result.medication = readSFloat(offset);
    result.medicationUnit = medicationUnit;
    offset += 2;
  }

  if (hbA1cPresent) {
    result.HbA1c = readSFloat(offset);
    offset += 2;
  }

  return result;
}

function readAccessControlRecord(value: Buffer) {
  let offset = 0;
  const result = {};
  result.opCode = value.readUInt8(offset);
  result.operator = value.readUInt8(offset + 1);
  result.opCodeText = OP_CODE_TEXT[result.opCode];
  result.operatorText = OPERATOR_TEXT[result.opCodeText];

  offset += 2;
  if (result.opCode === OP_CODE.NUMBER_OF_STORED_RECORDS_RESPONSE) {
    result.storedRecords = value.readUInt16LE(offset);
  } else if (result.opCode === OP_CODE.RESPONSE_CODE) {
    result.requestOpCode = value.readUInt8(offset);
    result.responseCode = value.readUInt8(offset + 1);
    result.responseCodeText = RESPONSE_TEXT[result.responseCode];
  }

  return result;
}

function mergeRecord([records, contextRecords]) {
  // build glucose contect dict with sequenceNumber as key
  const contextMap = contextRecords.reduce(
    (prev, cur) => ({
      ...prev,
      [cur.sequenceNumber]: cur,
    }),
    {},
  );

  // map glucose records with glucose context records
  return records.map((record) => {
    if (contextMap[record.sequenceNumber]) {
      return { ...record, context: contextMap[record.sequenceNumber] };
    }
    return record;
  });
}

function monitor(device: Device) {
  const measurement$ = new Subject();
  const measurementContext$ = new Subject();
  const accessControl$ = new Subject();

  const glucoseList$ = combineLatest([
    measurement$.pipe(rxjsBuffer(accessControl$)),
    measurementContext$.pipe(rxjsBuffer(accessControl$)),
  ]).pipe(rxjsMap(mergeRecord));
  device
    .connect()
    .then((device) => device.discoverAllServicesAndCharacteristics())
    .then((device) => {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID.RECORD_ACCESS_CONTROL,
        (error, characteristic) => {
          if (error) {
            accessControl$.error(error);
            return;
          }
          const accessControlRecord = readAccessControlRecord(
            Buffer.from(characteristic.value, 'base64'),
          );
          console.log('accessControlRecord', accessControlRecord);
          accessControl$.next(accessControlRecord);
        },
      );

      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID.MEASUREMENT_CONTEXT,
        (error, characteristic) => {
          if (error) {
            measurementContext$.error(error);
            return;
          }
          const measurementContextRecord = readMeasurementContext(
            Buffer.from(characteristic.value, 'base64'),
          );
          console.log('measurementContextRecord', measurementContextRecord);
          measurementContext$.next(measurementContextRecord);
        },
      );

      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID.MEASUREMENT,
        (error, characteristic) => {
          if (error) {
            measurement$.error(error);
            return;
          }
          const measurementRecord = readGlocoseRecord(
            Buffer.from(characteristic.value, 'base64'),
          );
          console.log('measurementRecord', measurementRecord);
          measurement$.next(measurementRecord);
        },
      );

      return device;
    })
    .then((device) => {
      device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID.RECORD_ACCESS_CONTROL,
        Buffer.from([
          OP_CODE.REPORT_STORED_RECORDS,
          OPERATOR.LAST_RECORD,
        ]).toString('base64'),
      );
    });
  console.log(' glucoseList$', glucoseList$);
  return glucoseList$.pipe(
    concatAll(),
    rxjsMap((record) => {
      let bgc = record.glucoseConcentration;
      if (record.unit === 'kg/l') {
        bgc = parseFloat(Big(bgc).times(Big(10).pow(5)).toString());
      }
      return {
        name: NAME,
        type: TYPE,
        payload: {
          bgc: bgc,
        },
      };
    }),
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
