import React from "react";
import { CoreVideo } from "./";
import { Fabric } from "@signalwire/js";

export function Video({
  client,
  address,
}: {
  client: Fabric.Client;
  address: any;
}) {
  return client ? (
    <CoreVideo client={client} address={address} audio={true} video={false} />
  ) : null;
}
