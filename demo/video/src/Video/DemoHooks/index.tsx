import { useState } from "react";
import type { Video } from "@signalwire/client";
import {
  useMembers,
  usePermissions,
  useLayouts,
  useScreenShare,
  useWebRTC,
  Video as VideoWeb,
  useStatus,
} from "@signalwire-community/react";
import { LayoutSelector } from "./LayoutSelector";
import { ControlStrip } from "./ControlStrip";
import { DeviceChangeButton } from "./DeviceChangeButton";
import ActiveLight from "./ActiveLight";
const controlStyle = {
  padding: "10px 5px",
  border: "1px solid #ccc",
};

function DemoHooks() {
  const [roomSession, setRoomSession] = useState<Video.RoomSession | null>(
    null
  );

  const P: any = usePermissions(roomSession);
  const { layouts, setLayout, currentLayout } = useLayouts(roomSession);
  const { toggle: toggleScreenShare, active: screenShareState } =
    useScreenShare(roomSession);
  const members = useMembers(roomSession);
  const { cameras, microphones, speakers } = useWebRTC({
    camera: true,
    microphone: true,
    speaker: true,
  });

  const { active } = useStatus(roomSession);

  return (
    <div>
      <VideoWeb
        token={import.meta.env.VITE_ROOM_TOKEN}
        onRoomReady={setRoomSession}
      />

      <div style={{ position: "fixed", top: 10, right: 10 }}>
        <ActiveLight active={active} />
      </div>

      {members.self && active && (
        <div style={controlStyle}>
          <b>Me:</b>
          <br />
          {ControlStrip(members.self, P?.self, members)}
          <br />
          {P?.layout && (
            <>Layout: {LayoutSelector(currentLayout, layouts, setLayout)}</>
          )}
          {P.self.screenshare && (
            <button
              onClick={() => {
                toggleScreenShare();
              }}
            >
              {screenShareState ? "Stop Sharing Screen" : "Share Screen"}
            </button>
          )}
        </div>
      )}

      {members.members.map((m: any) => (
        <div key={m.id}>
          {m.id !== members?.self?.id && (
            <>{ControlStrip(m, P?.member, members)}</>
          )}
        </div>
      ))}

      {roomSession && active && (
        <div>
          Cameras:
          {cameras?.map((x: MediaDeviceInfo) => (
            <DeviceChangeButton
              key={x.deviceId}
              kind="camera"
              self={members.self}
              device={x}
            />
          ))}
          Microphones:
          {microphones?.map((x: MediaDeviceInfo) => (
            <DeviceChangeButton
              key={x.deviceId}
              kind="microphone"
              self={members.self}
              device={x}
            />
          ))}
          Speakers:
          {speakers?.map((x: MediaDeviceInfo) => (
            <DeviceChangeButton
              key={x.deviceId}
              kind="speaker"
              self={members.self}
              device={x}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DemoHooks;
