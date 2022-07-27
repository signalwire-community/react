// TODO: Enter your SignalWireRoom Token here. Get one from the SignalWire REST APIs.
const TOKEN = ''

import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { Video } from '@signalwire-community/react-native';

const App = () => {

  console.log("Started")

  return (
    <SafeAreaView>
      <Text>===========</Text>
      {
        TOKEN
          ? <View style={{ borderWidth: 5, borderColor: 'red' }}>
            <Video
              token={TOKEN}
              onRoomReady={(roomSession) =>
                console.log("Raw room session object:", roomSession)
              }
              onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
              onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
            />
          </View>
          : <Text>Please set a token at the top of App.js</Text>
      }
      <Text>===========</Text>
    </SafeAreaView>
  );
};
export default App;
