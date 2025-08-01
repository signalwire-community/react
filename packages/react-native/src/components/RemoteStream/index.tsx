import React from 'react';
import type * as SignalWire from '@signalwire/client';
import BaseStream from '../BaseStream';

export type IRemoteStreamProps = {
  style?: any;
  roomSession?: SignalWire.CallSession;
  memberStates: Record<string, { isMuted: boolean; isTalking: boolean; hasHandRaised: boolean }>;
  userPositions: Record<string, { x: number; y: number; width: number; height: number }>;
  address?: any;
  updatedCamera?: boolean;
};

/**
 * Displays a remote RoomSession stream.
 */
const RemoteStream = React.memo(function RemoteStream(params: IRemoteStreamProps) {
  return <BaseStream key={params?.updatedCamera?.toString()} {...params} streamSource="remote" />;
}, (prevProps, nextProps) => {
  // Ponovo renderuj samo ako se promeni roomSession, hideVideo ili ako se drastično promene stanja ili pozicije
  return (
    prevProps.roomSession === nextProps.roomSession &&
    prevProps.style === nextProps.style &&
    prevProps.address === nextProps.address &&
    JSON.stringify(prevProps.memberStates) === JSON.stringify(nextProps.memberStates) &&
    JSON.stringify(prevProps.userPositions) === JSON.stringify(nextProps.userPositions)
  );
});

export default RemoteStream;
