import { Platform } from 'react-native';
import { Fabric } from '@signalwire/js';
import AsyncStorage from '@react-native-async-storage/async-storage';

let os: 'Android' | 'iOS' | 'unsupported' = 'unsupported';
if (Platform.OS === 'android') os = 'Android';
else if ((Platform.OS = 'ios')) os = 'iOS';

type IRegisterParams = Omit<
  Parameters<typeof Fabric.registerDevice>[0],
  'deviceType'
>;

// Register this device to get push notifications.

async function registerDevice(params: IRegisterParams) {
  if (os === 'unsupported') {
    console.error(
      'This device does not support receiving push notifications yet.'
    );
    return;
  }

  let result;
  try {
    result = await Fabric.registerDevice({ ...params, deviceType: os });
  } catch (e) {
    console.error(e);
  }

  if (result && result['push_notification_key'] !== undefined) {
    try {
      await AsyncStorage.setItem(
        '@push_notification_key',
        result['push_notification_key']
      );
    } catch (e) {
      console.error('Could not save push notification decryption key.');
    }
  }

  return result;
}

type IUnregisterParams = Parameters<typeof Fabric.unregisterDevice>;

async function unregisterDevice(...params: IUnregisterParams) {
  let result;

  try {
    result = await Fabric.unregisterDevice(...params);
  } catch (e) {
    console.error('Could not unregister device');
    return result;
  }

  try {
    await AsyncStorage.removeItem('@push_notification_key');
  } catch (e) {
    console.error('Could not remove saved push notification decryption key.');
  }

  return result;
}

export { registerDevice, unregisterDevice };
