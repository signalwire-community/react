// TODO: Enter your SignalWireRoom Token here. Get one from the SignalWire REST APIs.
const TOKEN = ''

import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { Video, LocalStream } from '@signalwire-community/react-native';

const App = () => {

  const [roomSession, setRoomSession] = useState()
  console.log("Started")

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <Text>Remote video:</Text>
      {
        TOKEN
          ? <View style={{ borderWidth: 5, borderColor: 'red' }}>
            <Video
              token={TOKEN}
              onRoomReady={(roomSession) => {
                console.log("Raw room session object:", roomSession)
                setRoomSession(roomSession)
              }}
              onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
              onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
            />
          </View>
          : <Text>Please set a token at the top of App.js</Text>
      }
      <LocalStream roomSession={roomSession} style={{ position: 'absolute', right: 0, bottom: 0, width: '33%', aspectRatio: 9/16 }} />
    </SafeAreaView>
  );
};
export default App;
