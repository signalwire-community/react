import { useSignalWire } from "@signalwire-community/react-native";
import useCallKeep from "./useCallKeep";
import useVoipPush from "./useVoipPush";
import { useState } from "react";
import RNCallKeep, { CONSTANTS as CK_CONSTANTS } from "react-native-callkeep";

import "./CallKeepConfig";

// This hook uses `useVoipPush` hook for receiving the device push token and to receive notifications,
// `useCallKeep` to show call screen, and to get event callbacks for when user accepts or declines or ends the call,
// and `useSignlWire` hook to connect to SignalWire client when the push notification payload has been received.

export default function useHandlePNInvite(TOKEN) {
  const client = useSignalWire({ token: TOKEN });

  const [call, setCall] = useState(null);
  const [awaitingCall, setAwaitingCall] = useState(null);
  const [loading, setLoading] = useState(false);

  const payload = useVoipPush(
    async function onTokenReceived(token) {
      const registrationInfo = await client?.registerDevice({
        deviceToken: token,
      });
      console.log("Device registereed", registrationInfo);
      RNCallKeep.setAvailable(true);
    },

    async function onPayloadReceived(payload) {
      let callHandle;
      setLoading(true);
      try {
        // Note how we are not awaiting this promise to fulfill here.
        callHandle = client.handlePushNotification(payload);
        console.log("Call starting to connect");
        setAwaitingCall(callHandle);
      } catch (e) {
        console.log(
          "Error processing payload:",
          e,
          "Please check if payload is ill-formed:",
          payload
        );
        setLoading(false);
        return;
      }
    },

    client
  );

  const callUUID = useCallKeep(
    async function onCallAnswered(params) {
      let call;
      try {
        // If the user is particularly quick in pressing the answer button,
        // wait for the connection to establish before answering anyway
        let callHandler = (await awaitingCall).resultObject;

        callHandler.on("destroy", (e) => {
          console.log(
            "Call ended, possibly from remote. Ending call",
            e,
            callUUID
          );
          try {
            RNCallKeep.endCall(params.callUUID);
          } catch (e) {
            console.log(e);
          }
        });

        call = await callHandler.answer();
      } catch (e) {
        console.log("Error answering call", e);
        RNCallKeep.reportEndCallWithUUID(
          params.callUUID,
          CK_CONSTANTS.END_CALL_REASONS.REMOTE_ENDED
        );
        setCall(null);
        setLoading(false);
        return;
      }
      console.log(call, "The Call Object answered from call", params);
      RNCallKeep.setCurrentCallActive(params.callUUID);
      RNCallKeep.backToForeground();
      setCall(call);
      setLoading(false);
    },

    async function onCallEnded(params) {
      // This callback gets called if
      //  a. user declines call
      //  b. user ends call using system UI
      //  c. anytime RNCallKeep.endCall(..) is called
      // so make sure to handle all possible combinations
      try {
        console.log("trying to reject the invite for all devices");
        await (await awaitingCall).resultObject.hangupAll();
      } catch (e) {
        console.log(
          e,
          "couldn't hangup all devices. Trying to hangup for just this device."
        );
        try {
          await (await awaitingCall).resultObject.hangup();
        } catch (e) {
          console.log(e);
        }
      }

      setLoading(false);
      setCall(null);
    },

    payload,
    awaitingCall
  );

  return { call, loading, callUUID };
}
