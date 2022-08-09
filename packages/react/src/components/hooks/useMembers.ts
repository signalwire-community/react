import { useState, useEffect, useRef } from "react";
import { Video } from "@signalwire/js";

// TODO: Explicitly mark types for each parameter
export default function useMembers(roomSession: Video.RoomSession | null) {
  const selfId = useRef<string | null>(null);
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    if (roomSession === null || roomSession === undefined) return;
    function addMethods(members: any[]) {
      // TODO: Add error handling to these methods
      return members.map((m) => {
        return {
          ...m,
          audio: {
            muted: m.audio_muted,
            mute: () => roomSession?.audioMute({ memberId: m.id }),
            unmute: () => roomSession?.audioUnmute({ memberId: m.id }),
            toggle: () => {
              m.audio_muted
                ? roomSession?.audioUnmute({ memberId: m.id })
                : roomSession?.audioMute({ memberId: m.id });
            },
          },
          video: {
            muted: m.video_muted,
            mute: () => roomSession?.videoMute({ memberId: m.id }),
            unmute: () => roomSession?.videoUnmute({ memberId: m.id }),
            toggle: () => {
              m.video_muted
                ? roomSession?.videoUnmute({ memberId: m.id })
                : roomSession?.videoMute({ memberId: m.id });
            },
          },
          speaker: {
            muted: m.deaf,
            toggle: () =>
              m.deaf
                ? roomSession?.undeaf({ memberId: m.id })
                : roomSession?.deaf({ memberId: m.id }),
            mute: () => roomSession?.deaf({ memberId: m.id }),
            unmute: () => roomSession?.undeaf({ memberId: m.id }),
          },
          remove: () => {
            roomSession?.removeMember({ memberId: m.id });
          },
        };
      });
    }
    if (roomSession === null) return;
    roomSession.on("room.joined", (e: any) => {
      selfId.current = e.member_id;
      console.log(selfId.current);
      let members = e.room_session.members;
      setMembers(addMethods(members));
    });
    roomSession.on("memberList.updated", (e) => {
      setMembers(addMethods(e.members));
    });
    return () => {
      roomSession.removeAllListeners();
    };
  }, [roomSession]);

  return {
    self: members.find((m: any) => m.id === selfId.current) ?? null,
    members,
    removeAll: () => {
      roomSession?.removeAllMembers();
    },
  };
}
