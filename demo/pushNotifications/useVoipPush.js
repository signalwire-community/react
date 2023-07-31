import VoipPushNotification from "react-native-voip-push-notification";
import { useState, useEffect } from "react";

export default function useVoipPush(onTokenReceived, client) {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (client === null) return;

    VoipPushNotification.addEventListener("register", (token) => {
      console.log("Token received", token);
      onTokenReceived(token);
    });

    VoipPushNotification.addEventListener("notification", (notification) => {
      console.log(notification, "notification received");
      setPayload(notification);
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
          onTokenReceived(data);
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
  return payload;
}
