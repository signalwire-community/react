import 'react-native-get-random-values';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, SafeAreaView } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { __internal as Internal } from '@signalwire-community/react';
import type { IVideoProps } from '@signalwire-community/react';

interface IVideoNativeProps extends IVideoProps {
  style: CSSStyleDeclaration;
}

export default function VideoNative({ token }: IVideoNativeProps) {
  // TODO: useStream Hook
  const [roomSession, setRoomSession] = useState();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    roomSession?.on('room.joined', () => {
      console.log(
        'Room was joined. Webrtc:',
        roomSession?.remoteStream.toURL()
      );
      setRemoteStream(roomSession?.remoteStream.toURL());
      setLocalStream(roomSession?.localStream.toURL());
    });
  }, [roomSession]);

  function RTCViewHack(props: any) {
    return <RTCView {...props} />;
  }

  return (
    <Internal.Video.CoreVideo
      onRoomReady={(r) => {
        setRoomSession(r);
      }}
      token={token}
    >
      <View style={{ flex: 1 }}>
        <RTCViewHack streamURL={remoteStream} style={{ flex: 1 }} />
        <RTCViewHack streamURL={localStream} style={{ flex: 1 }} />
      </View>
    </Internal.Video.CoreVideo>
  );
}
