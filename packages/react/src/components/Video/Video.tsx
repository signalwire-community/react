import React, { RefObject, useRef } from 'react';
import CoreVideo from './CoreVideo';
import { IVideoProps } from './IVideoProps';
export default function Video({ token, ...props }: IVideoProps) {
  const ref = useRef<HTMLElement | null>(null);
  return token ? (
    <CoreVideo
      token={token}
      rootElement={ref as RefObject<HTMLElement>}
      {...props}
    >
      <div
        ref={(r) => {
          ref.current = r;
        }}
      ></div>
    </CoreVideo>
  ) : null;
}
