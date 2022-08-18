import { useState, useEffect, useRef } from "react";
import { Video } from "@signalwire/js";
import { SetMemberPositionParams } from "@signalwire/core/dist/core/src/rooms";

// TODO: Explicitly mark types for each parameter
export default function useMembers(roomSession: Video.RoomSession | null) {
  const selfId = useRef<string | null>(null);
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    if (roomSession === null || roomSession === undefined) return;
    function addMethods(members: any[]) {
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
          setPosition: (position: string) => {
            const params: any = {
              memberId: m.id,
              position: position,
            };
            roomSession?.setMemberPosition(params as SetMemberPositionParams);
          },
        };
      });
    }
    if (roomSession === null) return;
    function onRoomJoined(e: any) {
      console.log("Room Joined", e);
      selfId.current = e.member_id;
      console.log(selfId.current);
      let members = e.room_session.members;
      setMembers(addMethods(members));
    }
    roomSession.on("room.joined", onRoomJoined);

    function onMemberListUpdated(e: any) {
      console.log("MemberList Updated", e);
      const members: any = e.members;
      members.forEach((m: any) => {
        m.position = m.current_position;
      });
      setMembers(addMethods(members));
    }
    roomSession.on("memberList.updated", onMemberListUpdated);

    function onMemberTalking(e: any) {
      setMembers((members: any) => {
        const newMembers = [...members];
        let member = newMembers?.find((m: any) => m.id === e.member.id);
        if (member) member.talking = e.member.talking;
        return newMembers;
      });
    }
    roomSession.on("member.talking", onMemberTalking);

    function onLayoutChanged(e: any) {
      console.log("Layout Changed", e);
      setMembers((members: any) => {
        const newMembers = [...members];
        e.layout.layers.forEach((layer: any) => {
          if (layer.member_id === undefined) return;
          const member = newMembers.find((m: any) => m.id === layer.member_id);
          if (member !== undefined && layer.position !== undefined)
            member.position = layer.position;
        });
        return newMembers;
      });
    }
    roomSession.on("layout.changed", onLayoutChanged);

    return () => {
      roomSession.off("layout.changed", onLayoutChanged);
      roomSession.off("member.talking", onMemberTalking);
      roomSession.off("memberList.updated", onMemberListUpdated);
      roomSession.off("room.joined", onRoomJoined);
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
