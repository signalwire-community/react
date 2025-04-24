import 'react-native-get-random-values';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import type * as SignalWire from '@signalwire/js';
import type { MediaStream } from 'react-native-webrtc';
import { RTCView } from 'react-native-webrtc';
import { Card, Text } from 'react-native-paper';
import { useMembers } from '@signalwire-community/react-native';
import MicOff from '../../../assets/mic-off.svg';
import RaisedHand from '../../../assets/raised-hand.svg';
import LoadingSvg from '../../../assets/auto_mode.svg';
import { Dimensions, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export type IBaseStreamProps = {
  style?: any;
  roomSession?: SignalWire.Video.RoomSession | SignalWire.CallFabricRoomSession;
  streamSource: 'local' | 'remote';
  memberStates?: Record<string, { isMuted: boolean; isTalking: boolean; hasHandRaised: boolean }>;
  userPositions?: Record<string, { x: number; y: number; width: number; height: number }>;
  address?: any;
};

export default function BaseStream({
  style,
  roomSession,
  streamSource,
  memberStates,
  userPositions,
  address
}: IBaseStreamProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const { members } = useMembers(roomSession);
  const [layout, setLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [talkingMembers, setTalkingMembers] = useState<Record<string, boolean>>({});
  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
  const [showStream, setShowStream] = useState(true);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {

    const checkStream = async (url: any) => {
      const value = await AsyncStorage.getItem("init_stream");
      if (url && !value) {
        const timeout = setTimeout(async () => {
          setShowStream(true);
          await AsyncStorage.setItem("init_stream", "true");
        }, 1500);
  
        return () => clearTimeout(timeout);
      } else {
        setShowStream(true);
      }
    }
    if (roomSession?.active) {
      const url =
        streamSource === 'local'
          ? (roomSession.localStream as MediaStream | null | undefined)?.toURL() ?? null
          : (roomSession.remoteStream as MediaStream | null | undefined)?.toURL() ?? null;
  
      setStreamUrl(url);
     
      checkStream(url)
    }
    return () => {
      setStreamUrl(null);
      setShowStream(false);
    };
  }, [roomSession, streamSource]);
  

  useEffect(() => {
    if (roomSession?.active) {
      const onTalking = (event: any) => {
        setTalkingMembers((prev) => ({
          ...prev,
          [event.member?.member_id]: event.member?.talking || false,
        }));
      };
      roomSession.on('member.talking', onTalking);
      return () => {
        roomSession.off('member.talking', onTalking);
      };
    }
  }, [roomSession]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const activeMemberStates = memberStates || {};
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => a.joined_at - b.joined_at);
  }, [members]);
  
  const RenderMemberOverlay = React.memo(({ member, position, state, isLandscape, layout, talking } : any) => {
    const iconSize = isLandscape && width > 992 ? 36 : 24;
  
    const left = (position.x / 100) * layout.width;
    const top = (position.y / 100) * layout.height;
    const itemWidth = (position.width / 100) * layout.width;
    const itemHeight = (position.height / 100) * layout.height;
  
    return (
      <Card
        key={member.member_id}
        style={{
          position: 'absolute',
          top,
          left,
          width: itemWidth,
          height: itemHeight,
          backgroundColor: 'transparent',
        }}
      >
        {state?.isMuted && (
          <Card style={{ position: 'absolute', top: 5, left: 5, backgroundColor: 'transparent' }}>
            <MicOff height={iconSize} width={iconSize} />
          </Card>
        )}
        {state?.hasHandRaised && (
          <Card style={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'transparent' }}>
            <RaisedHand height={iconSize} width={iconSize} />
          </Card>
        )}
        {talking && (
          <Card
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderWidth: 3,
              borderColor: 'red',
              borderRadius: 10,
              backgroundColor: 'transparent',
            }}
          />
        )}
        <Text
          style={{
            position: 'absolute',
            bottom: 0,
            left: 5,
            fontSize: 10,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 5,
            borderRadius: 5,
          }}
        >
          {member?.subscriber_data?.fabric_subscriber_name || member?.name || 'Unknown User'}
        </Text>
      </Card>
    );
  }, (prevProps, nextProps) => {
    return (
      prevProps.member.member_id === nextProps.member.member_id &&
      prevProps.state?.isMuted === nextProps.state?.isMuted &&
      prevProps.state?.hasHandRaised === nextProps.state?.hasHandRaised &&
      prevProps.talking === nextProps.talking &&
      JSON.stringify(prevProps.position) === JSON.stringify(nextProps.position)
    );
  });
  
  return (
    <Card
      style={[{
        position: 'relative',
        height: address?.includes("channel=audio") ? showStream && streamUrl ? 0 : '100%' : isLandscape ? '100%' : 'auto',
        width: address?.includes("channel=audio") ? showStream && streamUrl ? 0 : '100%' : isLandscape ? 'auto' : '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',
        backgroundColor: address?.includes("channel=audio") ? '#0D1C2B' : 'black',
        paddingHorizontal: isLandscape ? 20 : 'auto',
      }, address?.includes("channel=audio") && {
        flexDirection:  'row',
        justifyContent: 'center',
        alignItems: 'center',
      }]}
    >
      {showStream && streamUrl ? (
        <RTCView
          streamURL={streamUrl}
          style={{ width: '100%', height: '100%' }}
          onLayout={(e) => {
            setLayout({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}
        />
      ) : (
        <Card
          style={{
            width: '85%',
            alignSelf: 'center',
            flexDirection: 'column',
            paddingVertical: 24,
            borderRadius: 10,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        <Animated.View
          style={{
            width: 72,
            height: 72,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotate: rotation }],
          }}
        >
          <LoadingSvg height={72} width={72} />
        </Animated.View>
          <Text
            style={{
              fontSize: 28,
              lineHeight: 36,
              color: '#55606A',
              marginTop: 12,
              marginBottom: 2,
              textAlign: 'center',
            }}
          >
            Connecting
          </Text>
          <Text style={{ 
              fontSize: 14,
              color: "#999",
              textAlign: "center",
              paddingHorizontal: 10
            }}>
            Joining {roomSession?.options?.destinationNumber || 'room'}
          </Text>
        </Card>
      )}
    {sortedMembers.map((member) => {
      const state = activeMemberStates[member.member_id];
      const position = userPositions?.[member.member_id];
      const talking = talkingMembers[member.member_id];
      if (!position) return null;

      return (
        <RenderMemberOverlay
          key={member.member_id}
          member={member}
          position={position}
          state={state}
          isLandscape={isLandscape}
          layout={layout}
          talking={talking}
        />
      );
    })}
    </Card>
  );
}
