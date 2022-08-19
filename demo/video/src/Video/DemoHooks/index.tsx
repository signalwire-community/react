import { useEffect, useState } from "react";
import type { Video } from "@signalwire/js";
import {
  useMembers,
  usePermissions,
  Video as VideoWeb,
} from "@signalwire-community/react";

const controlStyle = {
  padding: "10px 5px",
  border: "1px solid #ccc",
};

function DemoHooks() {
  const [roomSession, setRoomSession] = useState<Video.RoomSession | undefined>(
    undefined
  );

  const P = usePermissions(roomSession);
  const members = useMembers(roomSession ?? null);

  function controlStrip(m: any, permission: any) {
    if (m === null) return;
    return (
      <>
        {`${m.name.substr(0, 6)}... (${m.id.substr(0, 10)}...)`}
        <i>{(members?.self as any)?.talking && " Talking"}</i>
        <br />
        {permission.audio.full && (
          <button onClick={(x) => m.audio.toggle()}>
            {m.audio.muted ? "Unmute" : "Mute"} audio
          </button>
        )}
        {permission.video.full && (
          <button onClick={(x) => m.video.toggle()}>
            {m.video.muted ? "Unmute" : "Mute"} video
          </button>
        )}
        {permission.video.full && (
          <button onClick={(x) => m.speaker.toggle()}>
            {m.speaker.muted ? "Unmute" : "Mute"} speaker
          </button>
        )}
        {permission.remove && (
          <button
            onClick={(e) => {
              m.remove();
            }}
          >
            Remove
          </button>
        )}
        {permission.set_position && (
          <button
            onClick={(e) => {
              if (m.position === "off-canvas") m.setPosition("standard-1");
              else m.setPosition("off-canvas");
            }}
          >
            {m.position === "off-canvas" ? "Show" : "Hide"}
          </button>
        )}
        <br />
        Position: {m.position}
      </>
    );
  }

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
          {controlStrip(members.self, P.self)}
        </div>
      )}
      {members.members.map((m: any) => (
        <div key={m.id}>
          {m.id !== members?.self?.id && <>{controlStrip(m, P.member)}</>}
        </div>
      ))}
    </div>
  );
}

export default DemoHooks;
