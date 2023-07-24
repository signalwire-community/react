import 'react-native-get-random-values';
import React, { useState } from 'react';
import { SignalWire } from '@signalwire-community/react';
import type { Call, SignalWireContract } from './types';

import { registerGlobals } from 'react-native-webrtc';
import { RemoteStream } from '../components';
registerGlobals();

type CallEvents = {
  onCallReady?: (call: any) => void;
  onLayoutChanged?: (e: any) => void;
  onMemberJoined?: (e: any) => void;
  onMemberLeft?: (e: any) => void;
  onMemberTalking?: (e: any) => void;
  onMemberUpdated?: (e: any) => void;
  onMemberListUpdated?: (e: any) => void;
  onPlaybackEnded?: (e: any) => void;
  onPlaybackStarted?: (e: any) => void;
  onPlaybackUpdated?: (e: any) => void;
  onRecordingEnded?: (e: any) => void;
  onRecordingStarted?: (e: any) => void;
  onRecordingUpdated?: (e: any) => void;
  onRoomJoined?: (e: any) => void;
  onRoomLeft?: (e: any) => void;
  onRoomUpdated?: (e: any) => void;
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
