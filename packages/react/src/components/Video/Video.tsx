import React, { useEffect, useState } from 'react';
import * as SignalWire from '@signalwire/js';

interface IVideoProps {
  token: string;
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  children?: JSX.Element;
  rootElement?: React.RefObject<HTMLDivElement>;
  onRoomReady?: (roomSession: any) => void;
  onLayoutChanged?: (e: any) => void;
  onMemberJoined?: (e: any) => void;
  onMemberLeft?: (e: any) => void;
  onMemberTalking?: (e: any) => void;
  onMemberUpdated?: (e: any) => void;
  onMemberListUpdated?: (e: any) => void;
  onPlaybackEnded?: (e: any) => void;
  onPlaybackStarted?: (e: any) => void;
  onPlaybackUpdated?: (e: any) => void;
  onRecordingEnded?: (e: any) => void;
  onRecordingStarted?: (e: any) => void;
  onRecordingUpdated?: (e: any) => void;
  onRoomJoined?: (e: any) => void;
  onRoomUpdated?: (e: any) => void;
}

const Video: React.FC<IVideoProps> = ({
  token,
  logLevel = 'silent',
  audio = true,
  video = true,
  children,
  rootElement,
  onRoomReady,
  ...props
}) => {
  let [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);
  useEffect(() => {
    if (setupComplete) return;
    setSetupComplete(true);
    let curRoomSession: SignalWire.Video.RoomSession | null = null;
    async function setup() {
      curRoomSession = new SignalWire.Video.RoomSession({
        token,
        rootElement: rootElement?.current ?? undefined,
        audio,
        video,
        logLevel,
      });
      setRoomSession(curRoomSession);
      (window as any).roomSession = curRoomSession; //expose room session for debugging
      onRoomReady && onRoomReady(curRoomSession);
      await curRoomSession.join();
    }
    try {
      setup();
    } catch (e) {
      console.log("Couldn't join room", e);
    }

    return () => {
      try {
        curRoomSession?.leave();
      } catch (e) {
        console.log("The room wasn't joined yet.");
      }
    };
  }, [token, setupComplete]);

  const eventMap = {
    'layout.changed': props.onLayoutChanged ?? null,
    'member.joined': props.onMemberJoined ?? null,
    'member.left': props.onMemberLeft ?? null,
    'member.talking': props.onMemberTalking ?? null,
    'member.updated': props.onMemberUpdated ?? null,
    'memberList.updated': props.onMemberListUpdated ?? null,
    'playback.ended': props.onPlaybackEnded ?? null,
    'playback.started': props.onPlaybackStarted ?? null,
    'playback.updated': props.onPlaybackUpdated ?? null,
    'recording.ended': props.onRecordingEnded ?? null,
    'recording.started': props.onRecordingStarted ?? null,
    'recording.updated': props.onRecordingUpdated ?? null,
    'room.joined': props.onRoomJoined ?? null,
    'room.updated': props.onRoomUpdated ?? null,
  };

  for (const [eventName, eventValue] of Object.entries(eventMap)) {
    React.useEffect(() => {
      if (roomSession && eventValue)
        roomSession.on(eventName as any, eventValue);

      return () => {
        roomSession?.off(eventValue as any);
      };
    }, [roomSession, eventValue]);
  }

  return <>{children}</>;
};

export default Video;
