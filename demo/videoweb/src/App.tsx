import { Video } from '@signalwire-community/react';
import { useState, useRef } from 'react';

function App() {
  let rootElement = useRef<HTMLDivElement | null>(null);
  const [roomSession, setRoomSession] = useState(null);

  return (
    <div>
      <Video
        token="eyJ0eXAiOiJWUlQiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE2NTU3MTA2MDksImp0aSI6ImYzNTk0ZjE5LTIzMGItNDE4ZC05OTNlLTYxYWYyZjU5YjAxNiIsInN1YiI6ImMzYWQ3NzE2LTAxYjQtNGMzZi05N2FiLWRmMjIxMTM1YWFiMiIsInUiOiJuaXJhdiIsInIiOiJteXJvb20iLCJzIjpbInJvb20ubGlzdF9hdmFpbGFibGVfbGF5b3V0cyIsInJvb20uc2VsZi5hdWRpb19tdXRlIiwicm9vbS5zZWxmLmF1ZGlvX3VubXV0ZSIsInJvb20uc2VsZi52aWRlb19tdXRlIiwicm9vbS5zZWxmLnZpZGVvX3VubXV0ZSIsInJvb20uc2VsZi5kZWFmIiwicm9vbS5zZWxmLnVuZGVhZiIsInJvb20uc2VsZi5zZXRfaW5wdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9vdXRwdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9pbnB1dF9zZW5zaXRpdml0eSIsInJvb20uaGlkZV92aWRlb19tdXRlZCIsInJvb20uc2hvd192aWRlb19tdXRlZCIsInJvb20uc2V0X2xheW91dCIsInJvb20ubWVtYmVyLmF1ZGlvX211dGUiLCJyb29tLm1lbWJlci5hdWRpb191bm11dGUiLCJyb29tLm1lbWJlci5kZWFmIiwicm9vbS5tZW1iZXIudW5kZWFmIiwicm9vbS5tZW1iZXIucmVtb3ZlIiwicm9vbS5tZW1iZXIuc2V0X2lucHV0X3NlbnNpdGl2aXR5Iiwicm9vbS5tZW1iZXIuc2V0X2lucHV0X3ZvbHVtZSIsInJvb20ubWVtYmVyLnNldF9vdXRwdXRfdm9sdW1lIiwicm9vbS5tZW1iZXIudmlkZW9fbXV0ZSIsInJvb20ubWVtYmVyLnZpZGVvX3VubXV0ZSJdLCJhY3IiOnRydWUsImVycCI6dHJ1ZSwibXRhIjp7fSwicm10YSI6e319.U_xvq-Q3W722Ane5D_TADdlTPpr7PWXnjZnsv6sQg2Fcr7Ct8x6YwTUv2GXqagwMYJuDHTYr7qSoZD9l-eqyiA"
        rootElement={rootElement}
        onRoomReady={(roomSession) => {
          setRoomSession(roomSession);
          console.log(roomSession);
        }}
        onRoomJoined={(e) => console.log('DINGUS', e)}
      >
        <div ref={rootElement} style={{ width: 800, height: 600 }}></div>
      </Video>
    </div>
  );
}

export default App;
