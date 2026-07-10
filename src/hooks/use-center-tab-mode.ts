import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const AI_AGENT_DAILY_USAGE_KEY = "ai_agent_daily_usage_v1";
const AI_AGENT_DAILY_LIMIT = 50;

type CenterTabMode = "ai-agent" | "add-transaction";

type StoredUsage = {
  date: string;
  count: number;
};

type CenterTabModeState = {
  centerTabMode: CenterTabMode;
  aiUsageCount: number;
  remainingAiUses: number;
  recordAiAgentUsage: () => Promise<void>;
};

const getTodayKey = (): string => new Date().toISOString().slice(0, 10);

const normalizeStoredUsage = (raw: string | null): StoredUsage => {
  const today = getTodayKey();

  if (!raw) {
    return { date: today, count: 0 };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredUsage>;
    if (parsed.date !== today) {
      return { date: today, count: 0 };
    }

    return {
      date: today,
      count: typeof parsed.count === "number" ? parsed.count : 0,
    };
  } catch {
    return { date: today, count: 0 };
  }
};

export function useCenterTabMode(): CenterTabModeState {
  const [aiUsageCount, setAiUsageCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadUsage = async () => {
      try {
        const raw = await AsyncStorage.getItem(AI_AGENT_DAILY_USAGE_KEY);
        const usage = normalizeStoredUsage(raw);

        await AsyncStorage.setItem(AI_AGENT_DAILY_USAGE_KEY, JSON.stringify(usage));

        if (mounted) {
          setAiUsageCount(usage.count);
        }
      } catch {
        if (mounted) {
          setAiUsageCount(0);
        }
      }
    };

    loadUsage();

    return () => {
      mounted = false;
    };
  }, []);

  const recordAiAgentUsage = async () => {
    try {
      const raw = await AsyncStorage.getItem(AI_AGENT_DAILY_USAGE_KEY);
      const usage = normalizeStoredUsage(raw);
      const nextUsage: StoredUsage = {
        date: usage.date,
        count: usage.count + 1,
      };

      await AsyncStorage.setItem(AI_AGENT_DAILY_USAGE_KEY, JSON.stringify(nextUsage));
      setAiUsageCount(nextUsage.count);
    } catch {
      setAiUsageCount((current) => current + 1);
    }
  };

  return {
    centerTabMode: aiUsageCount >= AI_AGENT_DAILY_LIMIT ? "add-transaction" : "ai-agent",
    aiUsageCount,
    remainingAiUses: Math.max(0, AI_AGENT_DAILY_LIMIT - aiUsageCount),
    recordAiAgentUsage,
  };
}