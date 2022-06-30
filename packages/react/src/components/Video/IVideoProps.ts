import { Video } from '@signalwire/js';
import { RefObject } from 'react';
type RoomSessionOptions = ConstructorParameters<Video.RoomSession>[0];

export interface IVideoProps extends Omit<RoomSessionOptions, 'rootElement'> {
  onRoomReady?: (roomSession: Video.RoomSession) => void;
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
