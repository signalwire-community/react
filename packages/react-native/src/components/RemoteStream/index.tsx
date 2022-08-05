import React from 'react';
import type * as SignalWire from '@signalwire/js';
import BaseStream from '../BaseStream';

export type IRemoteStreamProps = {
  style?: any;
  roomSession?: SignalWire.Video.RoomSession
  url?: string;
}

export default function RemoteStream(params: IRemoteStreamProps) {
  return <BaseStream {...params} streamSource="remote" />;
}
