import { Video } from "@signalwire/js";
import { RoomSessionScreenShare } from "@signalwire/js/dist/js/src/RoomSessionScreenShare";
import { useEffect, useState } from "react";

type ScreenShareParams = Parameters<Video.RoomSession["startScreenShare"]>;

export default function useScreenShare(roomSession: Video.RoomSession | null) {
  const [screenShareObject, setScreenShareObject] =
    useState<RoomSessionScreenShare | null>(null);
  const [state, setState] = useState<boolean>(false);

  //TODO: what event fires if my screen share has been removed by a moderator?
  // useEffect subscribe to that event
  // Why does screenShareObject not have an `id` param?

  async function start(params?: ScreenShareParams[0]) {
    if (roomSession === null) return;
    if (screenShareObject !== null) return; //already screen sharing
    if (params) params.autoJoin = true;
    let sc = await roomSession?.startScreenShare(params ?? { autoJoin: true });
    setScreenShareObject(sc);
    setState(true);
  }

  async function stop() {
    await screenShareObject?.leave();
    setState(false);
    setScreenShareObject(null);
  }
  return {
    screenShareObject,
    start,
    stop,
    state,
    async toggle() {
      if (screenShareObject === null) await start();
      else await stop();
    },
  };
}
