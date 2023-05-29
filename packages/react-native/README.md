# @signalwire-community/react-native

[![@signalwire-community/react](https://img.shields.io/npm/v/@signalwire-community/react-native)](https://www.npmjs.com/package/@signalwire-community/react-native)

Collection of unofficial React Native components and tools for [SignalWire](https://signalwire.com).

> ⚠️ Disclaimer:
>
> The libraries in this repository are NOT supported by SignalWire.

## Preparing the environment

The SignalWire library for React Native uses native components. You can use this library with Expo. However, since Expo Go doesn't currently bundle WebRTC, you need to use an [Expo Dev Client](https://docs.expo.dev/clients/introduction/).

### If you are starting from scratch

If you are setting up a new application, we suggest to get started by initializing your application with the [WebRTC template](https://github.com/expo/examples/tree/master/with-webrtc) for create-react-native-app:

```
npx create-react-native-app -t with-webrtc
```

This will allow you to use the SignalWire Video component within an [Expo Dev Client](https://docs.expo.dev/clients/introduction/).

### If you already have an Expo or Bare Workflow app

Please follow the [instructions to enable WebRTC](https://github.com/expo/config-plugins/tree/main/packages/react-native-webrtc) in an [Expo Dev Client](https://docs.expo.dev/clients/introduction/).

## Installation

```bash
npm install @signalwire-community/react-native react-native-get-random-values @react-native-async-storage/async-storage
npx pod-install
```

> 💡 If you use the Expo managed workflow you will see "CocoaPods is not supported in this project" - this is fine, it's not necessary.

## Usage

Import and use the component, for example:

```jsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Video } from '@signalwire-community/react-native';

export default function App() {
  return (
    <SafeAreaView>
      <Video token="<Your SignalWire Room Token>" />
    </SafeAreaView>
  );
}
```

## Supported components

- [`<LocalStream>`](https://github.com/signalwire-community/react/tree/main/packages/react-native/src/components/LocalStream)
- [`<RemoteStream>`](https://github.com/signalwire-community/react/tree/main/packages/react-native/src/components/RemoteStream)
- [`<Video>`](https://github.com/signalwire-community/react/tree/main/packages/react-native/src/components/Video)
