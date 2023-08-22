import { Notifications } from "react-native-notifications";
import { useState, useEffect } from "react";
import RNCallKeep from "react-native-callkeep";

Notifications.registerRemoteNotifications();

// This hook handles receiving the push notification token
// (providing a callback to send the token to your server once received),
// and receiving notifications.
// For Andriod it uses the library `react-native-notifications`

export default function useVoipPush(
  onTokenReceived,
  onPayloadReceived,
  client
) {
  const [payload, setPayload] = useState(null);
  RNCallKeep.setAvailable(true);

  useEffect(() => {
    if (client === null) return;

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log("Token Received", event.deviceToken);
      onTokenReceived(event.deviceToken);
    });
    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event) => {
        console.error(event);
      }
    );

    function onNotificationReceived(notification, completion) {
      console.log("Notification Received - Foreground", notification);
      const corePayload = JSON.parse(
        notification.payload["gcm.notification.body"]
      );
      const payload = {
        notification: {
          body: notification.payload["gcm.notification.body"],
        },
      };
      onPayloadReceived(payload);
      console.log("Payload parsed:", payload);
      RNCallKeep.displayIncomingCall(
        corePayload.notification_uuid,
        corePayload.incoming_caller_id,
        corePayload.incoming_caller_name
      );

      setPayload(payload);

      completion({ alert: true, sound: true, badge: false });
    }
    const fgEventHandle =
      Notifications.events().registerNotificationReceivedForeground(
        onNotificationReceived
      );

    const bgEventHandle =
      Notifications.events().registerNotificationReceivedBackground(
        onNotificationReceived
      );
    return () => {
      fgEventHandle.remove();
      bgEventHandle.remove();
    };
  }, [client]);

  return payload;
}
