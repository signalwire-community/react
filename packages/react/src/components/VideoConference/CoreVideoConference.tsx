import React from "react";
import type * as SignalWire from "@signalwire/js";

type CoreVideoConferenceProps = {
  onRoomReady?: (roomSession: any) => void;
  token: string;
  userName?: string;
  theme?: "light" | "dark" | "auto";
  audio?: MediaTrackConstraints;
  video?: MediaTrackConstraints;
  memberList?: boolean;
  prejoin?: boolean;
};

export default function CoreVideoConference({
  onRoomReady,
  token,
  userName,
  theme,
  audio,
  video,
  memberList,
  prejoin,
}: CoreVideoConferenceProps) {
  const container = React.useRef<HTMLDivElement>(null);
  const videoConferenceComponent = React.useRef<any>();

  // FIXME Maybe we won't need this if https://github.com/signalwire/ready-rooms/pull/188 is merged
  const [roomSession, setRoomSession] =
    React.useState<SignalWire.Video.RoomSession | null>(null);

  React.useEffect(() => {
    const scriptEsm = document.createElement("script");
    const scriptNoModule = document.createElement("script");
    const css = document.createElement("link");

    scriptEsm.src =
      "https://cdn.signalwire.com/@signalwire/app-kit@next/dist/signalwire/signalwire.esm.js";
    scriptEsm.type = "module";

    scriptNoModule.src =
      "https://cdn.signalwire.com/@signalwire/app-kit@next/dist/signalwire/signalwire.js";
    scriptNoModule.noModule = true;

    css.href =
      "https://cdn.signalwire.com/@signalwire/app-kit@next/dist/signalwire/signalwire.css";
    css.rel = "stylesheet";

    container.current?.appendChild(scriptEsm);
    container.current?.appendChild(scriptNoModule);
    container.current?.appendChild(css);

    return () => {
      container.current?.removeChild(scriptEsm);
      container.current?.removeChild(scriptNoModule);
      container.current?.removeChild(css);
    };
  }, []);

  React.useEffect(() => {
    if (videoConferenceComponent.current) {
      videoConferenceComponent.current.setupRoomSession = (rs: any) => {
        onRoomReady?.(rs);
      };
    }
  }, [onRoomReady]);

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
          prejoin,
        ])}
        ref={videoConferenceComponent}
        token={token}
        user-name={userName}
        theme={theme}
        audio={audio}
        video={video}
        member-list={memberList}
        prejoin={prejoin}
      />
    </div>
  );
}
