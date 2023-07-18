import type { SignalWireContract } from './types';
import { useSignalWire as _useSignalWire } from '@signalwire-community/react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// helper to make a ts property optional, use same as Omit<>
type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type IRegisterParams = PartiallyOptional<
  Parameters<SignalWireContract['registerDevice']>[0],
  'deviceType'
>;
type IUnregisterParams = PartiallyOptional<
  Parameters<SignalWireContract['unregisterDevice']>[0],
  'id'
>;

type IHandlePushNotificationParams = Omit<
  Parameters<SignalWireContract['handlePushNotification']>[0],
  'decrypted'
>;

type clientParams = Parameters<typeof _useSignalWire>[0];

interface ISWClientRN extends SignalWireContract {
  _registerDevice: SignalWireContract['registerDevice'];
  _unregisterDevice: SignalWireContract['unregisterDevice'];
  _handlePushNotification: SignalWireContract['handlePushNotification'];
  egisterDevice: (_: IRegisterParams) => Promise<any>;
  unregisterDevice: (_: IUnregisterParams) => Promise<any>;
  handlePushNotification: (_: IHandlePushNotificationParams) => Promise<any>;
}

export default function useSignalWire(params: clientParams) {
  const client: ISWClientRN = _useSignalWire(params) as ISWClientRN;
  useEffect(() => {
    if (!client) return;
    client._registerDevice = client.registerDevice;
    client._unregisterDevice = client.unregisterDevice;

    client.registerDevice = async (registerParams: IRegisterParams) => {
      const os = getOs();
      if (os === 'unsupported') {
        console.error(
          'This device does not support receiving push notifications yet.'
        );
        return;
      }

      let result;
      try {
        result = await client._registerDevice({
          ...registerParams,
          deviceType: os,
        });
      } catch (e) {
        console.error(e);
      }

      if (result && result['push_notification_key'] && result['id']) {
        try {
          await AsyncStorage.setItem(
            '@signalwire_push_notification_key',
            result['push_notification_key']
          );
        } catch (e) {
          console.error('Could not save push notification decryption key.');
        }

        try {
          await AsyncStorage.setItem(
            '@signalwire_registration_id',
            result['id']
          );
        } catch (e) {
          console.error('Could not save the registration ID');
        }
      }

      return result;
    };

    client.unregisterDevice = async (unregisterParams: IUnregisterParams) => {
      let result;

      // Look at AsyncStorage only if id is not provided as a param
      if (unregisterParams.id === undefined) {
        let id = null;
        try {
          id = await AsyncStorage.getItem('@signalwire_registration_id');
        } catch (e) {
          console.error('Could not get the registration ID');
        }

        if (id !== null) unregisterParams.id = id;
        else {
          console.error('No ID provided to unregister device.');
          return;
        }
      }

      try {
        // @ts-expect-error id might be undefined.
        result = await client._unregisterDevice(unregisterParams);
      } catch (e) {
        console.error('Could not unregister device');
        return result;
      }

      try {
        await AsyncStorage.removeItem('@signalwire_push_notification_key');
        await AsyncStorage.removeItem('@signalwire_registration_id');
      } catch (e) {
        console.error('Could not remove saved items from async storage.');
      }

      return result;
    };
  }, [client]);

  return client;
}

// Transform Platform.OS into what SWClient understands
function getOs() {
  let os: 'Android' | 'iOS' | 'unsupported' = 'unsupported';
  if (Platform.OS === 'android') os = 'Android';
  else if ((Platform.OS = 'ios')) os = 'iOS';
  return os;
}
