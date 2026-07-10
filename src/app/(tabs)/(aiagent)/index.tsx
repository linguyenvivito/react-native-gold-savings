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
  Alert,
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
  price: number;
  value: number;
  unit: string;
  currency: "VND";
  releaseDate: string;
  location: string;
  description: string;
};

type GoldFormState = {
  type: boolean;
  price: number;
  value: number;
  unit: string;
  releaseDate: string;
  location: string;
  description: string;
};

const initialGoldData: GoldDataItem[] = [
  {
    id: "1",
    price: 13000,
    value: 1,
    unit: "mace",
    currency: "VND",
    releaseDate: "2023-01-01",
    location: "Location 1",
    description: "Sample record",
  },
];

const initialFormState: GoldFormState = {
  type: false,
  price: 0,
  value: 0,
  unit: "mace",
  releaseDate: "",
  location: "",
  description: "",
};

const UNIT_OPTIONS = [
  { label: i18n.t("assets.fen"), value: "fen" },
  { label: i18n.t("assets.mace"), value: "mace" },
  { label: i18n.t("assets.tael"), value: "tael" },
];

export default function AIAgentScreen() {
  const isFocused = useIsFocused();
  const { locale } = useLocale();
  const [goldData, setGoldData] = useState<GoldDataItem[]>(initialGoldData);
  const [form, setForm] = useState<GoldFormState>(initialFormState);
  const [isEnabled, setIsEnabled] = useState(form.type);
  const [selectedStore, setSelectedStore] = useState("Kim Mon");
  const [selectedGoldType, setSelectedGoldType] = useState("RING_9999");
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
    const value = Number(form.value);

    if (!price || price <= 0) {
      Alert.alert("Invalid input", "Price must be greater than 0.");
      return;
    }

    if (!value || value <= 0) {
      Alert.alert("Invalid input", "Value must be greater than 0.");
      return;
    }

    if (!form.releaseDate.trim()) {
      Alert.alert("Invalid input", "Release date is required (YYYY-MM-DD).");
      return;
    }

    const newItem: GoldDataItem = {
      id: Date.now().toString(),
      price,
      value,
      unit: form.unit.trim() || "mace",
      currency: "VND",
      releaseDate: form.releaseDate.trim(),
      location: form.location.trim() || "Unknown",
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

          <View className="rounded-xl border border-slate-200 bg-white p-3">
            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {isEnabled ? i18n.t("assets.buy") : i18n.t("assets.sell")}
            </Text>
            <Switch
              trackColor={{ false: "#00ff00", true: "#ff0000" }} // Tailored via inline props
              thumbColor={isEnabled ? "#fff" : "#fff"}
              ios_backgroundColor="#00ff00"
              value={isEnabled}
              onValueChange={(value) => {
                setIsEnabled(value);
                updateForm("type", value);
              }}
              className="scale-90" // NativeWind styles can handle layout, margins, or scaling
            />

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.store")}
            </Text>
            <Picker
              selectedValue={selectedStore}
              onValueChange={(itemValue) => setSelectedStore(itemValue)}
            >
              <Picker.Item label="Kim Mon" value="kim_mon" />
              <Picker.Item label="Another Store" value="another_store" />
            </Picker>

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.type")}
            </Text>
            <Picker
              selectedValue={selectedGoldType}
              onValueChange={(itemValue) => setSelectedGoldType(itemValue)}
            >
              <Picker.Item label="RING_9999" value="RING_9999" />
              <Picker.Item label="BAR_9999" value="BAR_9999" />
            </Picker>

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.price")}
            </Text>
            <TextInput
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
              keyboardType="numeric"
              value={form.price.toString()}
              onChangeText={(text) => updateForm("price", parseFloat(text))}
              placeholder="13000"
            />

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.value")}
            </Text>
            <TextInput
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
              keyboardType="numeric"
              value={form.value.toString()}
              onChangeText={(text) => updateForm("value", parseFloat(text))}
              placeholder="1"
            />

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.unit")}
            </Text>
            <View className="overflow-hidden rounded-lg border border-slate-300 bg-white">
              <Picker
                selectedValue={form.unit}
                onValueChange={(itemValue) => updateForm("unit", itemValue)}
                style={{ height: 50 }}
              >
                {UNIT_OPTIONS.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.asyncPrice")}
            </Text>
            <TextInput
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
              keyboardType="numeric"
              value={form.price.toString()}
              onChangeText={(text) => updateForm("price", parseFloat(text))}
              placeholder="13000"
            />

            <View className="mb-1.5 mt-2">
              <Text className="text-xs font-semibold text-slate-700">
              {i18n.t("assets.asyncValue")}
              </Text>
              <Text className="text-xs font-semibold text-slate-700">
                @{formatVND(form.price * form.value)}
              </Text>
            </View>

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.releaseDate")}
            </Text>
            <TextInput
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
              value={form.releaseDate}
              onChangeText={(text) => updateForm("releaseDate", text)}
              placeholder="2026-07-02"
            />

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.location")}
            </Text>
            <TextInput
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
              value={form.location}
              onChangeText={(text) => updateForm("location", text)}
              placeholder={i18n.t("assets.location")}
            />

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.invoice")}
            </Text>

            <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
              {i18n.t("assets.description")}
            </Text>
            <TextInput
              className="min-h-[72px] rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
              style={{ textAlignVertical: "top" }}
              value={form.description}
              onChangeText={(text) => updateForm("description", text)}
              placeholder={i18n.t("assets.description")}
              multiline
            />

            <Pressable
              className="mt-3.5 items-center rounded-lg bg-amber-600 py-2.5"
              onPress={handleSubmit}
            >
              <Text className="text-sm font-bold text-white">
                {i18n.t("assets.submit")}
              </Text>
            </Pressable>
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
                    {i18n.t("assets.unit")}: {item.unit}
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
