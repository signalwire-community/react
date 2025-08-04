import React from 'react';
import type * as SignalWire from '@signalwire/client';
import BaseStream from '../BaseStream';

export type ILocalStreamProps = {
  style?: any;
  roomSession?: SignalWire.CallSession;
};

/**
 * Displays a local RoomSession stream.
 */
export default function LocalStream(params: ILocalStreamProps) {
  return <BaseStream {...params} streamSource="local" />;
}
