import React, { RefObject, useRef } from "react";
import CoreVideo from "./CoreVideo";
import { IVideoProps } from "./IVideoProps";
export default function Video({ token, ...props }: IVideoProps | any) {
  const ref = useRef(null);

  return token ? (
    <CoreVideo
      token={token}
      rootElement={ref as RefObject<HTMLElement>}
      {...props}
    >
      <div ref={ref}></div>
    </CoreVideo>
  ) : null;
}
