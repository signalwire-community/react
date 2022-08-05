import React, { useEffect, useState } from 'react';
import type * as SignalWire from '@signalwire/js';
import type { MediaStream } from 'react-native-webrtc';
import { RTCView } from 'react-native-webrtc';

export type ILocalStreamProps = {
  style?: any;

  /** If set, the stream is extracted from the RoomSession. */
  roomSession?: SignalWire.Video.RoomSession;

  /**
   * If extracting the stream from the RoomSession, this parameter defines which
   * stream to extract.
   */
  streamSource?: 'local' | 'remote';

  /** If set, the provided url is used as a source for the stream. */
  url?: string;
};

export default function BaseStream({ style, ...params }: ILocalStreamProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  // Extract the stream sources from the parameters.
  const roomSession = 'roomSession' in params ? params.roomSession : null;
  const streamSource = 'streamSource' in params ? params.streamSource : null;
  const url = 'url' in params ? params.url : null;

  // Ensure only one of the stream sources is set.
  if (roomSession && url) {
    throw new Error(
      'Only one property among `roomSession` and `url` can be set.'
    );
  }

  useEffect(() => {
    if (roomSession) {
      const onJoined = () => {
        const stream =
          streamSource === 'local'
            ? roomSession.localStream
            : roomSession.remoteStream;
        setStreamUrl((stream as any as MediaStream)?.toURL());
      };

      roomSession.on('room.joined', onJoined);

      return () => {
        setStreamUrl(null);
        roomSession.off('room.joined', onJoined);
      };
    } else {
      setStreamUrl(url ?? null);
      return () => {
        setStreamUrl(null);
      };
    }
  }, [roomSession, url]);

  /* prettier-ignore */ /* @ts-expect-error */
  return <RTCView streamURL={streamUrl} style={{ width: '100%', aspectRatio: 16/9, ...style }} />
}
