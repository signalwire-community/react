import React, { useRef } from "react";
import { CoreVideo } from "./CoreVideo";
import { SignalWireContract } from "./types";

type CallEvents = {
  onCallReady?: (call: any) => void;
};

interface CallParams extends CallEvents {
  client: SignalWireContract;
  address: any;
  hideVideo?: boolean;
}

export function Call({
  client,
  address,
  hideVideo = false,
  ...props
}: CallParams) {
  const ref = useRef<any>(null);

  return client ? (
    <CoreVideo
      client={client}
      address={address}
      audio={true}
      video={true}
      rootElement={ref}
      onRoomReady={props.onCallReady}
    >
      <div
        ref={(r) => {
          // this will need a better interface
          if (hideVideo !== true) {
            // @ts-expect-error Property '__wsClient' does not exist on type 'SignalWireContract'
            client.__wsClient.options.rootElement = r;
            ref.current = r;
          }
        }}
      ></div>
    </CoreVideo>
  ) : null;
}
