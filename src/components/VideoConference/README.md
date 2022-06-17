# VideoConference

This React component gives you access to a Programmable Video Conference with prebuilt UI.

## Example

Instantiating a Video Conference:

```jsx
import React from 'react';
import { VideoConference } from '@signalwire-community/react';

export default function App() {
  return (
    <VideoConference
      token="vpt_003ff4e88d9f...585925"
      userName='myUserName'
      prejoin={true}
      memberList={true}
      onRoomReady={(roomSession) => console.log("Raw room session object:", roomSession)}
      onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
      onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
    />
  );
}
```

Calling a method (e.g. for muting the mic):

```jsx
import React from 'react';
import { VideoConference } from '@signalwire-community/react';

export default function App() {

  const [roomSession, setRoomSession] = React.useState()

  return (
    <div>
      <VideoConference
        token="vpt_003ff4e88d9f...585925"
        onRoomReady={setRoomSession}
      />

      <button onClick={() => roomSession?.audioMute()}>Mute</button>
    </div>
  );
}
```