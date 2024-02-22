import { RefObject } from "react";
import type { SignalWire } from "@signalwire/js";
export type SignalWireContract = Awaited<ReturnType<typeof SignalWire>>;
export type SignalWireOptions = Parameters<typeof SignalWire>[0];

export type CallOptions = Parameters<SignalWireContract["dial"]>[0];

export type Call = any; // Eventually this will describe the call object

export interface CallEvents {
  onRoomReady?: (roomSession: Call) => void;
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

export interface IVideoProps
  extends CallEvents,
    Omit<CallOptions, "rootElement" | "token" | "to"> {
  client: SignalWireContract;
  address: any;
  audio: boolean;
  video: boolean;

  children: React.ReactNode;
  rootElement?: RefObject<HTMLElement>;
}
