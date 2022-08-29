import { Video, VideoPositions } from "@signalwire/js";
import { useEffect, useState } from "react";

export default function useLayouts(roomSession: Video.RoomSession | null) {
  const [layouts, setLayouts] = useState<string[]>([]);
  const [currentLayout, setCurrentLayout] = useState("");
  useEffect(() => {
    if (roomSession === null || roomSession === undefined) return;
    async function onRoomJoined(room: any) {
      let layout_list = (await roomSession?.getLayouts())?.layouts;
      setLayouts(layout_list || []);
      setCurrentLayout(room.room_session.layout_name);
    }
    async function onLayoutChanged(e: any) {
      setCurrentLayout(e.layout.name);
    }
    roomSession.on("room.joined", onRoomJoined);
    roomSession.on("layout.changed", onLayoutChanged);

    return () => {
      roomSession.off("layout.changed", onLayoutChanged);
      roomSession.off("layout.changed", onLayoutChanged);
    };
  }, [roomSession]);
  return {
    layouts,
    setLayout(name: string, positions?: VideoPositions) {
      roomSession?.setLayout({ name, positions });
    },
    currentLayout,
  };
}
