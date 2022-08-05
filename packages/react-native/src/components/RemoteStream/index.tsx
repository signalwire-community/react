import React from 'react';
import type * as SignalWire from '@signalwire/js';
import BaseStream from '../BaseStream';

export type ILocalStreamProps = {
  style: any;
} & (
  | {
      roomSession: SignalWire.Video.RoomSession;
    }
  | {
      url: string;
    }
);

export default function LocalStream(params: ILocalStreamProps) {
  return <BaseStream {...params} streamSource="remote" />;
}
