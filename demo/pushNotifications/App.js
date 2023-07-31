const TOKEN =
  "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiU0FUIn0..f7OSoZbkngm64LLA.PcWUdWK8P_2Huw3AM2-w_2iBCxdZsKy7hu2dB4stYzmVI2BKcxQfQ1nUK1mJ6Mt8YBxv_AtZcneyOvpTJE8NuRGyYOYBg30TDKhW1XvOdzH65r11pWHw2uG_KfeQaGYHNawFhh3ukNYQIJDX0OwToSv8oNOI-_Cey9bdTDLoOE2ZqhYtJHHocBs6FtNZlT3_InfIynnaO9KWXqRU38q2j_JpNG9daQCPRNAJBsXkZZNw0x1SkgfW6wvBqlXSXaEwElBlPuGC-be0N7vSmkqnAwQcIq2hmgd4obPNkWg8So5o_lUlue_c_B50SwM40kCoutoQjzH_l5GpYqNHOcFPTdSMprinbwlvZiXMV2UFzAFfHOmhYn9Idiwu8rl-pzHN-T51RUikyQcrK8MXqzvfSWfRmfXoiqS7VKao51pssnV1q4Q6FakrYJCKkDTPdfjUV8QjvFfYVimM67x9IW8Ihx3pecHnEW_CVTTgNqHDWSlI.CxbidCApdj50lgaQpuTNFQ";

import "react-native-get-random-values";
global.Buffer = require("buffer").Buffer;

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button } from "react-native";

import RNCallKeep from "react-native-callkeep";

import { useSignalWire } from "@signalwire-community/react-native";
import { useState } from "react";
import { RTCView } from "react-native-webrtc";
import useCallKeep from "./useCallKeep";
import useVoipPush from "./useVoipPush";

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

export default function App() {
  const client = useSignalWire({ token: TOKEN });
  const [call, setCall] = useState(null);
  const [streamURL, setStreamURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const payload = useVoipPush(async function onTokenReceived(token) {
    client?.registerDevice({
      deviceToken: token,
    });
  }, client);

  const callUUID = useCallKeep(
    async function onCallAnswered(params) {
      console.log("Handling push notification", params);
      let callHandle;
      try {
        setLoading(true);
        callHandle = await client.handlePushNotification(payload);
      } catch (e) {
        console.log("Payload", payload, "might be mal-formed");
        setLoading(false);
        return;
      }
      callHandle = callHandle.resultObject;

      const call = await callHandle.answer();
      setLoading(false);
      console.log(call, "The Call Object");
      console.log(call.active, call.remoteStream);
      setCall(call);
      setStreamURL(call?.remoteStream?.toURL());
    },

    async function onCallEnded(params) {
      if (params.callUUID === callUUID) {
        console.log("The call ending is the one currently active");
        handleEndCall();
      }
    },

    payload
  );

  async function handleEndCall() {
    console.log("leaving call");
    await call.leave();
    RNCallKeep.endCall(callUUID);
    setCall(null);
    setStreamURL(null);
  }

  return (
    <View style={styles.container}>
      <Text>
        {loading ? "Connecting to server" : "Wait for push notification!"}
      </Text>
      <StatusBar style="auto" />
      {call && <Text>Call has been joined</Text>}
      {call && (
        <SafeAreaView style={{ height: "100%" }}>
          <Text>Remote video: </Text>
          {
            <>
              <View style={{ borderWidth: 5, borderColor: "red" }}>
                {streamURL && (
                  <RTCView
                    streamURL={streamURL}
                    style={{ width: "100%", aspectRatio: 16 / 9 }}
                  />
                )}
              </View>
              <Button title="End call" onPress={handleEndCall}></Button>
            </>
          }
        </SafeAreaView>
      )}
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
