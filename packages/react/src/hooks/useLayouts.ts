import { Video } from "@signalwire/js";
import { useEffect, useState } from "react";

type SetLayoutParams = Parameters<Video.RoomSession["setLayout"]>;

/**
 * Given an active RoomSession, maintains a list of all layouts, the current layout, and a function to change them
 * @param `RoomSession` or `null`
 * @returns an object with `current_layout`, `layouts` and `setLayout()`
 */
export default function useLayouts(roomSession: Video.RoomSession | null) {
  const [layouts, setLayouts] = useState<string[]>([]);
  const [currentLayout, setCurrentLayout] = useState("");
  useEffect(() => {
    if (roomSession === null || roomSession === undefined) return;
    async function onRoomJoined(room: any) {
      const layout_list = (await roomSession?.getLayouts())?.layouts;
      setLayouts(layout_list || []);
      setCurrentLayout(room.room_session.layout_name);
    }
    async function onLayoutChanged(e: any) {
      setCurrentLayout(e.layout.name);
    }
    roomSession.on("room.joined", onRoomJoined);
    roomSession.on("layout.changed", onLayoutChanged);

    return () => {
      roomSession.off("room.joined", onRoomJoined);
      roomSession.off("layout.changed", onLayoutChanged);
    };
  }, [roomSession]);
  return {
    layouts,
    setLayout(...params: SetLayoutParams) {
      roomSession?.setLayout(...params);
    },
    currentLayout,
  };
}
