import React from "react";
import type * as SignalWire from "@signalwire/js";

type CoreVideoConferenceProps = {
  onRoomReady?: (roomSession: SignalWire.Video.RoomSession) => void;
  token: string;
  userName?: string;
  theme?: "light" | "dark" | "auto";
  audio?: MediaTrackConstraints;
  video?: MediaTrackConstraints;
  memberList?: boolean;
  chat?: boolean;
  devicePicker?: boolean;
};

export default function CoreVideoConference({
  onRoomReady,
  token,
  userName,
  theme,
  audio,
  video,
  memberList,
  chat,
  devicePicker,
}: CoreVideoConferenceProps) {
  const container = React.useRef<HTMLDivElement>(null);
  const videoConferenceComponent = React.useRef<any>();

  // FIXME Maybe we won't need this if https://github.com/signalwire/ready-rooms/pull/188 is merged
  const [roomSession, setRoomSession] =
    React.useState<SignalWire.Video.RoomSession | null>(null);

  React.useEffect(() => {
    // Run side effects from app-kit
    import("@signalwire/app-kit");
  }, []);

  React.useEffect(() => {
    if (videoConferenceComponent.current) {
      (window as any).pp = videoConferenceComponent.current;
      videoConferenceComponent.current.setupRoomSession = (rs: any) => {
        onRoomReady?.(rs);
      };
    }
  }, [onRoomReady]);

  React.useEffect(() => {
    if (videoConferenceComponent.current?.pvcConfig) {
      console.log("resetting");
      videoConferenceComponent.current.pvcConfig.reset();
    }
  }, [token, userName, theme, audio, video, memberList, chat, devicePicker]);

  return (
    <div ref={container}>
      {/* @ts-ignore */}
      <sw-video-conference
        key={JSON.stringify([
          token,
          userName,
          theme,
          audio,
          video,
          memberList,
          chat,
          devicePicker,
        ])}
        ref={videoConferenceComponent}
        token={token}
        user-name={userName}
        theme={theme}
        audio={audio}
        video={video}
        member-list={memberList}
        chat={chat}
        device-picker={devicePicker}
      />
    </div>
  );
}
