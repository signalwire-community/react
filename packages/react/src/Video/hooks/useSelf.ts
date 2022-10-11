import {
  Video,
  VideoLayout,
  VideoMemberEntity,
  VideoMemberTalkingEventParams,
  VideoRoomEventParams,
} from "@signalwire/js";
import { VideoMemberUpdatedHandlerParams } from "@signalwire/js/dist/js/src/utils/interfaces";
import { useEffect, useRef, useState } from "react";
import { toCamelCase } from "../../utils/camelCase";
import { Self, addMemberMethods, addSelfMemberMethods } from "./useMembers";

/**
 * Given a RoomSession, returns the current member and its associated properties.
 * @param roomSession `RoomSession` or `null`
 * @returns the current member, or `null` if the RoomSession is not active.
 */
export default function useSelf(roomSession: Video.RoomSession | null) {
  const selfId = useRef<string | null>(null);
  const [member, setMember] = useState<Self | null>(null);

  useEffect(() => {
    if (!roomSession) return;

    const onRoomJoined = (e: VideoRoomEventParams) => {
      // @ts-expect-error Property `member_id` is missing from the SDK types
      selfId.current = e.member_id;
      const member = e.room_session.members?.find(
        (m) => m.id === selfId.current
      );
      if (!member) {
        console.error("Unable to find current member in room.joined");
        return;
      }
      setMember(addMethods(roomSession, toCamelCase(member)));
    };
    roomSession.on("room.joined", onRoomJoined);

    if (roomSession.active) {
      (async () => {
        selfId.current = roomSession.memberId ?? null;
        const { members } = await roomSession.getMembers();
        const member = members.find((m) => m.id === selfId.current);
        if (!member) {
          console.error("Unable to find current member in getMembers()");
          return;
        }
        setMember(addMethods(roomSession, toCamelCase(member)));
      })();
    }

    const onMemberUpdated = (e: VideoMemberUpdatedHandlerParams) => {
      if (e.member.id !== selfId.current) return;
      const { updated: _, ...partialMember } = e.member;

      setMember((member) => {
        if (!member) return null;

        const camelPartialMember = toCamelCase(partialMember);
        const updatedMember = {
          ...member,
          ...camelPartialMember,
        };

        return addMethods(roomSession, updatedMember);
      });
    };
    roomSession.on("member.updated", onMemberUpdated);

    const onMemberTalking = (e: VideoMemberTalkingEventParams) => {
      if (e.member.id !== selfId.current) return;

      setMember((member) => {
        if (!member) return null;

        const newMember = { ...member };
        newMember.talking = e.member.talking;
        return newMember;
      });
    };
    roomSession.on("member.talking", onMemberTalking);

    const onLayoutChanged = (e: { layout: VideoLayout }) => {
      setMember((member) => {
        if (!member) return null;

        const memberLayer = e.layout.layers.find(
          // @ts-expect-error Property `memberId` is actually snake_case, SDK types are wrong
          (lyr) => lyr.member_id === selfId.current
        );
        if (memberLayer && memberLayer.position !== undefined) {
          return {
            ...member,
            currentPosition: memberLayer.position,
          };
        }
        return member;
      });
    };
    roomSession.on("layout.changed", onLayoutChanged);

    const onRoomLeft = () => setMember(null);
    roomSession.on("room.left", onRoomLeft);

    return () => {
      roomSession.off("layout.changed", onLayoutChanged);
      roomSession.off("member.talking", onMemberTalking);
      roomSession.off("member.updated", onMemberUpdated);
      roomSession.off("room.joined", onRoomJoined);
      roomSession.off("room.left", onRoomLeft);
    };
  }, [roomSession]);

  return member;
}

/**
 * Adds common member methods and self-specific methods to the specified member.
 */
function addMethods(
  roomSession: Video.RoomSession,
  member: VideoMemberEntity
): Self {
  return addSelfMemberMethods(
    roomSession,
    addMemberMethods(roomSession, member)
  );
}
