import React from 'react';
import type * as SignalWire from '@signalwire/js';
import BaseStream from '../BaseStream';

export type IRemoteStreamProps = {
  style?: any;
  roomSession?: SignalWire.Video.RoomSession;
  url?: string;
};

/**
 * Displays a remote stream. You can pass either a RoomSession, or a stream URL.
 */
export default function RemoteStream(params: IRemoteStreamProps) {
  return <BaseStream {...params} streamSource="remote" />;
}
