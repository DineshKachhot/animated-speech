import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpeakingCharacter } from '@/components/SpeakingCharacter';
import { SpeechInput } from '@/components/SpeechInput';
import { useAzureSpeech } from '@/hooks/useAzureSpeech';
import { useVisemeScheduler } from '@/hooks/useVisemeScheduler';

export default function Home() {
  const [visemeId, setVisemeId] = useState(0);

  const { state, error, speak, onPlaybackEnd } = useAzureSpeech();
  const player = useAudioPlayer(null);

  useEffect(() => {
    setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    }).catch((err) => console.error('Failed to set audio mode', err));
  }, []);

  // Stable ref so scheduler callback can read latest player.currentTime
  const playerRef = useRef(player);
  playerRef.current = player;

  const { start: startScheduler, stop: stopScheduler } = useVisemeScheduler(setVisemeId);

  const handleSpeak = useCallback(
    async (text: string) => {
      stopScheduler();
      setVisemeId(0);

      const result = await speak(text);
      if (!result) return;

      // Load new audio into existing player (avoids re-creating)
      player.replace({ uri: result.fileUri });

      // Small delay so player has time to load before we call play
      setTimeout(() => {
        playerRef.current.play();
        startScheduler(result.visemes, () => playerRef.current.currentTime * 1000);
      }, 150);
    },
    [speak, player, startScheduler, stopScheduler],
  );

  // Stop scheduler when playback ends
  useEffect(() => {
    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) {
        stopScheduler();
        setVisemeId(0);
        onPlaybackEnd();
      }
    });
    return () => sub.remove();
  }, [player, stopScheduler, onPlaybackEnd]);

  const speaking = state === 'playing';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.stage}>
          <SpeakingCharacter visemeId={visemeId} speaking={speaking} />
        </View>

        <View style={styles.inputArea}>
          <SpeechInput state={state} error={error} onSpeak={handleSpeak} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EBF8FF',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputArea: {
    width: '100%',
  },
});
