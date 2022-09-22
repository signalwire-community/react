import { useState, useEffect, useRef } from "react";
import { Video } from "@signalwire/js";
import type {
  VideoMemberEntity,
  VideoMemberTalkingEventParams,
} from "@signalwire/js";
import type { SetMemberPositionParams } from "@signalwire/core/dist/core/src/rooms";
import type { VideoMemberListUpdatedParams } from "@signalwire/js/dist/js/src/video";

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
  setPosition: (position: string) => void;
  talking?: boolean;
}
interface Self extends Member {
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
    if (roomSession === null || roomSession === undefined) return;
    function addMethods(members: VideoMemberEntity[]): Member[] {
      return members.map((m: VideoMemberEntity) => {
        return {
          ...m,
          audio: {
            // NOTE: the typedefs don't match the implementation here (audioMuted vs audio_muted)
            muted: (m as any).audio_muted,
            mute: () => roomSession?.audioMute({ memberId: m.id }),
            unmute: () => roomSession?.audioUnmute({ memberId: m.id }),
            toggle: () => {
              (m as any).audio_muted
                ? roomSession?.audioUnmute({ memberId: m.id })
                : roomSession?.audioMute({ memberId: m.id });
            },
          },
          video: {
            muted: (m as any).video_muted,
            mute: () => roomSession?.videoMute({ memberId: m.id }),
            unmute: () => roomSession?.videoUnmute({ memberId: m.id }),
            toggle: () => {
              (m as any).video_muted
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
    function onRoomJoined(e: any) {
      selfId.current = e.member_id;
      console.log(selfId.current);
      setMembers(addMethods(e.room_session.members));
    }
    roomSession.on("room.joined", onRoomJoined);

    function onMemberListUpdated(e: VideoMemberListUpdatedParams) {
      const members: any = e.members;
      setMembers(addMethods(members));
    }
    roomSession.on("memberList.updated", onMemberListUpdated);

    function onMemberTalking(e: VideoMemberTalkingEventParams) {
      setMembers((members) => {
        const newMembers = [...members];
        const member = newMembers.find((m: any) => m.id === e.member.id);
        if (member) member.talking = e.member.talking;
        return newMembers;
      });
    }
    roomSession.on("member.talking", onMemberTalking);

    function onLayoutChanged(e: any) {
      setMembers((members: any) => {
        const newMembers = [...members];
        e.layout.layers.forEach((layer: any) => {
          if (layer.member_id === undefined) return;
          const member = newMembers.find((m: any) => m.id === layer.member_id);
          if (member !== undefined && layer.position !== undefined)
            member.current_position = layer.position;
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

  function getSelfMember(): null | Self {
    const self: Self | null =
      (members.find((m: any) => m.id === selfId.current) as Self) ?? null;
    if (self != null) {
      self.audio.setDevice = (device: DeviceIdHolder) => {
        roomSession?.updateMicrophone(device);
      };
      self.video.setDevice = (device: DeviceIdHolder) => {
        roomSession?.updateCamera(device);
      };
      self.speaker.setDevice = (device: DeviceIdHolder) => {
        roomSession?.updateSpeaker(device);
      };
    }
    return self;
  }

  return {
    self: getSelfMember(),
    members,
    removeAll: () => {
      roomSession?.removeAllMembers();
    },
  };
}
