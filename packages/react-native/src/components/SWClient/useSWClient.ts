import type { SWClient as SWClientOriginal } from '@signalwire/js';
import { SWClient } from '@signalwire-community/react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// helper to make a ts property optional, use same as Omit<>
type PartiallyOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface IRegisterParams
  extends PartiallyOptional<
    Parameters<SWClientOriginal['registerDevice']>[0],
    'deviceType'
  > {}
type IUnregisterParams = Parameters<SWClientOriginal['unregisterDevice']>;

type clientParams = Parameters<typeof SWClient.useSWClient>;

interface ISWClientRN extends SWClientOriginal {
  _registerDevice: SWClientOriginal['registerDevice'];
  _unregisterDevice: SWClientOriginal['unregisterDevice'];
  registerDevice: (_: IRegisterParams) => Promise<any>;
  unregisterDevice: (..._: IUnregisterParams) => Promise<any>;
}

export default function useSWClient(...params: clientParams) {
  const client: ISWClientRN = SWClient.useSWClient(...params) as ISWClientRN;
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
    };

    client.unregisterDevice = async (...params: IUnregisterParams) => {
      let result;

      try {
        result = await client._unregisterDevice(...params);
      } catch (e) {
        console.error('Could not unregister device');
        return result;
      }

      try {
        await AsyncStorage.removeItem('@push_notification_key');
      } catch (e) {
        console.error(
          'Could not remove saved push notification decryption key.'
        );
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
