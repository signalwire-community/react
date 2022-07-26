// import 'react-native-get-random-values';
// import React, { useEffect, useRef, useState } from 'react';
// import { Text, View } from 'react-native';
// import { Video } from '@signalwire/js';
// import { RTCView } from 'react-native-webrtc';
// import type { MediaStream } from 'react-native-webrtc';
// import { __internal as Internal } from '@signalwire-community/react';
// import type { IVideoProps } from '@signalwire-community/react';

// export default function VideoNative({ token }: IVideoProps) {
//   // TODO: useStream Hook
//   const ref = useRef<any>(null);
//   const [roomSession, setRoomSession] = useState<Video.RoomSession>();
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   useEffect(() => {
//     roomSession?.on('room.joined', () => {
//       setStream((roomSession?.remoteStream as any as MediaStream) ?? null);
//     });
//   }, [roomSession]);
//   return (
//     <Internal.Video.CoreVideo
//       onRoomReady={(r: Video.RoomSession) => setRoomSession(r)}
//       token={token}
//     >
//       <View ref={ref}>
//         {stream !== null && <RTCView streamURL={stream?.toURL()} />}
//       </View>
//     </Internal.Video.CoreVideo>
//   );
// }

import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { __internal as Internal } from '@signalwire-community/react';
import type { IVideoProps } from '@signalwire-community/react';
import type { MediaStream } from 'react-native-webrtc';
import { Video } from '@signalwire/js';

interface IVideoNativeProps extends IVideoProps {
  style: CSSStyleDeclaration;
}

export default function VideoNative({ token }: IVideoNativeProps) {
  // TODO: useStream Hook
  const [roomSession, setRoomSession] = useState<Video.RoomSession | null>(
    null
  );
  const [localStream, setLocalStream] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<string | null>(null);

  useEffect(() => {
    if (roomSession === null) return;
    roomSession.on('room.joined', () => {
      console.log(
        'Room was joined. Webrtc:',
        (roomSession.remoteStream as any as MediaStream)?.toURL()
      );
      setRemoteStream(
        (roomSession?.remoteStream as any as MediaStream).toURL()
      );
      setLocalStream((roomSession?.localStream as any as MediaStream).toURL());
    });
  }, [roomSession]);

  function RTCViewHack(props: any) {
    return <RTCView {...props} />;
  }

  return (
    <Internal.Video.CoreVideo
      onRoomReady={(r: Video.RoomSession) => {
        setRoomSession(r);
      }}
      token={token}
    >
      <View style={{ flex: 1 }}>
        <RTCViewHack streamURL={remoteStream} style={{ flex: 1 }} />
      </View>
    </Internal.Video.CoreVideo>
  );
}
