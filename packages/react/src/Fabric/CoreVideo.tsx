import React, { useState } from "react";
import { Fabric, Video } from "@signalwire/js";
import { useEffect, useRef } from "react";

export type RoomSessionOptions = ConstructorParameters<Video.RoomSession>[0];
export interface IVideoProps
  extends Omit<RoomSessionOptions, "rootElement" | "token"> {
  onRoomReady?: (roomSession: Video.RoomSession) => void;
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

  client: Fabric.Client;
  address: any;
  audio: boolean;
  video: boolean;
}

export function CoreVideo({
  client,
  address,
  audio = true,
  video = true,
  ...props
}: IVideoProps) {
  let roomSessionRef = useRef<null | Video.RoomSession>(null);
  let ref = useRef<any>(null);
  useEffect(() => {
    if (client === null || ref.current === null) return;
    if (address === null || address?.channels?.video === null) return;
    (async () => {
      const call = await client.createCall({
        uri: address.channels.video,
        rootElement: ref.current,
      });
      roomSessionRef.current = call;
      //@ts-expect-error
      await call.start({
        audio,
        video,
        applyLocalVideoOverlay: props.applyLocalVideoOverlay,
        iceServers: props.iceServers,
        logLevel: props.logLevel,
        speakerId: props.speakerId,
        stopCameraWhileMuted: props.stopCameraWhileMuted,
        stopMicrophoneWhileMuted: props.stopMicrophoneWhileMuted,
      });
    })();
  }, [client, address]);

  return <div ref={ref}></div>;
}
