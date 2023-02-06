import 'react-native-get-random-values';
import React, { useState } from 'react';
import type * as SignalWire from '@signalwire/js';
import { Fabric } from '@signalwire-community/react';

import { registerGlobals } from 'react-native-webrtc';
import RemoteStream from '../RemoteStream';
registerGlobals();

interface IVideoNativeProps extends Fabric.IVideoProps {
  style: any;
}

export function Video({ style, onRoomReady, ...props }: IVideoNativeProps) {
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);

  return (
    <Fabric.CoreVideo
      {...props}
      onRoomReady={(r: SignalWire.Video.RoomSession) => {
        setRoomSession(r);
        onRoomReady?.(r);
      }}
      audio={props.audio ?? true}
      video={props.video ?? true}
    >
      <RemoteStream roomSession={roomSession ?? undefined} style={style} />
    </Fabric.CoreVideo>
  );
}
