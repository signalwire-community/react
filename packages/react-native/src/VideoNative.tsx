import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import CoreVideo from './CoreVideo';
import type { IVideoProps } from './IVideoProps';
import type { MediaStream } from 'react-native-webrtc';
import type { Video } from '@signalwire/js';

// import { registerGlobals } from 'react-native-webrtc';
// registerGlobals();

interface IVideoNativeProps extends IVideoProps {
  style: any;
}

export default function VideoNative({ token }: IVideoNativeProps) {
  // TODO: useStream Hook
  const [roomSession, setRoomSession] = useState<Video.RoomSession | null>(
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
    <CoreVideo
      onRoomReady={(r: Video.RoomSession) => {
        setRoomSession(r);
      }}
      token={token}
    >
      <View style={{ flex: 1 }}>
        <RTCViewHack streamURL={remoteStream} style={{ flex: 1 }} />
        <Text>{remoteStream}</Text>
      </View>
    </CoreVideo>
  );
}
