const TOKEN = `<INSERT_TOKEN_HERE>`;

import 'react-native-get-random-values';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';

import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';

import {Video} from '@signalwire/js';

// registerGlobals();  // Apparently this is not needed?

const App = () => {
  const [roomSession, setRoomSession] = useState(null);
  const [setup, setSetup] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  useEffect(() => {
    async function dothing() {
      if (setup) return console.log('Setup done');
      setSetup(true);
      const room = new Video.RoomSession({
        token: TOKEN,
        audio: true,
        video: true,
      });
      room.on('room.joined', e => {
        setRoomSession(room);
        setLocalStream(room.localStream);
        setRemoteStream(room.remoteStream);
      });
      console.log('Waiting to join room');
      await room.join();
      console.log('room.join() completed');
    }
    dothing();
  }, [roomSession]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} />}
        {localStream && <RTCView streamURL={localStream.toURL()} style={{ flex: 1 }} />}
      </View>
    </SafeAreaView>
  );
};
export default App;
