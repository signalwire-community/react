import { MutableRefObject, useEffect, useState } from "react";
import { Video } from "@signalwire/js";

interface IVideoRequiredProps {
  token: string;
}

interface IVideoOptionalProps {
  logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "silent";
  audio?: boolean;
  video?: boolean;
  children?: JSX.Element;
  rootElement?: MutableRefObject<HTMLElement | null>;
  onEvent?: (eventName: string, event: any) => void;
  onRoomJoined?: (
    room: Video.RoomSession,
    memberId: string,
    //details is of this format: https://developer2.signalwire.com/sdks/reference/browser-sdk/video/video-roomsession/#roomjoined
    details: any
  ) => void;
}

interface IVideoProps extends IVideoRequiredProps, IVideoOptionalProps {}

const VideoBase: React.FC<IVideoProps> = ({
  token,
  logLevel = "silent",
  audio = true,
  video = true,
  children,
  rootElement,
  onRoomJoined = () => {},
  onEvent = (eventName, event) => {
    console.log(eventName, event);
  },
}) => {
  let [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [roomSession, setRoomSession] = useState<Video.RoomSession | null>(
    null
  );
  useEffect(() => {
    if (setupComplete) return;
    setSetupComplete(true);
    let curRoomSession: Video.RoomSession | null = null;
    async function setup() {
      curRoomSession = new Video.RoomSession({
        token,
        rootElement: rootElement?.current ?? undefined,
        audio,
        video,
        logLevel,
      });
      setRoomSession(curRoomSession);
      (window as any).roomSession = curRoomSession; //expose room session for debugging

      curRoomSession.on("room.joined", (e) => {
        if (curRoomSession !== null)
          onRoomJoined(curRoomSession, (e as any).memberId, e);
      });

      // These events don't need special treatment yet
      [
        "layout.changed",
        "memberList.updated",

        "member.joined",
        "member.updated",
        "member.left",

        "playback.started",
        "playback.stopped",
        "playback.paused",

        "recording.started",
        "recording.ended",
        "recording.updated",

        "room.updated",
      ].forEach((eventName) => {
        curRoomSession?.on(eventName as any, (e) => onEvent(eventName, e));
      });

      await curRoomSession.join();
    }
    try {
      setup();
    } catch (e) {
      console.log("Couldn't join room", e);
    }

    return () => {
      try {
        curRoomSession?.leave();
      } catch (e) {
        console.log("The room wasn't joined yet.");
      }
    };
  }, [token, setupComplete]);
  return <>{children}</>;
};

export default VideoBase;
