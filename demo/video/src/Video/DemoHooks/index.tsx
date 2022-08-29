import { useEffect, useState } from "react";
import type { Video } from "@signalwire/js";
import {
  useMembers,
  usePermissions,
  useLayouts,
  useScreenShare,
  Video as VideoWeb,
} from "@signalwire-community/react";
import { LayoutSelector } from "./LayoutSelector";
import { ControlStrip } from "./ControlStrip";
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
  const { toggle: toggleScreenShare, state: screenShareState } =
    useScreenShare(roomSession);
  const members = useMembers(roomSession);

  return (
    <div>
      <VideoWeb
        token={import.meta.env.VITE_ROOM_TOKEN_FULL_PERMISSIONS}
        onRoomReady={(e) => {
          // Without this line, the `memberList.updated` event inside
          // `useMembers` will not be triggered.
          e.on("memberList.updated", (m) => {});
          setRoomSession(e);
        }}
      />

      {members.self && (
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
    </div>
  );
}

export default DemoHooks;
