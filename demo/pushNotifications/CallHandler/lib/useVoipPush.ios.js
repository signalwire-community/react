import VoipPushNotification from "react-native-voip-push-notification";
import { useState, useEffect } from "react";

// This hook handles receiving the push notification token
// (providing a callback to send the token to your server once received),
// and receiving notifications.
// For iOS it uses the library `react-native-voip-push-notification`

export default function useVoipPush(
  onTokenReceived,
  onPayloadReceived,
  client
) {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    if (client === null) return;

    function processToken(token) {
      console.log("Token received", token);
      onTokenReceived(token);
    }
    function processNotification(notification) {
      console.log(notification, "notification received");
      onPayloadReceived(notification);
      setPayload(notification);
    }

    VoipPushNotification.addEventListener("register", processToken);

    VoipPushNotification.addEventListener("notification", processNotification);

    VoipPushNotification.addEventListener("didLoadWithEvents", (events) => {
      if (!events || !Array.isArray(events) || events.length < 1) {
        return;
      }
      for (let voipPushEvent of events) {
        let { name, data } = voipPushEvent;
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
        ) {
          processToken(data);
        } else if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          processNotification(data);
        }
      }
    });

    VoipPushNotification.registerVoipToken();

    return () => {
      VoipPushNotification.removeEventListener("didLoadWithEvents");
      VoipPushNotification.removeEventListener("register");
      VoipPushNotification.removeEventListener("notification");
    };
  }, [client]);
  return payload;
}
