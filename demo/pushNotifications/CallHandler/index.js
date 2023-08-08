const TOKEN =
  "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwidHlwIjoiU0FUIn0..MHDLrQFEQGiEaYD3.O14KKqssC0vWnuF_-rd7nItIPnin_ZPutoctKzUjWq-1atZhYRyPHPgW3RXMJ38FUTxH8koI8OpnEzrl4u2fixFWkTTHivodnMInlHsvMbMFDVnUNTOO5_gcO2XVg61oE93Q0Aq8F5ESOOijHVFTU47IpZx6BFoOHN9SMIEZNjsBpXP8w-VSAlmrcivul2ghXNC-TEcv0SLDurPzGI2TJLKRlqu888YqH-PCyqajodFrOt6K_Ay0qpRP1xNqveaXeNib6zPbe7U4jY2ikJQSH-47MOrwG7lYUdilaPfAMia3-UNeNSthyRqaxr0HHSOaRl85POl3InEbkkIAgLqP7tYoDBd0sVmL2_Or13DXK_FYewX2R6_dXx0Z-oeYUSSzwKfXU0C_5ZN-b12Q7csOYdMkKl4hklM4qc-p_y5jVyaGqV3e5V0VhM-lvoreHfCs_wrFvuhnje0GvX-TRyg1AfW34UA_Ls-ED0plXzuCxCMH.15rgmL5hBGIJXVUnIJoDFA";

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
