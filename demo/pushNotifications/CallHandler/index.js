const TOKEN = "<TOKEN>";

import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import { RTCView } from "react-native-webrtc";
import useHandlePNInvite from "./lib/useHandlePNInvite";
import RNCallKeep from "react-native-callkeep";

export default function CallHandler() {
  const { call, loading, callUUID } = useHandlePNInvite(TOKEN);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* If the call object is not null, the push notification was received, call answered, connection established. Display call screen */}
      {/* When `call` goes back to null, the call has ended. */}
      {call === null ? (
        <Text>
          {loading ? "Connecting the call" : "Waiting for push notification!"}
        </Text>
      ) : (
        <View>
          <Text>Call has been joined</Text>
          <RTCView
            streamURL={call?.remoteStream?.toURL()}
            style={styles.remoteView}
          />
          <Button
            title="End call"
            onPress={() => {
              RNCallKeep.endCall(callUUID);
            }}
          ></Button>
        </View>
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
  remoteView: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
});
