import { Video } from "@signalwire/js";
import { useEffect, useState } from "react";

/**
 * Given a RoomSession, returns an object with its status, notably `active` which is true if the client is connected to the Room Session
 * @param `RoomSession` or `null`
 * @returns an object with an attribute `active`
 */
export default function useStatus(roomSession: Video.RoomSession | null) {
  const [active, setActive] = useState(roomSession?.active ?? false);

  useEffect(() => {
    if (roomSession === null) return;
    setActive(roomSession.active);
    const onChange = () => setActive(roomSession.active);
    roomSession.on("room.joined", onChange);
    roomSession.on("room.left", onChange);
    return () => {
      roomSession.off("room.joined", onChange);
      roomSession.off("room.left", onChange);
    };
  }, [roomSession]);
  return { active };
}
