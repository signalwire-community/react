export interface IVideoCommonProps {
  token: string;
  onRoomUpdate: (updateObject: {
    roomSession?: any;
    microphones?: any;
    cameras?: any;
    speakers?: any;
    layouts?: any;
  }) => void;
  onEvent: (eventName: string, event: any) => void;
}
