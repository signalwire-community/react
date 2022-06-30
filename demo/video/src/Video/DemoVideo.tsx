import SignalWire from '@signalwire/js';
import { Video } from '@signalwire-community/react';
import { useState, useRef } from 'react';

function DemoVideo() {
  const [roomSession, setRoomSession] =
    useState<SignalWire.Video.RoomSession | null>(null);
  return (
    <div>
      {import.meta.env.VITE_ROOM_TOKEN ? (
        <Video
          video={false}
          token={import.meta.env.VITE_ROOM_TOKEN}
          onRoomReady={(roomSession) => {
            setRoomSession(roomSession);
            console.log(roomSession);
          }}
        />
      ) : (
        'No Token Present. Please set your env variable'
      )}
    </div>
  );
}

export default DemoVideo;
