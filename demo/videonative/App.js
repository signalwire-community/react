import 'react-native-get-random-values';
import {SafeAreaView, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {VideoNative} from '@signalwire-community/react-native';
import {RTCView} from 'react-native-webrtc';

const App = () => {
  return (
    <SafeAreaView>
      <VideoNative
        token={
          'eyJ0eXAiOiJWUlQiLCJjaCI6InJlbGF5LnNpZ25hbHdpcmUuY29tIiwiYWxnIjoiSFM1MTIifQ.eyJpYXQiOjE2NTc3MjQzMjksImp0aSI6IjFjYWE2Y2Q0LWNiMTEtNDI5OS04MzI1LWI5YThmMTVjMDMwZiIsInN1YiI6ImMzYWQ3NzE2LTAxYjQtNGMzZi05N2FiLWRmMjIxMTM1YWFiMiIsInUiOiJuaXIiLCJqYSI6Im1lbWJlciIsInIiOiJzYXVyYXYiLCJzIjpbInJvb20ubGlzdF9hdmFpbGFibGVfbGF5b3V0cyIsInJvb20uc2VsZi5hdWRpb19tdXRlIiwicm9vbS5zZWxmLmF1ZGlvX3VubXV0ZSIsInJvb20uc2VsZi52aWRlb19tdXRlIiwicm9vbS5zZWxmLnZpZGVvX3VubXV0ZSIsInJvb20uc2VsZi5kZWFmIiwicm9vbS5zZWxmLnVuZGVhZiIsInJvb20uc2VsZi5zZXRfaW5wdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9vdXRwdXRfdm9sdW1lIiwicm9vbS5zZWxmLnNldF9pbnB1dF9zZW5zaXRpdml0eSIsInJvb20uaGlkZV92aWRlb19tdXRlZCIsInJvb20uc2hvd192aWRlb19tdXRlZCJdLCJhY3IiOnRydWUsIm1hIjoiYWxsIiwiZXJwIjp0cnVlLCJtdGEiOnt9LCJybXRhIjp7fX0.JRaFA05vI4cn5nLqdUBvocFRMdysGWEXcb-FD-pQsGcfcMudmYGXle8S5GotFUGd8vKhOEmYKNz5GH0nBVBKqQ'
        }
      />
    </SafeAreaView>
  );
};

export default App;
