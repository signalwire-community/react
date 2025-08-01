import 'react-native-get-random-values';
import React, { useState } from 'react';
import type * as SignalWire from '@signalwire/client';
import {
  __internal as Internal,
  IVideoProps,
} from '@signalwire-community/react';

import { registerGlobals } from 'react-native-webrtc';
import RemoteStream from '../RemoteStream';
registerGlobals();

interface IVideoNativeProps extends IVideoProps {
  style: any;
}

export default function Video({
  style,
  onRoomReady,
  ...props
}: IVideoNativeProps) {
  const [roomSession, setRoomSession] =
    useState<SignalWire.CallSession | any>(null);

  return (
    <Internal.Video.CoreVideo
      {...props}
      onRoomReady={(r: SignalWire.CallSession) => {
        setRoomSession(r);
        onRoomReady?.(r);
      }}
    >
      <RemoteStream roomSession={roomSession ?? undefined} style={style} />
    </Internal.Video.CoreVideo>
  );
}
