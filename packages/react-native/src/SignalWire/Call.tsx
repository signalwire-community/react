import 'react-native-get-random-values';
import React, { useState } from 'react';
import { SignalWire } from '@signalwire-community/react';
import type { Call as CallType, SignalWireContract } from './types';
import { registerGlobals } from 'react-native-webrtc';
import { RemoteStream } from '../components';

registerGlobals();

type MemberState = {
  id: string;
  name: string;
  isMuted: boolean;
  isTalking: boolean;
  hasHandRaised: boolean;
};

type CallEvents = {
  onCallReady?: (call: any) => void;
};

interface CallParams extends CallEvents {
  client: SignalWireContract;
  address: any;
  hideVideo: boolean;
  style?: any;
  audio: boolean;
  video: boolean;
  onError?: any;
  onPositionsUpdated?: (positions: Record<string, { x: number; y: number; width: number; height: number }>) => void;
}

export function Call({ style, onCallReady, hideVideo, onPositionsUpdated, ...props }: CallParams) {
  const [callHandle, setCallHandle] = useState<CallType | null>(null);
  const [memberStates, setMemberStates] = useState<Record<string, MemberState>>({});
  const [userPositions, setUserPositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const updateMemberState = (member: any) => {
    setMemberStates((prev) => ({
      ...prev,
      [member.id]: {
        id: member.id,
        name: member.name,
        isMuted: member.audio_muted,
        isTalking: member.talking || false,
        hasHandRaised: member.handraised || false,
      },
    }));
  };

  return (
    <SignalWire.CoreVideo
      onRoomReady={(r: CallType) => {
        setCallHandle(r);
        onCallReady?.(r);
      }}
      onMemberUpdated={(e) => {
        updateMemberState(e.member);
      }}
      onError={(err) => {
        props?.onError?.(err);
      }}
      onLayoutChanged={(e) => {
        if (e.layout?.layers) {
          const positions = e.layout.layers.reduce((acc: any, layer: any) => {
            if (layer.member_id !== undefined && layer.visible) {
              acc[layer.member_id] = {
                x: layer.x,
                y: layer.y,
                width: layer.width,
                height: layer.height,
              };
            }
            return acc;
          }, {});
          setUserPositions(positions);
          onPositionsUpdated?.(positions);
        }
        setRefreshKey((prevKey) => prevKey + 1);
      }}
        
      {...props}
    >
      {!hideVideo && (
        <RemoteStream
          key={refreshKey}
          roomSession={callHandle ?? undefined}
          style={style}
          memberStates={memberStates} 
          userPositions={userPositions}
          address={props?.address}
        />
      )}
    </SignalWire.CoreVideo>
  );
}