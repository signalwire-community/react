import _CoreVideo from "./Video/CoreVideo";
import { ICoreVideoProps as _ICoreVideoProps } from "./Video/CoreVideo";

export { default as LocalStream } from "./LocalStream";
export { default as RemoteStream } from "./RemoteStream";
export { default as RoomPreview } from "./RoomPreview";
export { default as Video } from "./Video";
export { default as VideoConference } from "./VideoConference";

export { IVideoProps } from "./Video";

/** @ignore */
export namespace __internal {
  export namespace Video {
    export const CoreVideo = _CoreVideo;
    export type ICoreVideoProps = _ICoreVideoProps;
  }
}
