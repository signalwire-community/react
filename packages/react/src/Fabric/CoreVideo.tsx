import React, { RefObject } from "react";
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

  children: React.ReactNode;
  rootElement?: RefObject<HTMLElement>;
}

export function CoreVideo({
  client,
  address,
  audio = true,
  video = true,
  children,
  ...props
}: IVideoProps) {
  let roomSessionRef = useRef<null | Video.RoomSession>(null);
  useEffect(() => {
    if (
      client === null ||
      address === null ||
      address?.channels?.video === null
    )
      return;
    (async () => {
      const call = await client.createCall({
        uri: address.channels.video,

        // @ts-expect-error
        rootElement: props.rootElement?.current ?? undefined,
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

  return <>{children}</>;
}
