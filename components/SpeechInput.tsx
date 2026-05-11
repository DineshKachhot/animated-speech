import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}>
      <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type something to say..."
            placeholderTextColor="#A0AEC0"
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

        <Text style={styles.hint}>
          {state === 'synthesizing'
            ? 'Generating speech...'
            : state === 'playing'
              ? 'Speaking...'
              : 'Press ▶ to animate'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
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
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A202C',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  hint: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    color: '#E53E3E',
    textAlign: 'center',
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 8,
  },
});
