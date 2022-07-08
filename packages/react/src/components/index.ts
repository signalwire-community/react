import _CoreVideo from './Video/CoreVideo';
import { ICoreVideoProps as _ICoreVideoProps } from './Video/CoreVideo';

export { default as RoomPreview } from './RoomPreview';
export { default as Video } from './Video';
export { default as VideoConference } from './VideoConference';

/** @ignore */
export namespace __internal {
    export namespace Video {
        export const CoreVideo = _CoreVideo
        export type ICoreVideoProps = _ICoreVideoProps
    }
}
