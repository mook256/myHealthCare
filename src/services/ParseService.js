import Parse from 'parse/react-native';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import pkg from '../../package.json';

export async function installation(deviceToken) {
  const iid = await Parse._getInstallationId();
  const currentUser = await Parse.User.currentAsync();
  const installObject = new Parse.Installation();
  const installQuery = new Parse.Query(Parse.Installation);
  installQuery.equalTo('installationId', iid);
  const install = await installQuery.first({ useMasterKey: true });
  if (install && install.get('user') && currentUser) {
    // read
    return install;
  }
  if (install && !install.get('user') && currentUser) {
    // update user
    install.set('user', currentUser.get('userid'));
    const newInstall = await install.save();
    return newInstall;
  }
  const newInstall = await installObject.save({
    channels: [],
    appIdentifier: DeviceInfo.getBundleId(),
    appName: DeviceInfo.getApplicationName(),
    appVersion: DeviceInfo.getVersion(),
    deviceType: Platform.OS,
    installationId: iid,
    localeIdentifier: RNLocalize.getLocales()?.[0]?.languageTag ?? 'en-TH',
    parseVersion: pkg.dependencies.parse,
    timeZone: RNLocalize.getTimeZone(),
    pushType: Platform.OS === 'android' ? 'gcm' : '',
    deviceToken,
  });
  return newInstall;
}

export async function currentInstallation() {
  const iid = await Parse._getInstallationId();
  const query = new Parse.Query(Parse.Installation);
  query.equalTo('installationId', iid);
  const result = await query.first({ useMasterKey: true });
  // console.log("currentInstallation", result);
  if (!result) {
    throw new Error('installation undefined');
  }
  return result;
}

export async function updateInstallation(params) {
  const result = await currentInstallation();
  // console.log('updateInstallation', result);
  return result.save(params);
}
