global.Buffer = require('buffer').Buffer;
import type { Call, SignalWireContract } from './types';
import { useSignalWire as _useSignalWire } from '@signalwire-community/react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pako from 'pako';
import AesGcmCrypto from 'react-native-aes-gcm-crypto';

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

type IHandlePushNotificationParams = {
  aps?: {
    alert: Omit<
      Parameters<SignalWireContract['handlePushNotification']>[0],
      'decrypted'
    >;
  };
  notification?: {
    body: string;
  };
};

type clientParams = Parameters<typeof _useSignalWire>[0];

// @ts-expect-error Incompatible function assignment for handlePushNotification
interface ISWClientRN extends SignalWireContract {
  _registerDevice: SignalWireContract['registerDevice'];
  _unregisterDevice: SignalWireContract['unregisterDevice'];
  _handlePushNotification: SignalWireContract['handlePushNotification'];
  registerDevice: (_: IRegisterParams) => Promise<any>;
  unregisterDevice: (_: IUnregisterParams) => Promise<any>;
  handlePushNotification: (_: IHandlePushNotificationParams) => Promise<any>;
}

export default function useSignalWire(params: clientParams) {
  const client: ISWClientRN = _useSignalWire(params) as unknown as ISWClientRN;
  useEffect(() => {
    if (!client) return;
    client._registerDevice = client.registerDevice;
    client._unregisterDevice = client.unregisterDevice;
    // @ts-expect-error function not assignable
    client._handlePushNotification = client.handlePushNotification;

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
        id = await AsyncStorage.getItem('@signalwire_registration_id');
        if (id === null)
          console.info(
            'Device registration ID was not found in local storage. Make sure you have called the registerDevice() method?'
          );

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

    client.handlePushNotification = async (
      payload: IHandlePushNotificationParams
    ): Promise<Call | null> => {
      let pnKeyB64;
      pnKeyB64 = await AsyncStorage.getItem(
        '@signalwire_push_notification_key'
      );
      if (pnKeyB64 === null || pnKeyB64 === undefined) {
        console.error(
          "Couldn't find the push notification decryption key. Make sure you have called the registerDevice() method?"
        );
        return null;
      }

      let corePayload;
      if (payload?.aps?.alert) {
        corePayload = payload.aps.alert;
      } else {
        if (typeof payload?.notification?.body === 'string') {
          try {
            corePayload = JSON.parse(payload?.notification?.body);
          } catch (e) {}
        }
      }

      if (corePayload === undefined || !corePayload?.invite) {
        console.error('Push notification payload is ill-formed');
      }

      console.log('Payload extracted', corePayload);

      let invite = corePayload.invite;

      if (corePayload.encryption_type === 'aes_256_gcm') {
        let inviteEncB64 = corePayload.invite;

        const ivHex = Buffer.from(corePayload.iv, 'base64').toString('hex');
        const tagHex = Buffer.from(corePayload.tag, 'base64').toString('hex');

        try {
          invite = await AesGcmCrypto.decrypt(
            inviteEncB64,
            pnKeyB64,
            ivHex,
            tagHex,
            true
          );
        } catch (e) {
          console.error(e);
          return null;
        }
      }

      // AesGcmCrypto returns a base64 encoded binary
      let decompressedInvite = pako.inflate(Buffer.from(invite, 'base64'));
      let sdpJson = Buffer.from(decompressedInvite).toString('utf8');
      try {
        sdpJson = JSON.parse(sdpJson);
      } catch (e) {
        console.error('Ill formed JSON invite');
        return null;
      }

      console.log('The SDP invite', sdpJson);
      const call = await client._handlePushNotification({
        ...corePayload,
        decrypted: sdpJson,
      });
      return call as Call;
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
