import VideoBase from "./Video";
import { IVideoCommonProps } from "./IVideoCommonProps";
import { Video } from "@signalwire/js";
import { useState } from "react";
interface IVideoNativeProps extends IVideoCommonProps {
  rtcViewStyle: React.CSSProperties;
}

const VideoNative: React.FC<IVideoNativeProps> = ({
  token,
  onRoomUpdate = () => {},
  onEvent = (eventName, event) => {
    console.log(eventName, event);
  },
  rtcViewStyle = {
    top: 0,
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  ...props
}) => {
  const [roomSession, setRoomSession] = useState<Video.RoomSession | null>(
    null
  );
  return <div></div>;
  // return (
  //   <VideoBase
  //     token={token}
  //     onRoomJoined={(roomSession, memberId) => {
  //       console.log("Room was joined");
  //       setRoomSession(roomSession);
  //     }}
  //     onEvent={(eventName, event) => {
  //       // eventName handler here if any
  //       onEvent(eventName, event);
  //     }}
  //   >
  //     <div {...props}>
  //       {roomSession !== null && roomSession.remoteStream && (
  //         <RTCView
  //           streamURL={roomSession.remoteStream.toURL()}
  //           style={{ ...rtcViewStyle }}
  //         />
  //       )}
  //     </div>
  //   </VideoBase>
  // );
};

export default VideoNative;
