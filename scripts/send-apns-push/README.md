# About this script

The `sendAPNSPush.sh` script will send a VoIP push notification to the iOS device specified in the `.env` file.

Use this script to test if your iOS app has been set up properly to receive the push the VoIP push notification.

First create a `.env` file with the values of `DEVICE_TOKEN`, `BUNDLE_ID` and `P12_CERT_LOCATION` set (you can start with the `env.sample` file
in this folder). The `DEVICE_TOKEN` will be the VoIP push token that your app receives when registering for VoIP push notification (which is different
from a push notification token).

To use, call `./sendAPNSPush.sh`. You should get a VoIP call on your test device if everything was set up properly.

**Your system's `curl` install has to be version `7.47.0` or higher to support HTTP/2.**
