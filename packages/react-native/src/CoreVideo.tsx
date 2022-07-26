import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import * as SignalWire from '@signalwire/js';
import type { IVideoProps } from './IVideoProps';
import { debounce } from 'lodash'

export interface ICoreVideoProps extends IVideoProps {
  rootElement?: RefObject<HTMLElement>;
  children?: JSX.Element;
}

const CoreVideo: React.FC<ICoreVideoProps> = ({
  children,
  onRoomReady,
  ...props
}) => {
  const [roomSession, setRoomSession] = useState<SignalWire.Video.RoomSession | null>(null);

  // This is used to access the current roomSession from useEffect without it
  // becoming a dependency.
  const roomSessionRef = useRef<SignalWire.Video.RoomSession | null>()
  roomSessionRef.current = roomSession

  useEffect(() => {
    try {
      setup(props)
    } catch (e) {
      console.error("Couldn't join room", e);
    }
  }, [props.token]); // changing the other props won't result in a rejoin

  /**
   * Establish a new RoomSession connection
   */
  const setup = useCallback(
    debounce(async (props: ICoreVideoProps) => {
      if (roomSessionRef.current) {
        await quitSession(roomSessionRef.current)
        setRoomSession(null)
        // @ts-ignore
        if (props.rootElement?.current?.innerHTML) {
          // @ts-ignore
          props.rootElement.current.innerHTML = ""
        }
      }

      const curRoomSession = new SignalWire.Video.RoomSession({
        token: props.token,
        rootElement: props.rootElement?.current ?? undefined,
        applyLocalVideoOverlay: props.applyLocalVideoOverlay,
        audio: props.audio,
        iceServers: props.iceServers,
        logLevel: props.logLevel,
        speakerId: props.speakerId,
        stopCameraWhileMuted: props.stopCameraWhileMuted,
        stopMicrophoneWhileMuted: props.stopMicrophoneWhileMuted,
        video: props.video,
      });
      setRoomSession(curRoomSession);
      onRoomReady?.(curRoomSession);
      await curRoomSession.join();

      return curRoomSession
    }, 100),
    []
  )

  /** Cleanup when the component is unmounted */
  useEffect(() => {
    return () => {
      if (roomSessionRef.current) {
        quitSession(roomSessionRef.current)
        setRoomSession(null)
        // @ts-ignore
        if (props.rootElement?.current?.innerHTML) {
          // @ts-ignore
          props.rootElement.current.innerHTML = ""
        }
      }
    }
  }, [])

  /**
   * Robust way for disconnecting a RoomSession
   */
  const quitSession = async (roomSession: SignalWire.Video.RoomSession) => {
    // Ensure the room is in a joined state first, since we don't have a way to
    // abort an in-progress join.
    try {
      await roomSession.join()
    } catch (e) {}

    // Initiate disconnection
    try {
      roomSession.removeAllListeners();
      roomSession.on('room.joined', async () => {
        await roomSession?.leave()
        roomSession.destroy();
      })
      await roomSession.leave();
      roomSession.destroy();
    } catch (e) { console.log(e) }
  }

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
      if (roomSession && eventValue) {
        roomSession.on(eventName as any, eventValue);
      }

      return () => {
        roomSession?.off(eventName as any, eventValue as any);
      };
    }, [roomSession, eventValue]);
  }

  return <>{children}</>;
};

export default CoreVideo;
