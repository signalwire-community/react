import React, { useEffect, useRef } from "react";
import type * as SignalWire from "@signalwire/client";

export type IBaseStreamProps = {
  style?: any;

  /** If set, the stream is extracted from the RoomSession. */
  roomSession?: SignalWire.CallSession;

  /**
   * If extracting the stream from the RoomSession, this parameter defines which
   * stream to extract.
   */
  streamSource: "local" | "remote";
};

function extractStream(
  roomSession: SignalWire.CallSession,
  streamSource?: "local" | "remote"
): MediaStream | null {
  const stream: MediaStream | null | undefined =
    streamSource === "local"
      ? roomSession.localStream
      : roomSession.remoteStream;

  return stream ?? null;
}

export default function BaseStream({
  roomSession,
  streamSource,
  style,
}: IBaseStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    console.assert(
      !!video,
      "`videoRef.current` is null, this shouldn't happen."
    );
    if (!video) return;

    if (roomSession) {
      if (roomSession.active) {
        // The Room Session is already active, let's take the stream.
        video.srcObject = extractStream(roomSession, streamSource);
      }

      // Let's subscribe to `room.joined`.
      const onJoined = () => {
        video.srcObject = extractStream(roomSession, streamSource);
      };

      roomSession.on("room.joined", onJoined);

      return () => {
        video.srcObject = null;
        roomSession.off("room.joined", onJoined);
      };
    } else {
      // No Room Session was provided.
      video.srcObject = null;
      return () => {
        video.srcObject = null;
      };
    }
  }, [roomSession, streamSource]);

  return (
    <video
      ref={videoRef}
      autoPlay
      style={style}
    />
  );
}
