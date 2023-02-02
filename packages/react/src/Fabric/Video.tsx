import React, { useRef } from "react";
import { CoreVideo } from "./";
import { Fabric } from "@signalwire/js";

export function Video({
  client,
  address,
}: {
  client: Fabric.Client;
  address: any;
}) {
  const ref = useRef(null);
  return client ? (
    <CoreVideo client={client} address={address} audio={true} video={true}>
      <div ref={ref}></div>
    </CoreVideo>
  ) : null;
}
