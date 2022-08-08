import { useState, useEffect, useRef } from "react";
import { Video } from "@signalwire/js";

// TODO: Explicitly mark types for each parameter
export default function useMembers(roomSession: Video.RoomSession | null) {
  const selfId = useRef<string | null>(null);
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    if (roomSession === null) return;
    roomSession.on("room.joined", (e) => {
      selfId.current = (e as any).member_id;
    });
    roomSession.on("memberList.updated", (e) => {
      setMembers(e.members);
    });
    return () => {
      roomSession.removeAllListeners();
    };
  }, [roomSession]);

  // TODO: supplement with extra methods inside each member to remove and mute them and such
  return {
    self: members.find((m: any) => m.id === selfId.current) ?? null,
    members,
    removeAll: () => {
      roomSession?.removeAllMembers();
    },
  };
}
