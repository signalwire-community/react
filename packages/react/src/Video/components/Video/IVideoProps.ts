import type { CallSession } from '@signalwire/client';
import type { SDKStore } from '@signalwire/core'; // ako ti je dostupan

export interface RoomSessionOptions {
  attach?: boolean;
  remoteSdp?: string;
  speakerId?: string;
  prevCallId?: string;
  store?: SDKStore;
}

export interface IVideoProps extends RoomSessionOptions {
  onRoomReady?: (roomSession: CallSession) => void;
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
  onRoomLeft?: (e: any) => void;
  onRoomUpdated?: (e: any) => void;
}
