import React, { useState, useEffect, useRef } from "react";
import { Video, WebRTC } from "@signalwire/js";

export default function useControls(roomSession: Video.RoomSession | null) {
  const selfId = useRef<string | null>(null);
  const [audioMuted, setAudioMuted] = useState<Boolean>(false);
  const [videoMuted, setVideoMuted] = useState<Boolean>(false);
  const [speakerMuted, setSpeakerMuted] = useState<Boolean>(false);

  async function muteAudio(state: boolean) {
    try {
      if (state) await roomSession?.audioMute();
      else await roomSession?.audioUnmute();
    } catch (e) {
      console.log(e);
    }
  }
  async function muteVideo(state: boolean) {
    try {
      if (state) await roomSession?.videoMute();
      else await roomSession?.videoUnmute();
    } catch (e) {
      console.log(e);
    }
  }
  async function muteSpeaker(state: boolean) {
    try {
      if (state) await roomSession?.deaf();
      else await roomSession?.undeaf();
    } catch (e) {
      console.log(e);
    }
  }

  function leave() {
    try {
      roomSession?.leave();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (roomSession === null) return;
    roomSession.on("room.joined", (e) => {
      selfId.current = (e as any).member_id;
      const currentMember = (e as any).room_session.members.find(
        (m: any) => m.id === selfId.current
      );
      setAudioMuted((m) => currentMember.audio_muted ?? m);
      setVideoMuted((m) => currentMember.video_muted ?? m);
      setSpeakerMuted((m) => currentMember.deaf ?? m);
    });
    roomSession.on("room.updated", (e) => {});
    roomSession.on("memberList.updated", (e) => {
      const currentMember = e.members.find((m) => m.id === selfId.current);
      if (currentMember !== undefined) {
        setAudioMuted((m) => currentMember.audio_muted ?? m);
        setVideoMuted((m) => currentMember.video_muted ?? m);
        setSpeakerMuted((m) => currentMember.deaf ?? m);
      }
    });
    return () => {
      // TODO: Remove SPECIFIC listeners
      roomSession.removeAllListeners();
    };
  }, [roomSession]);

  return {
    audio: {
      muted: audioMuted,
      mute: () => muteAudio(true),
      unmute: () => muteAudio(false),
      toggle: () => muteAudio(!audioMuted),
    },
    video: {
      muted: videoMuted,
      mute: () => muteVideo(true),
      unmute: () => muteVideo(false),
      toggle: () => muteVideo(!videoMuted),
    },
    speaker: {
      muted: speakerMuted,
      mute: () => muteSpeaker(true),
      unmute: () => muteSpeaker(false),
      toggle: () => muteSpeaker(!speakerMuted),
    },
    setInputVolume: () => {
      console.error("TODO");
    },
    setOutputVolume: () => {
      console.error("TODO");
    },
    leave,
  };
}
