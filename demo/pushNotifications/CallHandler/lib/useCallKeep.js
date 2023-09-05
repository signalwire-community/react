import { useEffect, useState } from "react";
import RNCallKeep from "react-native-callkeep";

// This hook manages relevant CallKeep events
// and exposes callbacks for when the call is picked up,
// and ended.
export default function useCallKeep(
  onCallAnswered,
  onCallEnded,
  payload, // for useEffect dependency
  awaitingCall // for useEffect dependency
) {
  const [callUUID, setCallUUID] = useState(null);
  useEffect(() => {
    RNCallKeep.addEventListener("answerCall", async (params) => {
      setCallUUID(params.callUUID);
      console.log("Call is answered.", params);
      // this is payload TODO better abstraction
      if (payload) {
        onCallAnswered(params);
      }
    });

    RNCallKeep.addEventListener("endCall", async (params) => {
      console.log("Call ended", params);
      await onCallEnded(params);
      setCallUUID(null);
    });

    RNCallKeep.addEventListener("didReceiveStartCallAction", (params) => {
      console.log(
        `A call has been initiated from outside your app (from Contacts, Recents etc). Start an outbound call to 'params.handle'`,
        params
      );
    });

    return () => {
      RNCallKeep.removeEventListener("answerCall");
      RNCallKeep.removeEventListener("endCall");
      RNCallKeep.removeEventListener("didReceiveStartCallAction");
    };
  }, [payload, awaitingCall, callUUID]);
  return callUUID;
}
