import React from "react";
import { Fabric, Video } from "@signalwire/js";
import { useEffect, useRef } from "react";

export default function CoreVideo({
  client,
  audio = true,
  video = true,
}: {
  client: Fabric.Client;
  audio: boolean;
  video: boolean;
}) {
  let roomSessionRef = useRef<null | Video.RoomSession>(null);
  let ref = useRef<any>(null);
  useEffect(() => {
    if (client === null || ref.current === null) return;
    (async () => {
      const { addresses } = await client.getAddresses();

      // Call the first address/channel
      const call = await client.createCall({
        uri: addresses[0].channels.video,
        rootElement: ref.current,
      });
      roomSessionRef.current = call;
      //@ts-expect-error
      await call.start({ audio, video });
    })();
  }, [client]);

  return <div ref={ref}></div>;
}
