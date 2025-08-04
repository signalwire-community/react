import React from 'react';
import * as SignalWire from '@signalwire/client';
import BaseStream from '../BaseStream';

export type ILocalStreamProps = {
  style?: any;
  roomSession?: SignalWire.CallSession | any;
};

export default function LocalStream(params: ILocalStreamProps) {
  return <BaseStream {...params} streamSource="local" />;
}