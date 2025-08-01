import { CallSession } from "@signalwire/client";
import { useEffect, useState } from "react";

/**
 * Same as the original StartScreenShareOptions, but without the `autoJoin`
 * property since we force it to `true`.
 */

/**
 * Given RoomSession, returns a set of easier controls for ScreenSharing:
 * `{ start(), stop(), active, toggle() ... }`
 */
export default function useScreenShare(roomSession: CallSession | null) {
  const [screenShareObject, setScreenShareObject] =
    useState<any | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (memberId === null) return;
    function onMemberLeft(e: any) {
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

  async function start(params?: any) {
    if (roomSession === null) return;
    if (screenShareObject !== null) return; //already screen sharing

    // Force autoJoin
    const screenShareOptions: any | undefined = params
    if (screenShareOptions) {
      screenShareOptions.autoJoin = true;
    }

    const sc = await roomSession?.startScreenShare(screenShareOptions ?? { autoJoin: true });
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
    active: !!screenShareObject,
    async toggle() {
      if (screenShareObject === null) await start();
      else await stop();
    },
  };
}
