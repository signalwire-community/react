import SignalWire from "@signalwire/js";
import { Fabric } from "@signalwire-community/react";
import { useState } from "react";

function DemoFabric() {
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);

  return (
    <div>
      {import.meta.env.VITE_FABRIC_TOKEN ? (
        <Fabric.Video token={import.meta.env.VITE_FABRIC_TOKEN} />
      ) : (
        "No Token Present. Please set your env variable"
      )}
    </div>
  );
}

export default DemoFabric;
