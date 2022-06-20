import { useState } from "react";
import { VideoWeb } from "@signalwire-community/react";

function App() {
  const [loading, setLoading] = useState(true);
  const [roomVariables, setRoomVariables] = useState({});
  const [roomSession, setRoomSession] = useState();
  return (
    <div>
      {loading && "Loading ..."}
      <VideoWeb
        style={{ width: 800, height: 600 }}
        token="YOUR TOKEN HERRE"
        onRoomUpdate={(roomVars) => {
          setLoading(false);
          setRoomSession((r) => roomVars.roomSession ?? r);
          setRoomVariables((r) => ({ ...r, ...roomVars }));
        }}
      />

      <div>
        {[
          ["speakers", "updateSpeaker"],
          ["microphones", "updateMicrophone"],
          ["cameras", "updateCamera"],
        ].map((item) => (
          <div key={item[0]}>
            <b>{item[0]}</b>
            {roomVariables &&
              roomVariables?.[item[0]]?.map((d) => (
                <div key={d.id}>
                  <button
                    onClick={async (e) => {
                      console.log(d);
                      await roomSession?.[item[1]]({ deviceId: d.id });
                      roomSession.updateMicrophone({ deviceId: d.id });
                      console.log("Done");
                    }}
                  >
                    {d.label}
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
