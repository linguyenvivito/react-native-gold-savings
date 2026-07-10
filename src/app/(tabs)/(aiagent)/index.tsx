import { ThemedView } from "@/components/themed-view";
import { useLocale } from "@/context/locale-context";
import { transcribeAudioFromUri } from "@/features/ai/speech-to-text.router";
import {
  getLatestSpeechIntentToken,
  subscribeSpeechIntent,
} from "@/features/ai/speech-intent";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GoldDataItem = {
  id: string;
  type: boolean;
  store: string;
  goldType: string;
  price: number;
  asyncPrice: number;
  value: number;
  unit: string;
  currency: "VND";
  releaseDate: string;
  location: string;
  invoice: string;
  description: string;
};

type GoldFormState = {
  type: boolean;
  store: string;
  goldType: string;
  price: number;
  asyncPrice: number;
  value: number;
  unit: string;
  releaseDate: string;
  location: string;
  invoice: string;
  description: string;
};

const initialGoldData: GoldDataItem[] = [
  {
    id: "1",
    type: false,
    store: "kim_mon",
    goldType: "RING_9999",
    price: 13000,
    asyncPrice: 13000,
    value: 1,
    unit: "mace",
    currency: "VND",
    releaseDate: "2023-01-01",
    location: "Location 1",
    invoice: "INV-001",
    description: "Sample record",
  },
];

const initialFormState: GoldFormState = {
  type: false,
  store: "kim_mon",
  goldType: "RING_9999",
  price: 0,
  asyncPrice: 0,
  value: 0,
  unit: "mace",
  releaseDate: "",
  location: "",
  invoice: "",
  description: "",
};

const UNIT_OPTIONS = [
  { label: i18n.t("assets.fen"), value: "fen" },
  { label: i18n.t("assets.mace"), value: "mace" },
  { label: i18n.t("assets.tael"), value: "tael" },
];

const STORE_OPTIONS = [
  { label: "Kim Mon", value: "kim_mon" },
  { label: "Another Store", value: "another_store" },
];

const GOLD_TYPE_OPTIONS = [
  { label: "RING_9999", value: "RING_9999" },
  { label: "BAR_9999", value: "BAR_9999" },
];

type SelectOption = {
  label: string;
  value: string;
};

export default function AIAgentScreen() {
  const isFocused = useIsFocused();
  const { locale } = useLocale();
  const [goldData, setGoldData] = useState<GoldDataItem[]>(initialGoldData);
  const [form, setForm] = useState<GoldFormState>(initialFormState);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparingRecording, setIsPreparingRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [lastAudioUri, setLastAudioUri] = useState("");
  const lastSpeechIntentRef = useRef(0);
  const recordingStartedAtRef = useRef<number | null>(null);

  const totalMoney = useMemo(() => {
    return sumBy(goldData, (item) => item.price * item.value);
  }, [goldData]);

  const updateForm = (key: keyof GoldFormState, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseNumberField = (value: string): number => {
    const sanitized = value.replace(/,/g, "").trim();
    if (!sanitized) {
      return 0;
    }

    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getOptionLabel = (options: SelectOption[], selectedValue: string): string => {
    return options.find((option) => option.value === selectedValue)?.label ?? selectedValue;
  };

  const openIosSelector = (
    key: "store" | "goldType" | "unit",
    options: SelectOption[],
    title: string,
  ) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [...options.map((option) => option.label), "Cancel"],
        cancelButtonIndex: options.length,
      },
      (buttonIndex) => {
        if (buttonIndex >= 0 && buttonIndex < options.length) {
          updateForm(key, options[buttonIndex].value);
        }
      },
    );
  };

  const startRecording = useCallback(async () => {
    if (isRecording || isPreparingRecording || isTranscribing) {
      return;
    }

    setIsPreparingRecording(true);
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone permission required", "Please enable microphone access.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();
      recordingStartedAtRef.current = Date.now();
      setSpeechError("");
      setLastAudioUri("");
      setIsRecording(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to activate audio session for recording.";
      setSpeechError(message);
      Alert.alert(
        "Recording unavailable",
        "Could not start microphone session. Close other apps using audio and try again.",
      );
    } finally {
      setIsPreparingRecording(false);
    }
  }, [isPreparingRecording, isRecording, isTranscribing, recorder]);

  const stopRecordingAndTranscribe = useCallback(async () => {
    if (!isRecording) {
      return;
    }

    setIsRecording(false);
    setIsTranscribing(true);

    try {

      await recorder.stop();
      const status = recorder.getStatus();
      const audioUri = status?.url ?? recorder.uri ?? recorderState.url;
      setLastAudioUri(audioUri ?? "");

      const elapsedMs =
        recordingStartedAtRef.current != null
          ? Math.max(0, Date.now() - recordingStartedAtRef.current)
          : 0;
      const durationMs = status?.durationMillis ?? recorderState.durationMillis ?? elapsedMs;

      if (durationMs < 500 && !audioUri) {
        throw new Error("Recording is too short. Please speak for at least 1 second.");
      }

      if (!audioUri) {
        throw new Error("Recording file was not found.");
      }

      const text = await transcribeAudioFromUri(audioUri, locale);
      setTranscript(text || "No speech detected.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Speech to text failed.";
      setSpeechError(message);
      Alert.alert("Speech to text error", message);
    } finally {
      recordingStartedAtRef.current = null;
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      }).catch(() => undefined);
      setIsTranscribing(false);
    }
  }, [isRecording, locale, recorder, recorderState.durationMillis, recorderState.url]);

  const handleSpeechIntent = useCallback(
    async (token?: number) => {
      const intentToken = token ?? getLatestSpeechIntentToken();
      if (intentToken <= lastSpeechIntentRef.current) {
        return;
      }

      lastSpeechIntentRef.current = intentToken;

      if (isRecording) {
        await stopRecordingAndTranscribe();
        return;
      }

      await startRecording();
    },
    [isRecording, startRecording, stopRecordingAndTranscribe],
  );

  const handleSpeechIntentSafely = useCallback(
    async (token?: number) => {
      try {
        await handleSpeechIntent(token);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Speech action failed.";
        setSpeechError(message);
      }
    },
    [handleSpeechIntent],
  );

  const handleRecordButtonPress = useCallback(async () => {
    if (isRecording) {
      await stopRecordingAndTranscribe();
      return;
    }

    await startRecording();
  }, [isRecording, startRecording, stopRecordingAndTranscribe]);

  useEffect(() => {
    const unsubscribe = subscribeSpeechIntent((token) => {
      if (!isFocused) {
        return;
      }

      handleSpeechIntentSafely(token).catch(() => undefined);
    });

    return unsubscribe;
  }, [handleSpeechIntentSafely, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    handleSpeechIntentSafely().catch(() => undefined);
  }, [handleSpeechIntentSafely, isFocused]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        recorder.stop().catch(() => undefined);
      }
      setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
      }).catch(() => undefined);
    };
  }, [isRecording, recorder]);

  const handleSubmit = () => {
    const price = Number(form.price);
    const asyncPrice = Number(form.asyncPrice);
    const value = Number(form.value);

    if (!price || price <= 0) {
      Alert.alert("Invalid input", "Price must be greater than 0.");
      return;
    }

    if (!value || value <= 0) {
      Alert.alert("Invalid input", "Value must be greater than 0.");
      return;
    }

    if (!asyncPrice || asyncPrice <= 0) {
      Alert.alert("Invalid input", "Async price must be greater than 0.");
      return;
    }

    if (!form.releaseDate.trim()) {
      Alert.alert("Invalid input", "Release date is required (YYYY-MM-DD).");
      return;
    }

    const newItem: GoldDataItem = {
      id: Date.now().toString(),
      type: form.type,
      store: form.store,
      goldType: form.goldType,
      price,
      asyncPrice,
      value,
      unit: form.unit.trim() || "mace",
      currency: "VND",
      releaseDate: form.releaseDate.trim(),
      location: form.location.trim() || "Unknown",
      invoice: form.invoice.trim(),
      description: form.description.trim(),
    };

    setGoldData((prev) => [newItem, ...prev]);
    setForm(initialFormState);
    Alert.alert("Success", "Gold data submitted.");
  };

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-2 text-2xl font-bold text-main-primary">
            {i18n.t("assets.title")}
          </Text>
          <Text className="mb-4 text-base font-semibold text-slate-700">
            Total Money: {formatVND(totalMoney)}
          </Text>

          <View className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
            <Text className="mb-2 text-base font-bold text-slate-800">OpenAI Speech to Text</Text>
            <Pressable
              className={`items-center rounded-lg py-2.5 ${
                isTranscribing || isPreparingRecording
                  ? "bg-slate-400"
                  : isRecording
                    ? "bg-rose-600"
                    : "bg-main-primary"
              }`}
              onPress={() => {
                handleRecordButtonPress().catch((error) => {
                  const message = error instanceof Error ? error.message : "Speech action failed.";
                  setSpeechError(message);
                });
              }}
              disabled={isTranscribing || isPreparingRecording}
            >
              <Text className="text-sm font-bold text-white">
                {isPreparingRecording
                  ? "Preparing microphone..."
                  : isTranscribing
                  ? "Transcribing..."
                  : isRecording
                    ? "Stop & Transcribe"
                    : "Start Recording"}
              </Text>
            </Pressable>

            {!!speechError && (
              <Text className="mt-2 text-xs text-rose-600">Error: {speechError}</Text>
            )}

            <View className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
              <Text className="mb-1 text-xs font-semibold text-slate-600">Transcript</Text>
              <Text className="text-sm text-slate-800">
                {transcript || "Press AI tab or Start Recording to transcribe speech."}
              </Text>
              <Text className="mt-2 text-[11px] text-slate-500">
                recorder: canRecord={String(recorderState.canRecord)} | isRecording={String(recorderState.isRecording)}
              </Text>
              <Text className="text-[11px] text-slate-500" numberOfLines={2}>
                url: {lastAudioUri || recorderState.url || "(none)"}
              </Text>
            </View>
          </View>

          <Text className="mb-2.5 mt-4 text-base font-bold text-slate-800">
            {i18n.t("assets.savedGoldData")}
          </Text>
          <View>
            {goldData.map((item, index) => (
              <View key={item.id}>
                <View className="rounded-lg border border-slate-200 bg-white p-2.5">
                  <Text className="mb-1 text-sm font-bold text-slate-800">
                    {formatVND(item.price)}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.value")}: {item.value}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.type")}: {item.goldType}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.store")}: {item.store}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.unit")}: {item.unit}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.asyncPrice")}: {formatVND(item.asyncPrice)}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.invoice")}: {item.invoice || "-"}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.releaseDate")}: {item.releaseDate}
                  </Text>
                  <Text className="text-xs text-slate-700">
                    {i18n.t("assets.location")}: {item.location}
                  </Text>
                </View>
                {index < goldData.length - 1 && <View className="h-2" />}
              </View>
            ))}
          </View>


        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
