const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
  "https://python-gold-savings.onrender.com";

type TranscribeResponse = {
  text?: string;
  detail?: string;
};

export class SpeechToTextApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SpeechToTextApiError";
    this.status = status;
  }
}

function inferMimeType(filename: string): string {
  if (filename.endsWith(".m4a") || filename.endsWith(".mp4")) {
    return "audio/mp4";
  }
  if (filename.endsWith(".wav")) {
    return "audio/wav";
  }
  if (filename.endsWith(".mp3")) {
    return "audio/mpeg";
  }
  if (filename.endsWith(".webm")) {
    return "audio/webm";
  }
  if (filename.endsWith(".caf")) {
    return "audio/x-caf";
  }
  if (filename.endsWith(".aac")) {
    return "audio/aac";
  }

  return "audio/mp4";
}

function ensureAudioFilename(fileName: string, fallbackExt: string): string {
  const trimmed = fileName.trim().toLowerCase();
  if (!trimmed) {
    return `recording.${fallbackExt}`;
  }

  if (/\.(m4a|mp4|wav|mp3|webm|aac|caf)$/i.test(trimmed)) {
    return trimmed;
  }

  return `${trimmed}.${fallbackExt}`;
}

export async function transcribeAudioFromUri(
  audioUri: string,
  language: "en" | "vi",
): Promise<string> {
  const isBlobUrl = audioUri.startsWith("blob:");
  const rawFileName = audioUri.split("/").pop()?.split("?")[0] ?? "";
  const fileName = ensureAudioFilename(rawFileName, isBlobUrl ? "webm" : "m4a");
  const mimeType = inferMimeType(fileName);

  const formData = new FormData();

  if (isBlobUrl) {
    const blobResponse = await fetch(audioUri);
    const blob = await blobResponse.blob();
    const file = new File([blob], fileName, { type: blob.type || mimeType });
    formData.append("file", file);
  } else {
    formData.append("file", {
      uri: audioUri,
      name: fileName,
      type: mimeType,
    } as any);
  }

  if (language.trim()) {
    formData.append("language", language.trim());
  }

  const response = await fetch(`${API_BASE_URL}/ai/transcribe`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as TranscribeResponse;

  if (!response.ok) {
    throw new SpeechToTextApiError(
      payload?.detail || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return payload.text?.trim() || "";
}
