# Video

This React Native component lets you join and manage SignalWire Video rooms. To use this component, you need a Video Room Token obtained from the [REST API](https://developer.signalwire.com/apis/reference/create_room_token). This is different from a Video Conference Token.

## Example

Example usage:

```jsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Video } from '@signalwire-community/react-native';

export default function App() {
  return (
    <SafeAreaView>
      <Video
        token="eyJ0eXAiOiJWUlQiLCJj..."
        onRoomReady={(roomSession) =>
          console.log("Raw room session object:", roomSession)
        }
        onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
        onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
      />
    </SafeAreaView>
  );
};
```

Please refer to the [React Video Component](https://github.com/signalwire-community/react/blob/main/packages/react/src/components/Video/README.md) for additional examples.