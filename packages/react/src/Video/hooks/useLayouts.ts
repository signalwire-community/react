import type { CallSession } from '@signalwire/client';
import { useEffect, useState } from 'react';

type SetLayoutParams = Parameters<CallSession['setLayout']>;

/**
 * Given an active CallSession, maintains a list of all layouts, the current layout, and a function to change them
 * @param `CallSession` or `null`
 * @returns an object with `currentLayout`, `layouts` and `setLayout()`
 */
export default function useLayouts(roomSession: CallSession | null) {
  const [layouts, setLayouts] = useState<string[]>([]);
  const [currentLayout, setCurrentLayout] = useState('');

  useEffect(() => {
    if (!roomSession) return;

    async function onRoomJoined(room: any) {
      setCurrentLayout(room.room_session.layout_name);

      const layout_list = (await roomSession?.getLayouts())?.layouts;
      setLayouts(layout_list || []);
    }

    async function onLayoutChanged(e: any) {
      setCurrentLayout(e.layout.name);
    }

    roomSession.on('room.joined', onRoomJoined);
    roomSession.on('layout.changed', onLayoutChanged);

    return () => {
      roomSession.off('room.joined', onRoomJoined);
      roomSession.off('layout.changed', onLayoutChanged);
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
