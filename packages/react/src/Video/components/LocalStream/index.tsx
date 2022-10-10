import React from 'react';
import * as SignalWire from '@signalwire/js';
import BaseStream from '../BaseStream';

export type ILocalStreamProps = {
  style?: any;
  roomSession?: SignalWire.Video.RoomSession;
};

export default function LocalStream(params: ILocalStreamProps) {
  return <BaseStream {...params} streamSource="local" />;
}