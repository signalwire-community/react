import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { RTCView } from 'react-native-webrtc';
import type { MediaStream } from 'react-native-webrtc';
import type * as SignalWire from '@signalwire/js';
import { __internal as Internal, IVideoProps } from '@signalwire-community/react'

import { registerGlobals } from 'react-native-webrtc';
registerGlobals();

interface IVideoNativeProps extends IVideoProps {
  style: any;
}

export default function Video({ token, style }: IVideoNativeProps) {
  // TODO: useStream Hook
  const [roomSession, setRoomSession] = useState<SignalWire.Video.RoomSession | null>(
    null
  );
  const [_, setLocalStream] = useState<string | null>(null);
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
      onRoomReady={(r: SignalWire.Video.RoomSession) => {
        setRoomSession(r);
      }}
      token={token}
    >
      <RTCViewHack streamURL={remoteStream} style={{ width: '100%', aspectRatio: 16/9, ...style }} />
    </Internal.Video.CoreVideo>
  );
}
