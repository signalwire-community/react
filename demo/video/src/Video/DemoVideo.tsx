import SignalWire from "@signalwire/js";
import { LocalStream, Video } from "@signalwire-community/react";
import { useState } from "react";

function DemoVideo() {
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);
  return (
    <div>
      {import.meta.env.VITE_ROOM_TOKEN ? (
        <Video
          token={import.meta.env.VITE_ROOM_TOKEN}
          onRoomReady={(roomSession) => {
            setRoomSession(roomSession);
            console.log(roomSession);
          }}
        />
      ) : (
        "No Token Present. Please set your env variable"
      )}
      <LocalStream
        roomSession={roomSession ?? undefined}
        style={{ position: "absolute", top: 0, right: 0, width: 200 }}
      />
    </div>
  );
}

export default DemoVideo;
