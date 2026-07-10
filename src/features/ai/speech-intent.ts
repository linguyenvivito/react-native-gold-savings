type SpeechIntentListener = (token: number) => void;

let latestSpeechIntentToken = 0;
const listeners = new Set<SpeechIntentListener>();

export function triggerSpeechIntent(): number {
  latestSpeechIntentToken = Date.now();
  listeners.forEach((listener) => listener(latestSpeechIntentToken));
  return latestSpeechIntentToken;
}

export function getLatestSpeechIntentToken(): number {
  return latestSpeechIntentToken;
}

export function subscribeSpeechIntent(listener: SpeechIntentListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
