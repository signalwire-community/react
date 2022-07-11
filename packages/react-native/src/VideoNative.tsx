import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Video } from '@signalwire/js';
import { RTCView } from 'react-native-webrtc';
import { __internal as Internal } from '@signalwire-community/react';
import type { IVideoProps } from '@signalwire-community/react';

export default function VideoNative({ token }: IVideoProps) {
  // TODO: useStream Hook
  const ref = useRef<any>(null);
  const [roomSession, setRoomSession] = useState<Video.RoomSession>();
  const [stream, setStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    roomSession?.on('room.joined', () => {
      setStream(roomSession?.remoteStream ?? null);
    });
  }, [roomSession]);
  return (
    <Internal.Video.CoreVideo
      onRoomReady={(r) => setRoomSession(r)}
      token={token}
    >
      <View ref={ref}>
        {stream !== null && <RTCView streamURL={stream?.toURL()}></RTCView>}
      </View>
    </Internal.Video.CoreVideo>
  );
}
