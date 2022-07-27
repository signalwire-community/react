# WebRTC Example

Uses `react-native-webrtc` in a custom [Expo Dev Client](https://docs.expo.dev/clients/introduction/) (not available in Expo Go).

This has been initialized with

```sh
npx create-react-native-app -t with-webrtc
```

## How to build and run locally

- [Setup development Environment](https://reactnative.dev/docs/environment-setup)
- 🍎 Build/Run on iOS `npm run ios`.
  - WebRTC doesn't work in the iOS Simulator since there is no camera. Run `expo run:ios -d` to select a connected iOS device.
- 🤖 Build/Run on Android `npm run android`.

## 📝 Notes

- [React Native WebRTC](https://github.com/react-native-webrtc/)
- [Expo Config Plugin: WebRTC](https://github.com/expo/config-plugins/tree/master/packages/react-native-webrtc)
- [Expo Development Client docs](https://docs.expo.dev/clients/introduction/)
