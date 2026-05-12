import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import type { SpeechState } from '@/hooks/useAzureSpeech';

type Props = {
  state: SpeechState;
  error: string | null;
  onSpeak: (text: string) => void;
};

export function SpeechInput({ state, error, onSpeak }: Props) {
  const [text, setText] = useState('');
  const busy = state === 'synthesizing' || state === 'playing';

  function handleSpeak() {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onSpeak(trimmed);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type something to say..."
            placeholderTextColor="#94A3B8"
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={handleSpeak}
            editable={!busy}
          />

          <TouchableOpacity
            style={[styles.button, busy && styles.buttonDisabled]}
            onPress={handleSpeak}
            activeOpacity={0.8}
            disabled={busy || !text.trim()}>
            {state === 'synthesizing' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {state === 'playing' ? '🔊' : '▶'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.hint}>
          {state === 'synthesizing'
            ? 'Generating speech...'
            : state === 'playing'
              ? 'Speaking...'
              : 'Press ▶ to animate'}
        </Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: '#334155',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#475569',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#475569',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  hint: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    color: '#FCA5A5',
    textAlign: 'center',
    backgroundColor: '#7F1D1D',
    padding: 10,
    borderRadius: 8,
  },
});
