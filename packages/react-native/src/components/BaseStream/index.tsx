import 'react-native-get-random-values';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import type * as SignalWire from '@signalwire/client';
import type { MediaStream } from 'react-native-webrtc';
import { RTCView } from 'react-native-webrtc';
import { Card, Text } from 'react-native-paper';
import { useMembers } from '@signalwire-community/react-native';
import MicOff from '../../../assets/mic-off.svg';
import RaisedHand from '../../../assets/raised-hand.svg';
import LoadingSvg from '../../../assets/auto_mode.svg';
import { Dimensions, Animated, Easing, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTablet } from 'react-native-device-info';

const { height, width } = Dimensions.get('window');

export type IBaseStreamProps = {
  style?: any;
  roomSession?: SignalWire.CallSession | any;
  streamSource: 'local' | 'remote';
  memberStates?: Record<string, { isMuted: boolean; isTalking: boolean; hasHandRaised: boolean }>;
  userPositions?: Record<string, { x: number; y: number; width: number; height: number }>;
  address?: any;
  updatedCamera?: boolean;
};

export default function BaseStream({
  style,
  roomSession,
  streamSource,
  memberStates,
  userPositions,
  address,
  updatedCamera = false
}: IBaseStreamProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderChecked, setLoaderChecked] = useState(false);
  const { members } = useMembers(roomSession);
  const [layout, setLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [talkingMembers, setTalkingMembers] = useState<Record<string, boolean>>({});
  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
  const [localMemberStates, setLocalMemberStates] = useState({});

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [overlayTick, setOverlayTick] = useState(0);

  useEffect(() => {
    // On mount – force one render tick
    setOverlayTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOverlayTick((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 1. Listen for member updates (mute/handraise/talking) and store by BOTH member_id and id!
  useEffect(() => {
    if (!roomSession) return;

    function handleMemberUpdated(e) {
      const m = e.member || e;
    
      setLocalMemberStates(prev => ({
        ...prev,
        [m.member_id]: {
          isMuted: m.audio_muted,
          isTalking: m.talking,
          hasHandRaised: m.handraised,
          name: m.name,
          subscriber_data: m.subscriber_data,
        },
        [m.id]: {
          isMuted: m.audio_muted,
          isTalking: m.talking,
          hasHandRaised: m.handraised,
          name: m.name,
          subscriber_data: m.subscriber_data,
        }
      }));
    }
    

    roomSession.on('member.updated', handleMemberUpdated);

    // Initial state for all members on join
    if (roomSession.members) {
      roomSession.members.forEach(m => handleMemberUpdated({ member: m }));
    }

    return () => {
      roomSession.off('member.updated', handleMemberUpdated);
    };
  }, [roomSession]);

  // 2. Orientation
  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
    return () => subscription?.remove();
  }, []);

  // 3. Loader
  useEffect(() => {
    let isMounted = true;
    async function checkLoader() {
      if (!roomSession || !roomSession.id) {
        setShowLoader(false);
        setLoaderChecked(true);
        return;
      }
      const loaderKey = `shown_loader_${roomSession.id}`;
      const loaderVal = await AsyncStorage.getItem(loaderKey);

      if (!loaderVal) {
        setShowLoader(true);
        setTimeout(async () => {
          if (isMounted) {
            setShowLoader(false);
            await AsyncStorage.setItem(loaderKey, '1');
          }
        }, 1500);
      } else {
        setShowLoader(false);
      }
      setLoaderChecked(true);
    }
    setLoaderChecked(false);
    checkLoader();
    return () => { isMounted = false; };
  }, [roomSession?.id]);

  // 4. Stream URL
  useEffect(() => {
    if (roomSession?.active) {
      const url =
        streamSource === 'local'
          ? (roomSession.localStream as MediaStream | null | undefined)?.toURL() ?? null
          : (roomSession.remoteStream as MediaStream | null | undefined)?.toURL() ?? null;
      setStreamUrl(url);
    }
    return () => setStreamUrl(null);
  }, [roomSession, streamSource, address, members]);

  // 5. Talking border
  useEffect(() => {
    if (roomSession?.active) {
      const onTalking = (event: any) => {
        setTalkingMembers((prev) => ({
          ...prev,
          [event.member?.member_id]: event.member?.talking || false,
          [event.member?.id]: event.member?.talking || false,
        }));
      };
      roomSession.on('member.talking', onTalking);
      return () => {
        roomSession.off('member.talking', onTalking);
      };
    }
  }, [roomSession]);

  // 6. Loader animation
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

  function getValidMembers() {
    // Ako members array ima barem jednog sa validnim id/member_id – koristi ga!
    if (members && members.length && (members[0].member_id || members[0].id)) {
      return members;
    }
    // Fallback: koristi lokalnog membera (ako postoji), iz localMemberStates
    if (roomSession?.member_id && localMemberStates[roomSession.member_id]) {
      return [{
        member_id: roomSession.member_id,
        id: roomSession.member_id,
        name: roomSession.member_name || 'You',
        subscriber_data: {},
        joined_at: 0 // za sort
      }];
    }
    // Fallback 2: use all from localMemberStates -
    const stateKeys = Object.keys(localMemberStates);
    if (stateKeys.length > 0) {
      return stateKeys.map(k => ({
        member_id: k,
        id: k,
        name:
        members.find(m => m.memberId === k || m.member_id === k || m.id === k)?.subscriber_data?.fabric_subscriber_name
        || members.find(m => m.member_id === k || m.id === k || m.memberId === k)?.name
        || localMemberStates[k]?.subscriber_data?.fabric_subscriber_name
        || localMemberStates[k]?.name
        || 'User',
        subscriber_data: members.find(m => m.memberId === k || m.member_id === k || m.id === k)?.subscriber_data || {},
        joined_at: members.find(m => m.memberId === k || m.member_id === k || m.id === k)?.joined_at || 0,
      }));
    }
    return [];
  }

  const validMembers = useMemo(getValidMembers, [members, localMemberStates, roomSession]);
  const sortedMembers = useMemo(() => {
    return [...validMembers].sort((a, b) => a.joined_at - b.joined_at);
  }, [validMembers]);

  function getOverlayState(member) {
    const keys = [member.member_id, member.id];
    for (let key of keys) {
      if (key && localMemberStates[key]) return localMemberStates[key];
      if (key && memberStates && memberStates[key]) return memberStates[key];
    }
    return {};
  }


  // 9. Render overlay
  const RenderMemberOverlay = React.memo(({ member, position, state, isLandscape, layout, talking } : any) => {
    const iconSize = isLandscape && width > 992 ? 36 : sortedMembers?.length > 14 ? 12 : 24;
    const left = (position.x / 100) * layout.width;
    const top = (position.y / 100) * layout.height;
    const itemWidth = (position.width / 100) * layout.width;
    const itemHeight = (position.height / 100) * layout.height;

    return (
      <Card
        key={member.member_id || member.id}
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
          <Card style={{ position: 'absolute', top: isTablet() && isLandscape ? 15 : 5, left: isLandscape && sortedMembers?.length > 6 ?  15 : 5, backgroundColor: 'transparent' }}>
            <MicOff height={iconSize} width={iconSize} />
          </Card>
        )}
        {state?.hasHandRaised && (
          <Card style={{ position: 'absolute', top: isTablet() && isLandscape ? 15 : 5, right: 5, backgroundColor: 'transparent' }}>
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
            bottom: isTablet() ? 15 : isLandscape && sortedMembers?.length > 6 ? 5 : 0,
            left: isLandscape && sortedMembers?.length > 6 ? 15 : 5,
            fontSize: sortedMembers?.length > 14 ? 6 : 10,
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
      (prevProps.member.member_id === nextProps.member.member_id || prevProps.member.id === nextProps.member.id) &&
      prevProps.state?.isMuted === nextProps.state?.isMuted &&
      prevProps.state?.hasHandRaised === nextProps.state?.hasHandRaised &&
      prevProps.talking === nextProps.talking &&
      JSON.stringify(prevProps.position) === JSON.stringify(nextProps.position) &&
      prevProps.tick === nextProps.tick
    );
  });

  return (
    <Card
      style={[{
        position: 'relative',
        height: address?.includes("channel=audio") ? streamUrl || streamUrl == null ? 0 : '100%' : isLandscape ? Platform.OS === "ios" ? height > 700 ? "95%" : "75%" : '100%'  : 'auto',
        width: address?.includes("channel=audio") ? streamUrl || streamUrl == null ? 0 : '100%' : isLandscape ? 'auto' : '100%',
        aspectRatio: 16 / 9,
        overflow: 'hidden',
        marginTop: isTablet() && isLandscape ? 60 : 0,
        backgroundColor: address?.includes("channel=audio") ? '#0D1C2B' : 'black',
        paddingHorizontal: isLandscape ? 20 : 'auto',
      }, address?.includes("channel=audio") && {
        flexDirection:  'row',
        justifyContent: 'center',
        alignItems: 'center',
      }]}
    >
      {/* Loader */}
      {(!loaderChecked || showLoader || !streamUrl) ? (
        <Card
          style={{
            width: '85%',
            paddingTop: isTablet() ? 100 : isLandscape && !isTablet() ? 70 : 30,
            height: isLandscape && !isTablet() ? 250 : 350,
            alignSelf: 'center',
            flexDirection: 'column',
            borderRadius: 0,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: isLandscape && !isTablet() ? 50 : isTablet() && isLandscape ? 150 : 0
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
          <LoadingSvg height={72} width={72} fill="black"  />
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
      ) : (
        <RTCView  
          objectFit="cover"
          key={updatedCamera ? updatedCamera.toString() : 'stream'}
          streamURL={streamUrl}
          style={{ width: '100%', height: '100%' }}
          onLayout={(e) => {
            setLayout({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            });
          }}
        />
      )}
      {/* Overlay */}
      {sortedMembers.map((member) => {
        const state = getOverlayState(member);
        const position = userPositions?.[member.member_id] || userPositions?.[member.id];
        const talking = talkingMembers[member.member_id] || talkingMembers[member.id];
        if (!position) return null;
        return (
          <RenderMemberOverlay
            key={member.member_id || member.id}
            member={member}
            position={position}
            state={state}
            isLandscape={isLandscape}
            layout={layout}
            talking={talking}
            tick={overlayTick}
          />
        );
      })}
    </Card>
  );
}
