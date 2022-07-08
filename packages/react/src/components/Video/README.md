# Video

This React component lets you join and manage SignalWire Video rooms. To use this component, you need a Video Room Token obtained from the [REST API](https://developer.signalwire.com/apis/reference/create_room_token). This is different from a Video Conference Token.

## Example

Example usage:

```jsx
import React from "react";
import { Video } from "@signalwire-community/react";

export default function App() {
  return (
    <Video
      token="eyJ0eXAiOiJWUlQiLCJj..."
      onRoomReady={(roomSession) =>
        console.log("Raw room session object:", roomSession)
      }
      onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
      onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
    />
  );
}
```

Calling a method (e.g. for muting the mic):

```jsx
import React from "react";
import { VideoConference } from "@signalwire-community/react";

export default function App() {
  const [roomSession, setRoomSession] = React.useState();

  return (
    <div>
      <Video
        token="eyJ0eXAiOiJWUlQiLCJj..."
        onRoomReady={(roomSession) =>
          console.log("Raw room session object:", roomSession)
        }
      />

      <button onClick={() => roomSession?.audioMute()}>Mute</button>
    </div>
  );
}
```
