import { useEffect, useState } from "react";
import type { Video } from "@signalwire/js";
import {
  useControls,
  useMembers,
  usePermissions,
  Video as VideoWeb,
} from "@signalwire-community/react";

function DemoHooks() {
  const [roomSession, setRoomSession] = useState<Video.RoomSession | undefined>(
    undefined
  );

  const P = usePermissions(import.meta.env.VITE_ROOM_TOKEN);
  console.log("Permissions", P);
  const members = useMembers(roomSession ?? null);

  function controlButtons(m: any, permission: any) {
    if (m === null) return;
    return (
      <>
        {`${m.name} [${m.id.substr(0, 10)}...]`}
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
      </>
    );
  }

  return (
    <div>
      <VideoWeb
        token={import.meta.env.VITE_ROOM_TOKEN}
        onRoomReady={(e) => {
          // Without this line, the `memberList.updated` event inside
          // `useMembers` will not be triggered.
          e.on("memberList.updated", (m) => {});
          setRoomSession(e);
        }}
      />
      {members.self && (
        <div>
          <b>ME</b> {members.self.name}
          {controlButtons(members.self, P.self)}
        </div>
      )}
      {members.members.map((m: any) => (
        <div>
          {m.id !== members.self.id && <>{controlButtons(m, P.member)}</>}
        </div>
      ))}
    </div>
  );
}

export default DemoHooks;
