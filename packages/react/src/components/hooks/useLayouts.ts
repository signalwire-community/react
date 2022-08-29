import { Video, VideoPositions } from "@signalwire/js";
import { useEffect, useState } from "react";

export default function useLayouts(roomSession: Video.RoomSession | null) {
  const [layouts, setLayouts] = useState<string[]>([]);
  const [currentLayout, setCurrentLayout] = useState("");
  useEffect(() => {
    if (roomSession === null || roomSession === undefined) return;
    roomSession.on("room.joined", async (room) => {
      let layout_list = (await roomSession.getLayouts()).layouts;
      setLayouts(layout_list);
      setCurrentLayout(room.room_session.layout_name);
    });
    roomSession.on("layout.changed", (e) => {
      setCurrentLayout(e.layout.name);
    });
  }, [roomSession]);
  return {
    layouts,
    setLayout(name: string, positions?: VideoPositions) {
      roomSession?.setLayout({ name, positions });
    },
    currentLayout,
  };
}
