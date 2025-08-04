import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as SignalWire from "@signalwire/client";
import { IVideoProps } from "./IVideoProps";
import { debounce } from "lodash";

export interface ICoreVideoProps extends IVideoProps {
  rootElement?: RefObject<HTMLElement>;
  children?: JSX.Element;
  onError?: () => void;
}

const CoreVideo: React.FC<ICoreVideoProps> = ({
  children,
  onRoomReady,
  onError,
  ...props
}) => {
  const [roomSession, setRoomSession] =
    useState<SignalWire.CallSession | null>(null);

  // This is used to access the current roomSession from useEffect without it
  // becoming a dependency.
  const roomSessionRef = useRef<SignalWire.CallSession | null>();
  roomSessionRef.current = roomSession;

  /**
   * Establish a new RoomSession connection
   */
  // prettier-ignore
  const setup = useCallback( /* eslint-disable-line react-hooks/exhaustive-deps */
    debounce(async (props: ICoreVideoProps) => {
      try {
        if (roomSessionRef.current) {
          await quitSession(roomSessionRef.current);
          setRoomSession(null);
          if (props.rootElement?.current?.innerHTML) {
            props.rootElement.current.innerHTML = "";
          }
        }

        const curRoomSession = new SignalWire.CallSession({
          token: props.token,
          rootElement: props.rootElement?.current ?? undefined,
          applyLocalVideoOverlay: props.applyLocalVideoOverlay,
          audio: props.audio,
          iceServers: props.iceServers,
          logLevel: props.logLevel,
          speakerId: props.speakerId,
          stopCameraWhileMuted: props.stopCameraWhileMuted,
          stopMicrophoneWhileMuted: props.stopMicrophoneWhileMuted,
          video: props.video,
        });
        setRoomSession(curRoomSession);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        curRoomSession.on("memberList.updated", () => {}); // Workaround for cloud-product/4681 (internal)
        onRoomReady?.(curRoomSession);
        await curRoomSession.join();

        return curRoomSession;
      } catch (error) {
        onError?.(error);
      }
    }, 100),
    []
  );

  useEffect(
    () => {
      try {
      setup(props);
    } catch (e) {
      console.error("Couldn't join room", e);
    }
      // prettier-ignore
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */, // changing the other props won't result in a rejoin
    [setup, props.token]
  );

  /** Cleanup when the component is unmounted */
  useEffect(() => {
    return () => {
      if (roomSessionRef.current) {
        quitSession(roomSessionRef.current);
        setRoomSession(null);
        if (props.rootElement?.current?.innerHTML) {
          props.rootElement.current.innerHTML = "";
        }
      }
    };
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  /**
   * Robust way for disconnecting a RoomSession
   */
  const quitSession = async (roomSession: SignalWire.CallSession) => {
    // Ensure the room is in a joined state first, since we don't have a way to
    // abort an in-progress join.
    try {
      await roomSession.join();
    } catch (e) {
      /* empty */
    }

    // Initiate disconnection
    try {
      roomSession.removeAllListeners();
      roomSession.on("room.joined", async () => {
        await roomSession?.leave();
        roomSession.destroy();
      });
      await roomSession.leave();
      roomSession.destroy();
    } catch (e) {
      console.log(e);
    }
  };

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
      if (roomSession && eventValue) {
        roomSession.on(eventName as any, eventValue);
      }

      return () => {
        if (roomSession && eventValue) {
          roomSession.off(eventName as any, eventValue);
        }
      };
    }, [roomSession, eventName, eventValue]);
  }

  return <>{children}</>;
};

export default CoreVideo;
