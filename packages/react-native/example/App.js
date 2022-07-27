// Token from the "Guides" space
const TOKEN = `eyJ0eXAiOiJWUlQiLCJjaCI6InJlbGF5LnNpZ25hbHdpcmUuY29tIiwiYWxnIjoiSFM1MTIifQ.eyJpYXQiOjE2NTg5MTAxNDksImp0aSI6IjRjZWIxMmFjLTQwODgtNDM0NC1iZmVhLTY2Mzc1YTgxZGM0YyIsInN1YiI6IjUwNmNlYTMzLWViNDctNGI1Ni04MmIwLWQzYzVhZmFmMzlkNCIsInUiOiJndWVzdCIsImphIjoibWVtYmVyIiwiciI6Imd1ZXN0IiwicyI6WyJyb29tLmxpc3RfYXZhaWxhYmxlX2xheW91dHMiLCJyb29tLnNlbGYuYXVkaW9fbXV0ZSIsInJvb20uc2VsZi5hdWRpb191bm11dGUiLCJyb29tLnNlbGYudmlkZW9fbXV0ZSIsInJvb20uc2VsZi52aWRlb191bm11dGUiLCJyb29tLnNlbGYuZGVhZiIsInJvb20uc2VsZi51bmRlYWYiLCJyb29tLnNlbGYuc2V0X2lucHV0X3ZvbHVtZSIsInJvb20uc2VsZi5zZXRfb3V0cHV0X3ZvbHVtZSIsInJvb20uc2VsZi5zZXRfaW5wdXRfc2Vuc2l0aXZpdHkiLCJyb29tLmhpZGVfdmlkZW9fbXV0ZWQiLCJyb29tLnNob3dfdmlkZW9fbXV0ZWQiXSwiYWNyIjp0cnVlLCJtYSI6ImFsbCIsImVycCI6dHJ1ZSwibXRhIjp7fSwicm10YSI6e319.GABImS4Yl9DVB7cCBWlkEg-i3rAJziXvVysalg2K7ksV93O-8Sgq5JreglhahRHix5yJ7TKnnO6_ee_Rw3obrQ`

import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { Video } from '@signalwire-community/react-native';

const App = () => {

  console.log("Started")

  return (
    <SafeAreaView>
      <Text>===========</Text>
      <View style={{ borderWidth: 5, borderColor: 'red' }}>
        <Video
          token={TOKEN}
          onRoomReady={(roomSession) =>
            console.log("Raw room session object:", roomSession)
          }
          onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
          onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
        />
      </View>
      <Text>===========</Text>
    </SafeAreaView>
  );
};
export default App;
