import React from 'react';
import type * as SignalWire from '@signalwire/client';
import BaseStream from '../BaseStream';

export type IRemoteStreamProps = {
  style?: any;
  roomSession?: SignalWire.CallSession;
};

/**
 * Displays a remote RoomSession stream.
 */
export default function RemoteStream(params: IRemoteStreamProps) {
  return <BaseStream {...params} streamSource="remote" />;
}
