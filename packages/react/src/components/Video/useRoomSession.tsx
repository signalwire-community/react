import React, { useState, useEffect, useRef } from "react";
import { Video, WebRTC } from "@signalwire/js";
import { StartScreenShareOptions } from "@signalwire/js/dist/js/src/utils/interfaces";

type IListVideo = "audioMuted" | "videoMuted" | "speakerMuted" | "members";

export default function useRoomSession(
  roomSession: Video.RoomSession | null,
  events: [IListVideo] | []
) {
  const selfId = useRef<string | null>(null);
  const [audioMuted, setAudioMuted] = useState<Boolean>(false);
  const [videoMuted, setVideoMuted] = useState<Boolean>(false);
  const [speakerMuted, setSpeakerMuted] = useState<Boolean>(false);
  const [members, setMembers] = useState<any>([]);

  async function record() {
    const rec = await roomSession?.startRecording();
    return async function stopRecording() {
      return await rec?.stop();
    };
  }
  async function shareScreen(opts: StartScreenShareOptions) {
    let screenShareObj = await roomSession?.startScreenShare(opts);
    return async function stopScreenSharing() {
      await screenShareObj?.leave();
    };
  }

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
      setMembers(e.members);
      const currentMember = e.members.find((m) => m.id === selfId.current);
      if (currentMember !== undefined) {
        setAudioMuted((m) => currentMember.audio_muted ?? m);
        setVideoMuted((m) => currentMember.video_muted ?? m);
        setSpeakerMuted((m) => currentMember.deaf ?? m);
      }
    });
    return () => {
      roomSession.removeAllListeners();
    };
  }, [roomSession]);

  return {
    audioMuted,
    muteAudio,
    videoMuted,
    muteVideo,
    speakerMuted,
    muteSpeaker,
    members,
    record,
    shareScreen,
    leave,
  };
}
