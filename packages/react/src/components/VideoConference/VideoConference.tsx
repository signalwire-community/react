import React from "react";
import CoreVideoConference from "./CoreVideoConference";

type VideoConferenceProps = {
  onRoomReady?: (roomSession: any) => void,
  token: string,
  userName?: string,
  theme?: 'light' | 'dark' | 'auto',
  audio?: MediaTrackConstraints,
  video?: MediaTrackConstraints,
  memberList?: boolean,
  prejoin?: boolean,
  onLayoutChanged?: (e: any) => void,
  onMemberJoined?: (e: any) => void,
  onMemberLeft?: (e: any) => void,
  onMemberTalking?: (e: any) => void,
  onMemberUpdated?: (e: any) => void,
  onMemberListUpdated?: (e: any) => void,
  onPlaybackEnded?: (e: any) => void,
  onPlaybackStarted?: (e: any) => void,
  onPlaybackUpdated?: (e: any) => void,
  onRecordingEnded?: (e: any) => void,
  onRecordingStarted?: (e: any) => void,
  onRecordingUpdated?: (e: any) => void,
  onRoomJoined?: (e: any) => void,
  onRoomUpdated?: (e: any) => void,
}

export default function VideoConference(props: VideoConferenceProps) {

  const [roomSession, setRoomSession] = React.useState<any>()

  const eventMap = {
    'layout.changed': props.onLayoutChanged,
    'member.joined': props.onMemberJoined,
    'member.left': props.onMemberLeft,
    'member.talking': props.onMemberTalking,
    'member.updated': props.onMemberUpdated,
    'memberList.updated': props.onMemberListUpdated,
    'playback.ended': props.onPlaybackEnded,
    'playback.started': props.onPlaybackStarted,
    'playback.updated': props.onPlaybackUpdated,
    'recording.ended': props.onRecordingEnded,
    'recording.started': props.onRecordingStarted,
    'recording.updated': props.onRecordingUpdated,
    'room.joined': props.onRoomJoined,
    'room.updated': props.onRoomUpdated,
  }

  // Attach event handlers
  for (const [key, value] of Object.entries(eventMap)) {
    React.useEffect(() => {
      if (roomSession && value) {
        roomSession.on(key, value)
      }
      return () => {
        roomSession?.off(key, value)
      }
    }, [roomSession, value])
  }

  function onRoomReady(roomSession: any) {
    setRoomSession(roomSession)
    if (props.onRoomReady) {
      props.onRoomReady(roomSession)
    }
  }

  return <CoreVideoConference
    token={props.token}
    onRoomReady={onRoomReady}
    userName={props.userName}
    theme={props.theme}
    audio={props.audio}
    video={props.video}
    memberList={props.memberList}
    prejoin={props.prejoin}
  />

}
