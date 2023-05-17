import type { SWClient as SWClientOriginal } from '@signalwire/js';
import ReactWrapper from '@signalwire-community/react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// helper to make a ts property optional, use same as Omit<>
type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type IRegisterParams = PartiallyOptional<
  Parameters<SWClientOriginal['registerDevice']>[0],
  'deviceType'
>;
type IUnregisterParams = PartiallyOptional<
  Parameters<SWClientOriginal['unregisterDevice']>[0],
  'id'
>;

type clientParams = Parameters<typeof ReactWrapper.useSWClient>;

interface ISWClientRN extends SWClientOriginal {
  _registerDevice: SWClientOriginal['registerDevice'];
  _unregisterDevice: SWClientOriginal['unregisterDevice'];
  registerDevice: (_: IRegisterParams) => Promise<any>;
  unregisterDevice: (_: IUnregisterParams) => Promise<any>;
}

export default function useSWClient(...params: clientParams) {
  const client: ISWClientRN = ReactWrapper.useSWClient(
    ...params
  ) as ISWClientRN;
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
            '@push_notification_key',
            result['push_notification_key']
          );
        } catch (e) {
          console.error('Could not save push notification decryption key.');
        }

        try {
          await AsyncStorage.setItem('@registration_id', result['id']);
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
          id = await AsyncStorage.getItem('@registration_id');
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
        await AsyncStorage.removeItem('@push_notification_key');
        await AsyncStorage.removeItem('@registration_id');
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
