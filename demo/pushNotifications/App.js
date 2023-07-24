import "react-native-get-random-values";
global.Buffer = require("buffer").Buffer;

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import RNCallKeep from "react-native-callkeep";
import VoipPushNotification from "react-native-voip-push-notification";

import {
  RemoteStream,
  useSignalWire,
} from "@signalwire-community/react-native";
import { useState } from "react";

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
    RNCallKeep.addEventListener("answerCall", async (params) => {
      console.log("Call is answered.", params);

      console.log(payload, "is the payload");

      if (payload) {
        try {
          let call = await client.handlePushNotification(payload);
          setCall(call);
        } catch (e) {
          console.log("Ill formed SDP invite");
        }
      }
    });

    RNCallKeep.addEventListener("endCall", ({ callUUID }) => {
      console.log("Call ended");
      call?.leave();
      setPayload(null);
    });

    return () => {
      RNCallKeep.removeEventListener("answerCall");
      RNCallKeep.removeEventListener("endCall");
    };
  }, [payload]);

  useEffect(() => {
    if (client === null) return;

    async function registerDevice(token) {
      client?.registerDevice({
        deviceToken: token,
      });
    }

    VoipPushNotification.addEventListener("register", (token) => {
      console.log("Token received", token);
      registerDevice(token);
    });

    VoipPushNotification.addEventListener("notification", (notification) => {
      console.log(notification);
      setPayload(notification);

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
          // --- when receive remote voip push, register your VoIP client, show local notification ... etc
          console.log("Notification received", data);
          setPayload(data);
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
