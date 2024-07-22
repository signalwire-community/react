import React, { useRef } from "react";
import { CoreVideo } from "./CoreVideo";
import { SignalWireContract, CallEvents } from "./types";

interface CallParams extends CallEvents {
  client: SignalWireContract;
  address: any;
  hideVideo?: boolean;
  onCallReady?: (call: any) => void;
  audio?: boolean;
  video?: boolean;
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
      {...props}
    >
      <div
        ref={(r) => {
          // todo: update to the new buildVideo interface
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
