import 'react-native-get-random-values';
import React, { useState } from 'react';
import { SignalWire } from '@signalwire-community/react';
import type { Call, SignalWireContract } from './types';

import { registerGlobals } from 'react-native-webrtc';
import { RemoteStream } from '../components';
registerGlobals();

type CallEvents = {
  onCallReady?: (call: any) => void;
};

interface CallParams extends CallEvents {
  client: SignalWireContract;
  address: any;
  hideVideo: boolean;
  style: any;
}

export function Video({ style, onCallReady, hideVideo, ...props }: CallParams) {
  const [callHandle, setCallHandle] = useState<Call | null>(null);

  return (
    <SignalWire.CoreVideo
      {...props}
      onRoomReady={(r: Call) => {
        setCallHandle(r);
        onCallReady?.(r);
      }}
      audio={true}
      video={true}
    >
      {!hideVideo && (
        <RemoteStream roomSession={callHandle ?? undefined} style={style} />
      )}
    </SignalWire.CoreVideo>
  );
}
