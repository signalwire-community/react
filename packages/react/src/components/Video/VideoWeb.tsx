import { useEffect, useRef, useState } from "react";
import { Video, WebRTC } from "@signalwire/js";
import VideoBase from "./VideoBase";
import { IVideoCommonProps } from "./IVideoCommonProps";

interface IVideoWebProps extends IVideoCommonProps {}

const VideoWeb: React.FC<IVideoWebProps> = ({
  token,
  onRoomUpdate = () => {},
  onEvent = (eventName, event) => {
    console.log(eventName, event);
  },
  ...props
}) => {
  const rootElement = useRef<HTMLElement | null>(null);
  const [roomSession, setRoomSession] = useState<Video.RoomSession | null>(
    null
  );

  useEffect(() => {
    async function setupDevices() {
      if (roomSession === null) return;
      const layouts = (await roomSession.getLayouts()).layouts;
      const cameras = await WebRTC.getCameraDevicesWithPermissions();
      const microphones = await WebRTC.getMicrophoneDevicesWithPermissions();
      const speakers = await WebRTC.getSpeakerDevicesWithPermissions();

      onRoomUpdate({ roomSession, layouts, cameras, microphones, speakers });

      const camChangeWatcher = await WebRTC.createDeviceWatcher({
        targets: ["camera"],
      });
      camChangeWatcher.on("changed", (changes) => {
        onRoomUpdate({ cameras: changes.devices });
      });
      const micChangeWatcher = await WebRTC.createDeviceWatcher({
        targets: ["microphone"],
      });
      micChangeWatcher.on("changed", (changes) => {
        onRoomUpdate({ microphones: changes.devices });
      });
      const speakerChangeWatcher = await WebRTC.createDeviceWatcher({
        targets: ["speaker"],
      });
      speakerChangeWatcher.on("changed", (changes) => {
        onRoomUpdate({ speakers: changes.devices });
      });

      return () => {
        try {
          camChangeWatcher.off("changed");
          micChangeWatcher.off("changed");
          speakerChangeWatcher.off("changed");
        } catch (e) {
          console.error("Couldn't remove watchers", e);
        }
      };
    }
    setupDevices();
  }, [roomSession]);

  return (
    <VideoBase
      token={token}
      rootElement={rootElement}
      onRoomJoined={(roomSession, memberId) => {
        console.log("Room was joined");
        setRoomSession(roomSession);
      }}
      onEvent={(eventName, event) => {
        // eventName handler here if any
        onEvent(eventName, event);
      }}
    >
      <div
        ref={(ref) => {
          rootElement.current = ref;
        }}
        {...props}
      ></div>
    </VideoBase>
  );
};

export default VideoWeb;
