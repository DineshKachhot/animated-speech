import { useState, useCallback } from 'react';
import Constants from 'expo-constants';
import { synthesize } from '@/lib/azureClient';
import type { Viseme } from '@/lib/visemes';

export type SpeechState = 'idle' | 'synthesizing' | 'playing' | 'error';

export type SpeechResult = {
  fileUri: string;
  visemes: Viseme[];
};

export function useAzureSpeech() {
  const [state, setState] = useState<SpeechState>('idle');
  const [error, setError] = useState<string | null>(null);

  const speak = useCallback(async (text: string): Promise<SpeechResult | null> => {
    const extra = Constants.expoConfig?.extra as
      | { azureKey?: string; azureRegion?: string }
      | undefined;
    const key = extra?.azureKey;
    const region = extra?.azureRegion;

    if (!key || !region) {
      setError('Set AZURE_SPEECH_KEY and AZURE_REGION in .env.local');
      setState('error');
      return null;
    }

    try {
      setState('synthesizing');
      setError(null);
      const result = await synthesize(text, key, region);
      setState('playing');
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState('error');
      return null;
    }
  }, []);

  const onPlaybackEnd = useCallback(() => {
    setState('idle');
  }, []);

  return { state, error, speak, onPlaybackEnd };
}
