import "react-native-get-random-values";
global.Buffer = require("buffer").Buffer;

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import RNCallKeep from "react-native-callkeep";
import VoipPushNotification from "react-native-voip-push-notification";

import pako from "pako";
import AesGcmCrypto from "react-native-aes-gcm-crypto";
import {
  RemoteStream,
  useSignalWire,
} from "@signalwire-community/react-native";
import { decode as decodeB64, encode } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react/cjs/react.production.min";

const options = {
  ios: {
    appName: "RN Push Playground",
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "ok",

    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: "org.signalwire.rnpushplayground",
      channelName: "Foreground service for push playground",
      notificationTitle: "RN push playground running in background",
    },
  },
};

// this gets ignored for ios, as we did the setup at appdelegate.m
RNCallKeep.setup(options).then((accepted) => {
  console.log(accepted);
});

const TOKEN = "<TOKEN>";

export default function App() {
  const client = useSignalWire({ token: TOKEN });
  const [payload, setPayload] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    RNCallKeep.addEventListener("didReceiveStartCallAction", (params) => {});

    RNCallKeep.addEventListener("answerCall", async (params) => {
      console.log("Call is answered.", params);

      if (payload) {
        try {
          let call = await client._handlePushNotification({
            ...payload,
            decrypted: JSON.parse(payload.decrypted),
          });
          setCall(call);
        } catch (e) {
          console.log("Ill formed SDP invite");
        }
      }
    });

    RNCallKeep.addEventListener("endCall", ({ callUUID }) => {
      // Do your normal `Hang Up` actions here
      console.log("Call ended");
      setPayload(null);
    });

    RNCallKeep.addEventListener(
      "didDisplayIncomingCall",
      ({
        error,
        callUUID,
        handle,
        localizedCallerName,
        hasVideo,
        fromPushKit,
        payload,
      }) => {
        // you might want to do following things when receiving this event:
        // - Start playing ringback if it is an outgoing call
        console.log("Payload", payload);
      }
    );

    return () => {
      RNCallKeep.removeEventListener("answerCall");
      RNCallKeep.removeEventListener("didReceiveStartCallAction");
    };
  }, []);

  useEffect(() => {
    if (client === null) return;

    async function registerDevice(token) {
      client?.registerDevice({
        deviceToken: token,
      });
    }
    async function processNotification(payload) {
      let corePayload = payload.aps.alert;
      console.log(corePayload);

      let inviteDecrypted = corePayload.invite;

      if (corePayload.encryption_type === "aes_256_gcm") {
        console.log("It's encrypted");
        let inviteEncrypted = corePayload.invite;

        const iv = Buffer.from(corePayload.iv, "base64");
        const ivHex = iv.toString("hex");

        const tag = Buffer.from(corePayload.tag, "base64");
        const tagHex = tag.toString("hex");

        inviteDecrypted = await AesGcmCrypto.decrypt(
          inviteEncrypted,
          "bV88zrv4+b52uLmIUCnDx7YWBTxD+3988+1rZ3O9+Qc=",
          ivHex,
          tagHex,
          true
        );
      }

      let decompressedInvite = pako.inflate(
        Buffer.from(inviteDecrypted, "base64")
      );
      console.log("decompressed invite", decompressedInvite);
      setPayload({ ...corePayload, decrypted: decompressedInvite });
    }

    VoipPushNotification.addEventListener("register", (token) => {
      console.log("Token received", token);
      registerDevice(token);
    });

    VoipPushNotification.addEventListener("notification", (notification) => {
      processNotification(notification);

      VoipPushNotification.onVoipNotificationCompleted(
        notification.aps.alert.notification_uuid
      );
    });

    // ===== Step 3: subscribe `didLoadWithEvents` event =====
    VoipPushNotification.addEventListener("didLoadWithEvents", (events) => {
      // --- this will fire when there are events occured before js bridge initialized
      // --- use this event to execute your event handler manually by event type

      if (!events || !Array.isArray(events) || events.length < 1) {
        return;
      }
      for (let voipPushEvent of events) {
        let { name, data } = voipPushEvent;
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
        ) {
          console.log("Token received", data);
          registerDevice(data);
        } else if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          console.log("NOTIFICATION RECEIVED");
          // --- when receive remote voip push, register your VoIP client, show local notification ... etc
          console.log("Notification received", data);
          processNotification(data);
        }
      }
    });

    // ===== Step 4: register =====
    // --- it will be no-op if you have subscribed before (like in native side)
    // --- but will fire `register` event if we have latest cahced voip token ( it may be empty if no token at all )
    VoipPushNotification.registerVoipToken(); // --- register token

    return () => {
      VoipPushNotification.removeEventListener("didLoadWithEvents");
      VoipPushNotification.removeEventListener("register");
      VoipPushNotification.removeEventListener("notification");
    };
  }, [client]);
  return (
    <View style={styles.container}>
      <Text>Wait for push notification!</Text>
      <StatusBar style="auto" />
      {call && <RemoteStream roomSession={call}></RemoteStream>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
