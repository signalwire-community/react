import { useState, useEffect, useRef } from 'react';
import type {
  CallSession,
  CallMemberEntity,
  VideoPosition,
} from '@signalwire/client';
import { toCamelCase } from '../../utils/camelCase';

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

interface Member extends CallMemberEntity {
  id: any;
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

export default function useMembers(roomSession: any): {
  self: Self | null;
  members: Member[];
  removeAll: () => void;
} {
  const selfId = useRef<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!roomSession) return;

    const onRoomJoined = async () => {
      selfId.current = roomSession.memberId;
      const res = await roomSession.getMembers();
      setMembers(addMethods(roomSession, res.members ?? []));
    };

    const onMemberListUpdated = (e: any) => {
      const mapped = e.members.map(toCamelCase);
      setMembers(addMethods(roomSession, mapped));
    };

    const onMemberTalking = (e: any) => {
      setMembers((prev) => {
        const updated = [...prev];
        const target = updated.find((m) => m.id === e.member.id);
        if (target) target.talking = e.member.talking;
        return updated;
      });
    };

    const onLayoutChanged = (e: any) => {
      setMembers((prev) => {
        const updated = [...prev];
        e.layout.layers.forEach((layer: { member_id: any; position: any; }) => {
          const member = updated.find((m) => m.id === layer.member_id);
          if (member && layer.position) {
            (member as any).currentPosition = layer.position;
          }
        });
        return updated;
      });
    };

    roomSession.on('room.joined', onRoomJoined);
    roomSession.on('memberList.updated', onMemberListUpdated);
    roomSession.on('member.talking', onMemberTalking);
    roomSession.on('layout.changed', onLayoutChanged);

    // Ako već aktivan poziv, inicijalno učitaj članove
    if (roomSession.active) onRoomJoined();

    return () => {
      roomSession.off('room.joined', onRoomJoined);
      roomSession.off('memberList.updated', onMemberListUpdated);
      roomSession.off('member.talking', onMemberTalking);
      roomSession.off('layout.changed', onLayoutChanged);
    };
  }, [roomSession]);

  function getSelfMember(): Self | null {
    if (!roomSession) return null;
    const self = members.find((m) => m.id === selfId.current) as Self;
    return self ? addSelfMemberMethods(roomSession, self) : null;
  }

  return {
    self: getSelfMember(),
    members,
    removeAll: () => {
      roomSession?.removeAllMembers?.();
    },
  };
}

function addMethods(roomSession: CallSession, members: any[]): any[] {
  return members.map((m) => addMemberMethods(roomSession, m));
}

function addMemberMethods(roomSession: any, m: any): Member {
  return {
    ...m,
    audio: {
      muted: m.audioMuted,
      mute: () => roomSession.audioMute({ memberId: m.id }),
      unmute: () => roomSession.audioUnmute({ memberId: m.id }),
      toggle: () =>
        m.audioMuted
          ? roomSession.audioUnmute({ memberId: m.id })
          : roomSession.audioMute({ memberId: m.id }),
    },
    video: {
      muted: m.videoMuted,
      mute: () => roomSession.videoMute({ memberId: m.id }),
      unmute: () => roomSession.videoUnmute({ memberId: m.id }),
      toggle: () =>
        m.videoMuted
          ? roomSession.videoUnmute({ memberId: m.id })
          : roomSession.videoMute({ memberId: m.id }),
    },
    speaker: {
      muted: m.deaf,
      mute: () => roomSession.deaf({ memberId: m.id }),
      unmute: () => roomSession.undeaf({ memberId: m.id }),
      toggle: () =>
        m.deaf
          ? roomSession.undeaf({ memberId: m.id })
          : roomSession.deaf({ memberId: m.id }),
    },
    remove: () => roomSession.removeMember({ memberId: m.id }),
    setPosition: (position: VideoPosition) =>
      roomSession?.setMemberPosition({ memberId: m.id, position }),
  };
}

function addSelfMemberMethods(roomSession: CallSession, m: Member): Self {
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
        roomSession.updateCamera(device);
      },
    },
    speaker: {
      ...m.speaker,
      setDevice: (device: DeviceIdHolder) => {
        roomSession.updateSpeaker(device);
      },
    },
  };
}
