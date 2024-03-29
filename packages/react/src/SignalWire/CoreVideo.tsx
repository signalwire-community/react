import React, { RefObject, useCallback, useState } from "react";
import { Call, SignalWireContract } from "./types";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";

export type CallOptions = Parameters<SignalWireContract["dial"]>[0];

export interface IVideoProps
  extends Omit<CallOptions, "rootElement" | "token" | "to"> {
  onRoomReady?: (roomSession: Call) => void;
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

  client: SignalWireContract;
  address: any;
  audio: boolean;
  video: boolean;

  children: React.ReactNode;
  rootElement?: RefObject<HTMLElement>;
}

export function CoreVideo({ ...props }: IVideoProps) {
  const [call, setRoomSession] = useState<Call | null>(null);

  // This is used to access the current roomSession from useEffect without it
  // becoming a dependency.
  const roomSessionRef = useRef<Call | null>();
  roomSessionRef.current = call;

  /**
   * Establish a new RoomSession connection
   */
  // prettier-ignore
  const setup = useCallback(
    /* eslint-disable-line react-hooks/exhaustive-deps */
    debounce(async (props: IVideoProps) => {
      if (roomSessionRef.current) {
        await quitSession(roomSessionRef.current);
        setRoomSession(null);
        if (props.rootElement?.current?.innerHTML) {
          props.rootElement.current.innerHTML = "";
        }
      }

      const currentCall = await props.client.dial({
        to: props.address.channels.video,

        // @ts-expect-error undefined is not assignable to rootElement
        // rootElement: props.rootElement?.current ?? undefined,
        debugLevel: "debug",
      });
      roomSessionRef.current = currentCall;
      setRoomSession(currentCall);

      // @ts-expect-error current call isn't described yet
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      currentCall.on("memberList.updated", () => {}); // Workaround for cloud-product/4681 (internal)

      props.onRoomReady?.(currentCall);

      // @ts-expect-error Property 'start' does not exist on type '{}'.
      await currentCall?.start();

      return currentCall;
    }, 100),
    []
  );

  /**
   * Robust way for disconnecting a RoomSession
   */
  const quitSession = async (call: Call) => {
    // Ensure the room is in a joined state first, since we don't have a way to
    // abort an in-progress join.
    try {
      await call.join();
    } catch (e) {
      /* empty */
    }

    // Initiate disconnection
    try {
      call.removeAllListeners();
      call.on("room.joined", async () => {
        await call?.leave();
        call.destroy();
      });
      await call.leave();
      call.destroy();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(
    () => {
      if (props.client === null) return;
      try {
      setup(props);
    } catch (e) {
      console.error("Couldn't join room", e);
    }
      // prettier-ignore
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */, // changing the other props won't result in a rejoin
    [setup, props.client, props.address.channels.video]
  );

  const eventMap = {
    "layout.changed": props.onLayoutChanged ?? null,
    "member.joined": props.onMemberJoined ?? null,
    "member.left": props.onMemberLeft ?? null,
    "member.talking": props.onMemberTalking ?? null,
    "member.updated": props.onMemberUpdated ?? null,
    "memberList.updated": props.onMemberListUpdated ?? null,
    "playback.ended": props.onPlaybackEnded ?? null,
    "playback.started": props.onPlaybackStarted ?? null,
    "playback.updated": props.onPlaybackUpdated ?? null,
    "recording.ended": props.onRecordingEnded ?? null,
    "recording.started": props.onRecordingStarted ?? null,
    "recording.updated": props.onRecordingUpdated ?? null,
    "room.joined": props.onRoomJoined ?? null,
    "room.left": props.onRoomLeft ?? null,
    "room.updated": props.onRoomUpdated ?? null,
  };

  for (const [eventName, eventValue] of Object.entries(eventMap)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (call && eventValue) {
        call.on(eventName as any, eventValue);
      }

      return () => {
        if (call && eventValue) {
          call.off(eventName as any, eventValue);
        }
      };
    }, [call, eventName, eventValue]);
  }

  return <>{props.children}</>;
}
