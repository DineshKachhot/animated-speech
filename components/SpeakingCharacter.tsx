import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Rive, { type RiveRef, Fit } from 'rive-react-native';

const ARTBOARD = 'Coach model';
const STATE_MACHINE = 'State Machine 1';

// Azure viseme IDs (0–21) → Rive mouth shape IDs (0–9)
const AZURE_TO_RIVE: Record<number, number> = {
  0: 0,
  1: 2, 2: 2, 3: 2,
  4: 1, 5: 1,
  6: 6, 7: 6,
  8: 7, 9: 7,
  10: 8, 11: 8,
  12: 5, 13: 5,
  14: 3, 15: 3,
  16: 4, 17: 4,
  18: 4, 19: 4,
  20: 9, 21: 9,
};

type Props = {
  // Azure viseme ID (0–21)
  visemeId: number;
  speaking: boolean;
  emotion?: number;
};

export function SpeakingCharacter({ visemeId, speaking, emotion = 0 }: Props) {
  const riveRef = useRef<RiveRef>(null);
  const [loadError, setLoadError] = useState(false);

  const setInput = useCallback((name: string, value: number) => {
    riveRef.current?.setInputState(STATE_MACHINE, name, value);
  }, []);

  // Map Azure viseme → Rive mouth shape
  useEffect(() => {
    const riveId = speaking ? (AZURE_TO_RIVE[visemeId] ?? 0) : 0;
    setInput('lips sync id', riveId);
  }, [visemeId, speaking, setInput]);

  // Emotion
  useEffect(() => {
    setInput('emotion', emotion);
  }, [emotion, setInput]);

  if (loadError) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>{'character.riv\nnot found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Rive
        ref={riveRef}
        source={require('../assets/character.riv')}
        artboardName={ARTBOARD}
        stateMachineName={STATE_MACHINE}
        autoplay
        style={styles.rive}
        onError={() => setLoadError(true)}
        fit={Fit.Cover}
      />
    </View>
  );
}

// Emotion constants
export const EMOTIONS = {
  NEUTRAL: 0,
  HAPPY: 19,
  EXCITED: 29,
} as const;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rive: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFD166',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E6B34B',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#7B5E00',
    textAlign: 'center',
    fontWeight: '600',
  },
});
