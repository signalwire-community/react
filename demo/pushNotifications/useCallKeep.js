import { useEffect, useState } from "react";
import RNCallKeep from "react-native-callkeep";

export default function useCallKeep(onCallAnswered, onCallEnded, payload) {
  const [callUUID, setCallUUID] = useState(null);
  useEffect(() => {
    RNCallKeep.addEventListener("answerCall", async (params) => {
      setCallUUID(params.callUUID);
      console.log("Call is answered.", params);
      if (payload) {
        onCallAnswered(params);
      }
    });

    RNCallKeep.addEventListener("endCall", async (params) => {
      console.log("Call ended", params);
      await onCallEnded(params);
      setCallUUID(null);
    });

    return () => {
      RNCallKeep.removeEventListener("answerCall");
      RNCallKeep.removeEventListener("endCall");
    };
  }, [payload]);
  return callUUID;
}
