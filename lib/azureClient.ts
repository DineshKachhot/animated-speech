import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { File, Paths } from 'expo-file-system';
import { Buffer } from 'buffer';
import type { Viseme } from './visemes';

function textHash(text: string): string {
  return text.trim().toLowerCase().replace(/\W+/g, '_').slice(0, 48);
}

export async function synthesize(
  text: string,
  key: string,
  region: string,
): Promise<{ fileUri: string; visemes: Viseme[] }> {
  const hash = textHash(text);
  const mp3File = new File(Paths.cache, `tts_${hash}.mp3`);
  const jsonFile = new File(Paths.cache, `tts_${hash}.json`);

  // Cache hit
  if (mp3File.exists && jsonFile.exists) {
    const raw = await jsonFile.text();
    return { fileUri: mp3File.uri, visemes: JSON.parse(raw) as Viseme[] };
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

  const visemes: Viseme[] = [];

  // null AudioConfig → SDK returns audioData in result instead of playing via Web Audio
  const synthesizer = new sdk.SpeechSynthesizer(
    speechConfig,
    null as unknown as sdk.AudioConfig,
  );

  synthesizer.visemeReceived = (_s, e) => {
    visemes.push({ id: e.visemeId, tMs: e.audioOffset / 10000 });
  };

  const result = await new Promise<sdk.SpeechSynthesisResult>((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (res) => {
        synthesizer.close();
        resolve(res);
      },
      (err) => {
        synthesizer.close();
        reject(new Error(String(err)));
      },
    );
  });

  if (result.reason !== sdk.ResultReason.SynthesizingAudioCompleted) {
    const detail = sdk.CancellationDetails.fromResult(result);
    throw new Error(`Synthesis failed: ${detail.errorDetails}`);
  }

  // Write audio bytes and viseme JSON to cache
  mp3File.write(new Uint8Array(result.audioData));
  jsonFile.write(JSON.stringify(visemes));

  return { fileUri: mp3File.uri, visemes };
}
