import {
  VideoBase,
  useRoomSession,
  useWebRTC,
} from "@signalwire-community/react";
import { useState, useRef } from "react";

function App() {
  let rootElement = useRef(null);
  const [roomSession, setRoomSession] = useState(null);
  let {
    audioMuted,
    muteAudio,
    videoMuted,
    muteVideo,
    speakerMuted,
    muteSpeaker,
    members,
    shareScreen,
  } = useRoomSession(roomSession, []);

  let { speakers, microphones, cameras } = useWebRTC();

  const [screenShareList, setScreenShareList] = useState([]);

  return (
    <div>
      <VideoBase
        token="eyJ0eXAiOiJWUlQiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NTU3MTA2MDksImp0aSI6ImYzNTk0ZjE5LTIzMGItNDE4ZC05OTNlLTYxYWYyZjU5YjAxNiIsInN1YiI6ImMzYWQ3NzE2LTAxYjQtNGMzZi05N2FiLWRmMjIxMTM1YWFiMiIsInUiOiJuaXJhdiIsInIiOiJteXJvb20iLCJzIjpbInJvb20ubGlzdF9hdmFpbGFibGVfbGF5b3V0cyIsInJvb20uc2VsZi5hdWRpb19tdXRlIiwicm9vbS5zZWxmLmF1ZGlvX3VubXV0ZSIsInJvb20uc2VsZi52aWRlb19tdXRlIiwicm9vbS5zZWxmLnZpZGVvX3VubXV0ZSIsInJvb20uc2VsZi5kZWFmIiwicm9vbS5zZWxmLnVuZGVhZiIsInJvb20uc2VsZi5zZXRfaW5wdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9vdXRwdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9pbnB1dF9zZW5zaXRpdml0eSIsInJvb20uaGlkZV92aWRlb19tdXRlZCIsInJvb20uc2hvd192aWRlb19tdXRlZCIsInJvb20uc2V0X2xheW91dCIsInJvb20ubWVtYmVyLmF1ZGlvX211dGUiLCJyb29tLm1lbWJlci5hdWRpb191bm11dGUiLCJyb29tLm1lbWJlci5kZWFmIiwicm9vbS5tZW1iZXIudW5kZWFmIiwicm9vbS5tZW1iZXIucmVtb3ZlIiwicm9vbS5tZW1iZXIuc2V0X2lucHV0X3NlbnNpdGl2aXR5Iiwicm9vbS5tZW1iZXIuc2V0X2lucHV0X3ZvbHVtZSIsInJvb20ubWVtYmVyLnNldF9vdXRwdXRfdm9sdW1lIiwicm9vbS5tZW1iZXIudmlkZW9fbXV0ZSIsInJvb20ubWVtYmVyLnZpZGVvX3VubXV0ZSJdLCJhY3IiOnRydWUsImVycCI6dHJ1ZSwibXRhIjp7fSwicm10YSI6e319.U_xvq-Q3W722Ane5D_TADdlTPpr7PWXnjZnsv6sQg2Fcr7Ct8x6YwTUv2GXqagwMYJuDHTYr7qSoZD9l-eqyiA"
        rootElement={rootElement}
        onRoomSessionInit={(roomSession) => {
          setRoomSession(roomSession);
        }}
      >
        <div
          ref={(ref) => {
            rootElement.current = ref;
          }}
          style={{ width: 800, height: 600 }}
        ></div>
      </VideoBase>

      <div>
        <button
          onClick={(e) => {
            muteAudio(!audioMuted);
          }}
        >
          {audioMuted ? "Unmute Audio" : "Mute Audio"}
        </button>
        <button
          onClick={(e) => {
            muteVideo(!videoMuted);
          }}
        >
          {videoMuted ? "Unmute Video" : "Mute Video"}
        </button>
        <button
          onClick={(e) => {
            muteSpeaker(!speakerMuted);
          }}
        >
          {speakerMuted ? "Unmute Speaker" : "Mute Speaker"}
        </button>

        <div>
          <h2>Members</h2>
          {members.map((member) => (
            <div key={member.id}>{member.name}</div>
          ))}
        </div>

        <div>
          <h2>Cameras</h2>
          {cameras.map((camera) => (
            <div key={camera.id}>{camera.label}</div>
          ))}
        </div>
        <div>
          <h2>microphones</h2>
          {microphones.map((microphone) => (
            <div key={microphone.id}>{microphone.label}</div>
          ))}
        </div>
        <div>
          <h2>speakers</h2>
          {speakers.map((speaker) => (
            <div key={speaker.id}>{speaker.label}</div>
          ))}
        </div>

        <div>
          <h2>Share Screen(s)</h2>
          <button
            onClick={async (x) => {
              const newShare = await shareScreen();
              setScreenShareList((s) => [...s, newShare]);
            }}
          >
            Add screen share
          </button>
          {screenShareList.map((turnoff, index) => (
            <button
              key={index}
              onClick={async (e) => {
                await turnoff();
                setScreenShareList((s) => s.filter((x) => x !== turnoff));
              }}
            >
              Turn off this Screen share
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
