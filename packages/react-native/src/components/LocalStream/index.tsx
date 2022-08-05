import React, { useEffect, useState } from 'react';
import type * as SignalWire from '@signalwire/js';
import type { MediaStream } from 'react-native-webrtc';
import { RTCView } from 'react-native-webrtc';

type ILocalStreamProps = {
  style: any
} & ({
  roomSession: SignalWire.Video.RoomSession
} | {
  stream: MediaStream
} | {
  url: string
})
  
export default function Video({ style, ...params }: ILocalStreamProps) {

  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  // Extract the stream sources from the parameters.
  const roomSession = 'roomSession' in params ? params.roomSession : null
  const stream = 'stream' in params ? params.stream : null
  const url = 'url' in params ? params.url : null

  // Ensure only one of the stream sources is set.
  if ([roomSession, stream, url].filter(v => v !== null).length > 1) {
    throw new Error("Only one property among `roomSession`, `stream`, `url` can be set.")
  }

  useEffect(() => {
    if (roomSession) {
      const onJoined = () => {
        setStreamUrl((roomSession.localStream as any as MediaStream).toURL());
      }
  
      roomSession.on('room.joined', onJoined);
  
      return () => {
        setStreamUrl(null)
        roomSession.off('room.joined', onJoined)
      }

    } else if (stream) {
      setStreamUrl(stream.toURL())
      return () => {
        setStreamUrl(null)
      }

    } else if (url) {
      setStreamUrl(url)
      return () => {
        setStreamUrl(null)
      }

    } else {
      setStreamUrl(null)
      return () => {
        setStreamUrl(null)
      }
    }
  }, [roomSession, stream, url]);

  /* prettier-ignore */ /* @ts-expect-error */
  return <RTCView streamURL={streamUrl} style={{ width: '100%', aspectRatio: 16/9, ...style }} />
}