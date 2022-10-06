import { Video, VideoRoomEventParams } from "@signalwire/js";
import { useEffect, useRef, useState } from "react";
import { Self } from "./useMembers";

export default function useSelf(roomSession: Video.RoomSession | null) {
  const selfId = useRef<string | null>(null);
  const [member, setMember] = useState<Self | null>(null);

  useEffect(() => {
    if (!roomSession) return;

    function onRoomJoined(e: VideoRoomEventParams) {
      // @ts-expect-error Property `member_id` is missing from the SDK types
      selfId.current = e.member_id;
      const members = e.room_session.members?.map(toCamelCase) ?? [];
      setMember(addMethods(e.room_session.members));
    }
    roomSession.on("room.joined", onRoomJoined);

    if (roomSession.active) {
      (async () => {
        selfId.current = roomSession?.memberId ?? null;
        const members = (await roomSession?.getMembers())?.members;
        if (members) setMembers(addMethods(members));
      })();
    }
  });
}
