import React, { useEffect, useState } from 'react';
import * as SignalWire from '@signalwire/js';
import { IVideoProps } from './IVideoProps';

interface ICoreVideoProps extends IVideoProps {
  children?: JSX.Element;
}

const CoreVideo: React.FC<ICoreVideoProps> = ({
  token,
  children,
  onRoomReady,
  ...props
}) => {
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);
  useEffect(() => {
    let curRoomSession: SignalWire.Video.RoomSession | null = null;
    async function setup() {
      const {
        applyLocalVideoOverlay,
        audio,
        iceServers,
        logLevel,
        speakerId,
        stopCameraWhileMuted,
        stopMicrophoneWhileMuted,
        video,
        rootElement,
      } = props;
      curRoomSession = new SignalWire.Video.RoomSession({
        token,
        rootElement: rootElement?.current ?? undefined,
        applyLocalVideoOverlay,
        audio,
        iceServers,
        logLevel,
        speakerId,
        stopCameraWhileMuted,
        stopMicrophoneWhileMuted,
        video,
      });
      setRoomSession(curRoomSession);
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
        console.log(curRoomSession, 'BINGO');
        curRoomSession?.leave();
      } catch (e) {
        console.log("The room wasn't joined yet.");
      }
    };
  }, [token]);

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
        roomSession?.off(eventName as any, eventValue as any);
      };
    }, [roomSession, eventValue]);
  }

  return <>{children}</>;
};

export default CoreVideo;
