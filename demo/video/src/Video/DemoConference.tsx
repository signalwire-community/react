import { useState } from "react";
import { VideoConference } from "@signalwire-community/react";

function DemoConference() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <VideoConference token="vpt_78f91a752d4d9c685e47bd4a19fe72c1" />
    </div>
  );
}

export default DemoConference;
