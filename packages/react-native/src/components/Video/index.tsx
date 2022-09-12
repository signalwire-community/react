import 'react-native-get-random-values';
import React, { useState } from 'react';
import type * as SignalWire from '@signalwire/js';
import { __internal as Internal, IVideoProps } from '@signalwire-community/react';

import { registerGlobals } from 'react-native-webrtc';
import RemoteStream from '../RemoteStream';
registerGlobals();

interface IVideoNativeProps extends IVideoProps {
  style: any;
}

export default function Video({ style, onRoomReady, ...props }: IVideoNativeProps) {
  const [roomSession, setRoomSession] = useState<SignalWire.Video.RoomSession | null>(null);

  return (
    <Internal.Video.CoreVideo
      {...props}
      onRoomReady={(r: SignalWire.Video.RoomSession) => {
        setRoomSession(r);
        onRoomReady?.(r);
      }}
    >
      <RemoteStream roomSession={roomSession ?? undefined} style={style} />
    </Internal.Video.CoreVideo>
  );
}
