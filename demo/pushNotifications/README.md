# Fabric Push Notification Demo

This project demonstrates the SignalWire Fabric platform's VoIP call feature. This React Native
app can receive and connect to VoIP push notifications from Fabric.

## To run this demo:

1. Run `npm install` and `npm run build` from the root of this repo and ensure that all packages build successfully.

### Setting up Fabric in your space

2. Install the Fabric application in your SignalWire space. You might have to contact SignalWire support
   for this step. Note the `OAuth application ID` and `secret`, as well as your `Redirect URI`.

3. Create at least one subscriber in the Fabric application using the REST API:

```
curl --location --request POST 'https://<space>.signalwire.com/api/fabric/subscribers' \
  -u '<project_id>:<api_token>' \
  --header 'Content-Type: application/json' \
  --data-raw '{"email": "johnd@example.com (to be used when logging in via OAuth flow)",
    "password": "<password (to be used when logging in via OAuth flow)>",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John",
    "job_title": "Writer",
    "time_zone": "EST",
    "country": "US",
    "region": "East",
    "company_name": "Example"
  }'
```

4. Confirm that you can get an access token from the Fabric application using the `scripts/refresh-fabric-tokens`
   script in this repo. The `OAuth application ID` and `Redirect URI` noted in step #2 needs to be placed in the
   `.env` file as per the `env.sample` file.

### iOS setup

5. From your Apple developer account, create a new [Bundle ID](https://developer.apple.com/account/resources/identifiers/)
   with the Push Notification capability enabled.

6. Next, create a new [VoIP services certificate](https://developer.apple.com/account/resources/certificates/list).
   You will be asked to upload a Certificate Signing Request(CSR) which you can generate from the Keychain Access
   app. Download the certificate and add it to Keychain Access.

7. Run `pod install` in the `ios` directory.

8. Open the `ios` directory in Xcode. In the Signing and Capabilities tab, connect the Bundle ID to
   the one you set up in the Apple developer account. Ensure that the capabilities Push Notifications,
   and the Voice over IP Background mode are enabled.

9. Build and run the app from Xcode in a real device (that you have already
   [registered](https://developer.apple.com/account/resources/devices/list) in the developer dashboard)

10. If all went well, you should see a "Token received <token>" log in the Metro console.
    Use the `scripts/send-apns-push.sh` script to check if your device can receive VoIP calls. When
    setting up the `.env` variables for the script, use the token received in the Metro console. The
    VoIP service certificate is expected in the P12 format, which you can get by locating the
    certificate in the Keychain Access app, and exporting it in P12 format. Calling the script with
    the `.env` variables properly set should cause the phone to ring (it's okay if it throws an
    error after the ring for now).

### Android setup

11. Create a new Firebase project. Add a new app and download the generated `google-services.json` file.
    Place it in the `android/app` folder.

12. Run the android app on a real device with `npm run android`. You might need to use Android Studio's
    Device Manager to ensure your physical device is connected and ready to be used. On first launch,
    the app will ask to be enabled as a Calling Account. Make sure you follow the directions to enable
    it. You should see a "Token received <token>" log in the Metro console. From the Firebase messaging
    dashboard, you can send a test message to the token you received in the console. You should get a
    "Notification Received" log in the console.

### AWS SNS setup

13. Fabric uses Amazon Web Service's Simple Messaging Service to send VoIP notifications for both Android
    and iOS. To set it up, log in to your AWS dashboard, and navigate to the SNS platform.

14. For iOS, create a new push notification Platform Application. Select the "Apple iOS, VoIP, MacOS"
    platform and the VoIP push service. Upload the Voip service certificate in p12 format as described
    in step #10. Check the "Used for development in sandbox" option.

15. For the Android app, create another push notification Platform Application. Select the "Firebase
    Cloud Messaging (FCM)" platform. You will be asked to input the FCM API key, which can be found
    at the Firebase project settings under Cloud Messaging tab. To get the API key, you might have to
    explicitly enable "Cloud Messaging API (Legacy)".

16. For both the iOS and Android platform applications, note the platform ARNs and configure your
    Fabric application to use them. You might have to ask Signalwire support to do this step for your
    Fabric installation.

### Making the call

With all the set up, we can make a real VoIP call.

17. You can use the [Call Fabric Demo](https://signalwire.github.io/signalwire-js/main/src/fabric/) to
    create a call. It expects an access token, a host and an address to call to. You can leave the host
    field blank to use the default host.

18. Generate a new token using `scripts/refresh-fabric-token`. Paste the token in the SAT field. Also set
    the token in the `CallHandler/index.js` file.

19. To start with, try calling your own Fabric address (to rule out any permission or access errors).
    You can find your address at `<your_space>.signalwire.com/resources`. In the table, look for an entry
    with Resource field set to the display name you assigned in step #3, and the Resource Type "Subscriber".
    Click on that resource, and find the address (something like `private/name-HA5h`).

20. With the fields set in the Call Fabric Demo, click Connect. Your device should receive a call. On first run,
    it might also ask for the usual Camera and Microphone permissions. You should see the web feed from your
    browser on your phone and the one from your phone on your browser

## Brief explainer

The SignalWire Fabric platform can be configured to send push notifications to a subscriber that is being called.
When a device receives the push notification, it should make the device ring, and connect to the SignalWire server.
If the call is answered, it should notify the server and set up the audio/video feed. This app provides a code
example for how that might be done.

We are using the SignalWire community React Native library to handle SignalWire related functions. For this app,
a SignalWire client will be initiated to handle the connection to Fabric.

```js
import { useSignalWire } from "@signalwire-community/react-native";

// Initialize the SignalWire client. The TOKEN from `scripts/refresh-fabric-tokens`
// also identifies the Fabric subscriber for whom this client is being created.

const client = useSignalWire({ token: TOKEN });
```

We use [react-native-notifications](https://github.com/wix/react-native-notifications) on Android and
[react-native-voip-push-notifications](https://github.com/react-native-webrtc/react-native-voip-push-notification) on iOS to deal with
registering to receive push notifications, getting the device token and subscribing to relevant notification events.
We are using separate libraries because iOS treats VoIP notifications differently to regular push notifications.
The code in `CallHandler/lib/useVoipPush.(ios/android).js` deals with the different libraries and exposes
the `useVoipPush` hook.

The device token authorizes a service to send push notifications to that particular device. This token will need
to be sent to Fabric so a subscriber is linked to specific device tokens.

```js
async function onTokenReceived(token) {
  const registrationInfo = await client?.registerDevice({
    deviceToken: token,
  });
}
```

We use the [React Native Callkeep](https://github.com/react-native-webrtc/react-native-callkeep) library to
ring the phone and show the call UI that the OS provides. Callkeep hides the different native APIs (CallKit
on iOS and ConnectionService on Android) and exposes a simple javascript interface to handle calls.
The `useCallKeep` hook at `CallHandler/lib/useCallKeep.js` registers to the relevant CallKeep events.

Both the `useVoipPush` and the `useCallKeep` hook are used in the `useHandlePNInvite` hook, which

1. registers the device to Fabric once a device token has been received
2. uses `client.handlePushNotification` method to connect to SignalWire once a notification is received, and gets a `Call` object
3. uses `Call.answer` method to start the call if the call is answered by user, otherwise `Call.hangupAll` to
   reject the call on all devices that are being ringed (if a subscriber has multiple registered devices).

Once the call has been established, we simply show an `RTCView` with the stream:

```jsx
<RTCView streamURL={call?.remoteStream?.toURL()} />
<Button
  title="End call"
  onPress={() => {
    // this triggers an event in useCallKeep,
    // which will hang up the active call before
    // removing the system UI for the call.
    RNCallKeep.endCall(callUUID);
  }}
></Button>
```

_NOTE: the Fabric interface is still in active development so expect things to change fast._
