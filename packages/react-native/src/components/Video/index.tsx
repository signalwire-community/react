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

export default function Video({ style, onRoomReady, ...props }: IVideoNativeProps) {
  // TODO: useStream Hook
  const [roomSession, setRoomSession] = useState<SignalWire.Video.RoomSession | null>(null);

  // TODO: Expose the local stream
  const [_, setLocalStream] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<string | null>(null);

  useEffect(() => {
    if (roomSession === null) return;

    const onJoined = () => {
      setRemoteStream((roomSession.remoteStream as any as MediaStream).toURL());
      setLocalStream((roomSession.localStream as any as MediaStream).toURL());
    }

    roomSession.on('room.joined', onJoined);

    return () => {
      roomSession.off('room.joined', onJoined)
    }
  }, [roomSession]);

  return (
    <Internal.Video.CoreVideo
      {...props}
      onRoomReady={(r: SignalWire.Video.RoomSession) => {
        setRoomSession(r);
        onRoomReady?.(r)
      }}
    >
      {/* @ts-expect-error */}
      <RTCView streamURL={remoteStream} style={{ width: '100%', aspectRatio: 16/9, ...style }} />
    </Internal.Video.CoreVideo>
  );
}
