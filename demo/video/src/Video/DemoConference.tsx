import { useState } from "react";
import { VideoConference } from "@signalwire-community/video-conference-react";

function DemoConference() {
  const [user, setUser] = useState("guest");
  return (
    <div style={{ maxHeight: "100vh", aspectRatio: "16/9" }}>
      <VideoConference
        token="vpt_78f91a752d4d9c685e47bd4a19fe72c1"
        userName={user}
      />
      <button
        onClick={() => {
          setUser(user + "X");
        }}
      >
        change username
      </button>
    </div>
  );
}

export default DemoConference;
