import { Video } from "@signalwire/js";
import { RoomSessionScreenShare } from "@signalwire/js/dist/js/src/RoomSessionScreenShare";
import { VideoMemberHandlerParams } from "@signalwire/js/dist/js/src/video";
import { useEffect, useState } from "react";

type ScreenShareParams = Omit<
  Parameters<Video.RoomSession["startScreenShare"]>,
  "autoJoin"
>;

/**
 * Given RoomSession, returns a set of easier controls for ScreenSharing:
 * `{ start(), stop(), state, toggle() ... }`
 */
export default function useScreenShare(roomSession: Video.RoomSession | null) {
  const [screenShareObject, setScreenShareObject] =
    useState<RoomSessionScreenShare | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (memberId === null) return;
    function onMemberLeft(e: VideoMemberHandlerParams) {
      if (e.member.id === memberId) {
        setScreenShareObject(null);
        setMemberId(null);
      }
    }
    roomSession?.on("member.left", onMemberLeft);
    return () => {
      roomSession?.off("member.left", onMemberLeft);
    };
  }, [memberId, roomSession]);

  async function start(params?: ScreenShareParams[0]) {
    if (roomSession === null) return;
    if (screenShareObject !== null) return; //already screen sharing
    if (params) params.autoJoin = true;
    const sc = await roomSession?.startScreenShare(params ?? { autoJoin: true });
    setScreenShareObject(sc);
    setMemberId(sc.memberId ?? (sc as any).activeRTCPeerId);
  }

  async function stop() {
    await screenShareObject?.leave();
    setScreenShareObject(null);
    setMemberId(null);
  }
  return {
    screenShareObject,
    start,
    stop,
    state: !!screenShareObject,
    async toggle() {
      if (screenShareObject === null) await start();
      else await stop();
    },
  };
}
