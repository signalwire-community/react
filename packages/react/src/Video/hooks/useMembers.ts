import { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoLayout,
  VideoPosition,
  VideoRoomEventParams,
} from "@signalwire/js";
import type {
  VideoMemberEntity,
  VideoMemberTalkingEventParams,
} from "@signalwire/js";
import type { SetMemberPositionParams } from "@signalwire/core/dist/core/src/rooms";
import type { VideoMemberListUpdatedParams } from "@signalwire/js/dist/js/src/video";
import { toCamelCase } from "../../utils/camelCase";

type DeviceIdHolder = {
  deviceId: string;
  [x: string | number | symbol]: unknown;
};

interface IOAttributes {
  muted: boolean;
  mute: () => void;
  unmute: () => void;
  toggle: () => void;
}

interface SelfIOAttributes extends IOAttributes {
  setDevice: (device: DeviceIdHolder) => void;
}

interface Member extends VideoMemberEntity {
  audio: IOAttributes;
  video: IOAttributes;
  speaker: IOAttributes;
  remove: () => void;
  setPosition: (position: VideoPosition) => void;
  talking?: boolean;
}

export interface Self extends Member {
  audio: SelfIOAttributes;
  video: SelfIOAttributes;
  speaker: SelfIOAttributes;
}

/**
 * Given an active RoomSession, maintains a reactive list of all members, including the user themselves.
 * @param `RoomSession` or `null`
 * @return an object with `self` as a reference to the current user,
 * `members` as an array with the list of all members, and `removeAll()`
 * which removes everyone
 */
export default function useMembers(roomSession: Video.RoomSession | null): {
  self: Self | null;
  members: Member[];
  removeAll: () => void;
} {
  const selfId = useRef<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!roomSession) return;

    const onRoomJoined = (e: VideoRoomEventParams) => {
      // @ts-expect-error Property `member_id` is missing from the SDK types
      selfId.current = e.member_id;
      const members = e.room_session.members?.map(toCamelCase) ?? [];
      setMembers(addMethods(roomSession, members));
    };
    roomSession.on("room.joined", onRoomJoined);
    if (roomSession.active) {
      (async () => {
        // In case  `useMembers` is invoked after `room.joined` event.
        selfId.current = roomSession?.memberId ?? null;
        const members = (await roomSession?.getMembers())?.members;
        if (members) setMembers(addMethods(roomSession, members));
      })();
    }

    const onMemberListUpdated = (e: VideoMemberListUpdatedParams) => {
      const members = e.members.map(toCamelCase);
      setMembers(addMethods(roomSession, members));
    };
    roomSession.on("memberList.updated", onMemberListUpdated);

    const onMemberTalking = (e: VideoMemberTalkingEventParams) => {
      setMembers((members) => {
        const newMembers = [...members];
        const member = newMembers.find((m) => m.id === e.member.id);
        if (member) member.talking = e.member.talking;
        return newMembers;
      });
    };
    roomSession.on("member.talking", onMemberTalking);

    const onLayoutChanged = (e: { layout: VideoLayout }) => {
      setMembers((members) => {
        const newMembers = [...members];
        e.layout.layers.forEach((layer) => {
          // @ts-expect-error Property `member_id` is actually camelCase, SDK types are wrong
          if (layer.member_id === undefined) return;
          // @ts-expect-error Property `member_id` is actually camelCase, SDK types are wrong
          const member = newMembers.find((m) => m.id === layer.member_id);
          if (member !== undefined && layer.position !== undefined)
            member.currentPosition = layer.position;
        });
        return newMembers;
      });
    };
    roomSession.on("layout.changed", onLayoutChanged);

    return () => {
      roomSession.off("layout.changed", onLayoutChanged);
      roomSession.off("member.talking", onMemberTalking);
      roomSession.off("memberList.updated", onMemberListUpdated);
      roomSession.off("room.joined", onRoomJoined);
    };
  }, [roomSession]);

  function getSelfMember(): null | Self {
    if (!roomSession) return null;

    const self: Self | null =
      (members.find((m) => m.id === selfId.current) as Self) ?? null;
    if (self) {
      return addSelfMemberMethods(roomSession, self);
    }
    return null;
  }

  return {
    self: getSelfMember(),
    members,
    removeAll: () => {
      roomSession?.removeAllMembers();
    },
  };
}

function addMethods(
  roomSession: Video.RoomSession,
  members: VideoMemberEntity[]
): Member[] {
  return members.map((m) => addMemberMethods(roomSession, m));
}

export function addMemberMethods(
  roomSession: Video.RoomSession,
  m: VideoMemberEntity
): Member {
  return {
    ...m,
    audio: {
      muted: m.audioMuted,
      mute: () => roomSession.audioMute({ memberId: m.id }),
      unmute: () => roomSession.audioUnmute({ memberId: m.id }),
      toggle: () => {
        m.audioMuted
          ? roomSession.audioUnmute({ memberId: m.id })
          : roomSession.audioMute({ memberId: m.id });
      },
    },
    video: {
      muted: m.videoMuted,
      mute: () => roomSession.videoMute({ memberId: m.id }),
      unmute: () => roomSession.videoUnmute({ memberId: m.id }),
      toggle: () => {
        m.videoMuted
          ? roomSession.videoUnmute({ memberId: m.id })
          : roomSession.videoMute({ memberId: m.id });
      },
    },
    speaker: {
      muted: m.deaf,
      toggle: () =>
        m.deaf
          ? roomSession.undeaf({ memberId: m.id })
          : roomSession.deaf({ memberId: m.id }),
      mute: () => roomSession.deaf({ memberId: m.id }),
      unmute: () => roomSession.undeaf({ memberId: m.id }),
    },
    remove: () => {
      roomSession.removeMember({ memberId: m.id });
    },
    setPosition: (position: VideoPosition) => {
      const params: SetMemberPositionParams = {
        memberId: m.id,
        position: position,
      };
      roomSession.setMemberPosition(params);
    },
  };
}

export function addSelfMemberMethods(
  roomSession: Video.RoomSession,
  m: Member
): Self {
  return {
    ...m,
    audio: {
      ...m.audio,
      setDevice: (device: DeviceIdHolder) => {
        roomSession.updateMicrophone(device);
      },
    },
    video: {
      ...m.video,
      setDevice: (device: DeviceIdHolder) => {
        roomSession?.updateCamera(device);
      },
    },
    speaker: {
      ...m.speaker,
      setDevice: (device: DeviceIdHolder) => {
        roomSession?.updateSpeaker(device);
      },
    },
  };
}
