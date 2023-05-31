import LocalStream from './LocalStream';
import RemoteStream from './RemoteStream';
import Video from './Video';
import { useSWClient } from './SWClient';
import { useAddresses } from '@signalwire-community/react';
import * as Fabric from './Fabric';

export default {
  LocalStream,
  RemoteStream,
  Video,
  useSWClient,
  useAddresses,
  Fabric,
};

export { LocalStream, RemoteStream, Video, useSWClient, useAddresses, Fabric };
