import React from 'react';
import type * as SignalWire from '@signalwire/js';
import BaseStream from '../BaseStream';

export type ILocalStreamProps = {
  style?: any;
  roomSession?: SignalWire.Video.RoomSession;
  url?: string;
};

/**
 * Displays a local stream. You can pass either a RoomSession, or a stream URL.
 */
export default function LocalStream(params: ILocalStreamProps) {
  return <BaseStream {...params} streamSource="local" />;
}
