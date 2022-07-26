const TOKEN = `eyJ0eXAiOiJWUlQiLCJjaCI6InJlbGF5LnNpZ25hbHdpcmUuY29tIiwiYWxnIjoiSFM1MTIifQ.eyJpYXQiOjE2NTgzODkxNzEsImp0aSI6ImE4NjE3NDkzLTVkZDEtNGQ1ZS1iNjEzLWYyODllZDQ0MDljMCIsInN1YiI6ImExNmQ4ZjllLTIxNjYtNGU4Mi05NmFmLWE0ODQwZjIxN2JjMyIsInUiOiJkYW5pZWxlIiwiamEiOiJtZW1iZXIiLCJyIjoiZW1iZWRkYWJsZSIsInMiOlsicm9vbS5saXN0X2F2YWlsYWJsZV9sYXlvdXRzIiwicm9vbS5zZWxmLmF1ZGlvX211dGUiLCJyb29tLnNlbGYuYXVkaW9fdW5tdXRlIiwicm9vbS5zZWxmLnZpZGVvX211dGUiLCJyb29tLnNlbGYudmlkZW9fdW5tdXRlIiwicm9vbS5zZWxmLmRlYWYiLCJyb29tLnNlbGYudW5kZWFmIiwicm9vbS5zZWxmLnNldF9pbnB1dF92b2x1bWUiLCJyb29tLnNlbGYuc2V0X291dHB1dF92b2x1bWUiLCJyb29tLnNlbGYuc2V0X2lucHV0X3NlbnNpdGl2aXR5Iiwicm9vbS5oaWRlX3ZpZGVvX211dGVkIiwicm9vbS5zaG93X3ZpZGVvX211dGVkIl0sImFjciI6dHJ1ZSwibWEiOiJhbGwiLCJlcnAiOnRydWUsIm10YSI6e30sInJtdGEiOnt9fQ.CDDT2GGZ0IybCiDyRaKf0NwBp-JwZtrXz1X6itKtsCnfbYSPrM2WOpOBjhTeIl7IXyuFAPk4iTCWm76q58g8vQ`;

import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { VideoNative } from '@signalwire-community/react-native';

const App = () => {

  console.log("Started")

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>===========</Text>
      <VideoNative token={TOKEN} />
      <Text>===========</Text>
    </SafeAreaView>
  );
};
export default App;
