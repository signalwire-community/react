import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import type * as SignalWire from '@signalwire/js';
import type { MediaStream } from 'react-native-webrtc';
import { RTCView } from 'react-native-webrtc';

export type IBaseStreamProps = {
  style?: any;

  /** RoomSession from which to extract the stream. */
  roomSession?: SignalWire.Video.RoomSession;

  /**
   * This parameter defines which stream to extract.
   */
  streamSource: 'local' | 'remote';
};

function extractStreamUrl(
  roomSession: SignalWire.Video.RoomSession,
  streamSource?: 'local' | 'remote'
): string | null {
  const stream =
    streamSource === 'local'
      ? (roomSession.localStream as MediaStream | null | undefined)
      : (roomSession.remoteStream as MediaStream | null | undefined);

  return stream?.toURL() ?? null;
}

export default function BaseStream({
  style,
  roomSession,
  streamSource,
}: IBaseStreamProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (roomSession) {
      if (roomSession.active) {
        // The Room Session is already active, let's take the stream.
        setStreamUrl(extractStreamUrl(roomSession, streamSource));
      }

      // Let's subscribe to `room.joined`.
      const onJoined = () => {
        setStreamUrl(extractStreamUrl(roomSession, streamSource));
      };

      roomSession.on('room.joined', onJoined);

      return () => {
        setStreamUrl(null);
        roomSession.off('room.joined', onJoined);
      };
    } else {
      // No Room Session was provided.
      setStreamUrl(null);
      return () => {
        setStreamUrl(null);
      };
    }
  }, [roomSession, streamSource]);

  /* prettier-ignore */ /* @ts-expect-error */ /* eslint-disable-next-line react-native/no-inline-styles */
  return <RTCView streamURL={streamUrl} style={{ width: '100%', aspectRatio: 16 / 9, ...style }} />;
}
