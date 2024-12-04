import {Buffer} from 'buffer';
import Big from 'big.js/big';

export function readThermometer(bytes: number[]) {
  const flag = bytes[0];
  const unit = flag & 0x01 ? 'Fahrenheit' : 'Celcius';
  const timestampPresent = flag & 0x02;
  const typePresent = flag & 0x04;

  const timeIndex = 5; // after flag (1 block) and value (4 blocks)
  const typeIndex = timestampPresent ? 12 : 5;

  const mantissa = (bytes[3] << 16) + (bytes[2] << 8) + bytes[1];
  const exponent = Buffer.from([bytes[4]]).readInt8(0);
  const temp = parseFloat(Big(mantissa).times(Big(10).pow(exponent)).toString());
  const dateTime = timestampPresent ? readDateTime(bytes, timeIndex) : null;
  const checkType = typePresent ? readThermometerType(bytes, typeIndex) : null;

  return {
    temp: temp,
    type: checkType,
    dateTime,
    unit,
  };
}

export function readDateTime(bytes: number[], offset: number) {
  if (offset + 7 > bytes.length) {
    // throw new Error('Out of range offset.');
    return null;
  }

  const year = bytes[offset + 1] * 256 + bytes[offset]; // Little Endian
  const month = bytes[offset + 2] - 1; // 0 based index
  const date = bytes[offset + 3];
  const hour = bytes[offset + 4];
  const minute = bytes[offset + 5];
  const second = bytes[offset + 6];

  return new Date(year, month, date, hour, minute, second);
}

export function readThermometerType(bytes: number[], offset: number) {
  if (offset + 1 > bytes.length) {
    // throw new Error('Out of range offset.');
    return null;
  }
  const checkType = bytes[offset] - 1;
  const types = [
    'Armpit',
    'Body',
    'Ear',
    'Finger',
    'GastroIntestinalTract',
    'Mouth',
    'Rectum',
    'Toe',
    'Tympanum',
  ]; // please be this order

  return checkType >= types.length ? null : types[checkType];
}

function unsignedToSigned(unsigned: number, size: number) {
  if ((unsigned & (1 << (size - 1))) !== 0) {
    unsigned = -1 * ((1 << (size - 1)) - (unsigned & ((1 << (size - 1)) - 1)));
  }
  return unsigned;
}

export function readSFloat(buffer: Buffer, offset: number) {
  if (offset + 2 > buffer.length) {
    return null;
  }
  const b0 = buffer.readUInt8(offset);
  const b1 = buffer.readUInt8(offset + 1);
  const mantissa = unsignedToSigned(b0 + ((b1 & 0x0f) << 8), 12);
  const exponent = unsignedToSigned(b1 >> 4, 4);
  const result = Big(mantissa).times(Big(10).pow(exponent)); // for fix precision error
  return parseFloat(result.toString());
}
