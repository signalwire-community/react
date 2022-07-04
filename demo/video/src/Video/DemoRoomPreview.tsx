import { useEffect, useState } from 'react';
import type { Video } from "@signalwire/js"
import { VideoConference, RoomPreview } from '@signalwire-community/react';

function DemoConference() {
  const [roomSession, setRoomSession] = useState<Video.RoomSession | undefined>(undefined);

  // useRoomPreview() would be helpful here. Since `roomSession` never changes,
  // this component doesn't know when its inner `previewUrl` prop changes. This
  // means that this component won't rerender, and our RoomPreview will always
  // see the first `previewUrl` (which is undefined). For now, we just manually
  // update `previewUrl` by manually subscribing to the events.
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (roomSession) {
      roomSession.on('room.joined', () => setPreviewUrl(roomSession.previewUrl))
    } else {
      setPreviewUrl(undefined)
    }
  }, [roomSession]);

  return (<div>
    <div>
      <RoomPreview previewUrl={previewUrl} loadingUrl={'https://swrooms.com/swloading.gif'} style={{height: 150}} />
    </div>
    <div style={{ maxHeight: 'calc(100vh - 200px - 50px)', aspectRatio: '16/9' }}>
      <VideoConference
        token="vpt_78f91a752d4d9c685e47bd4a19fe72c1"
        onRoomReady={setRoomSession}
      />
    </div>
  </div>
  );
}

export default DemoConference;
