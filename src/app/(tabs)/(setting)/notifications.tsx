import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  resolveBackendUserId,
  type NotificationApiError,
} from "@/features/notification/notification.router";
import type { Notification } from "@/features/notification/notification.type";
import i18n from "@/i18n";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;
type NotificationFilter = "all" | "unread" | "read";

export default function NotificationsScreen() {
  const { currentUser } = useAuth();
  const { locale } = useLocale();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  const backendUserId = resolveBackendUserId(currentUser);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const loadNotifications = useCallback(
    async (targetPage = 1) => {
      if (!backendUserId) {
        setNotifications([]);
        setError(i18n.t("settings.notifications_setup_required"));
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const limit = targetPage * PAGE_SIZE;
        const allItems = await getNotificationsForUser(backendUserId, {
          unreadOnly: false,
          limit,
        });
        setNotifications(allItems);
        setPage(targetPage);
      } catch (loadError) {
        const message =
          (loadError as NotificationApiError)?.message ||
          i18n.t("settings.notifications_failed");
        setError(message);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    },
    [backendUserId],
  );

  const handleMarkAsRead = async (notificationId: number) => {
    if (!backendUserId) {
      return;
    }

    try {
      const marked = await markNotificationAsRead(backendUserId, notificationId);
      if (marked) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notificationId
              ? { ...item, readAt: new Date().toISOString() }
              : item,
          ),
        );
      }
    } catch (markError) {
      const message =
        (markError as NotificationApiError)?.message ||
        i18n.t("settings.notifications_failed");
      setError(message);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((item) => !item.readAt);
    }

    if (activeFilter === "read") {
      return notifications.filter((item) => Boolean(item.readAt));
    }

    return notifications;
  }, [activeFilter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.readAt).length,
    [notifications],
  );
  const readCount = useMemo(
    () => notifications.filter((item) => Boolean(item.readAt)).length,
    [notifications],
  );
  const totalCount = notifications.length;

  const allScale = useRef(new Animated.Value(1)).current;
  const unreadScale = useRef(new Animated.Value(1)).current;
  const readScale = useRef(new Animated.Value(1)).current;

  const previousCountsRef = useRef({
    total: totalCount,
    unread: unreadCount,
    read: readCount,
  });

  const animateScale = useCallback((value: Animated.Value) => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadNotifications(1);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadNotifications]);

  const hasMore = notifications.length >= page * PAGE_SIZE;

  useEffect(() => {
    const previous = previousCountsRef.current;

    if (previous.total !== totalCount) {
      animateScale(allScale);
    }

    if (previous.unread !== unreadCount) {
      animateScale(unreadScale);
    }

    if (previous.read !== readCount) {
      animateScale(readScale);
    }

    previousCountsRef.current = {
      total: totalCount,
      unread: unreadCount,
      read: readCount,
    };
  }, [allScale, animateScale, readCount, readScale, totalCount, unreadCount, unreadScale]);

  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  return (
    <ThemedView className="flex-1 bg-amber-50">
      <SafeAreaView className="flex-1 bg-amber-50">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 py-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <View className="mb-3 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="bell-badge" size={18} color="#d4af37" />
              <Text className="ml-2 text-base font-bold text-main-primary">
                {i18n.t("settings.notificationsCenter")}
              </Text>
            </View>
            <Pressable onPress={() => loadNotifications(1)}>
              <Text className="text-xs font-semibold text-blue-600">
                {i18n.t("settings.refresh")}
              </Text>
            </Pressable>
          </View>

          <View className="mb-3 flex-row items-center gap-2">
            <Pressable
              className={`rounded-full px-3 py-1.5 ${activeFilter === "all" ? "bg-slate-800" : "bg-slate-200"}`}
              onPress={() => setActiveFilter("all")}
            >
              <Animated.View style={{ transform: [{ scale: allScale }] }}>
                <Text className={`text-xs font-semibold ${activeFilter === "all" ? "text-white" : "text-slate-700"}`}>
                  {i18n.t("settings.filterAll")} ({totalCount})
                </Text>
              </Animated.View>
            </Pressable>

            <Pressable
              className={`rounded-full px-3 py-1.5 ${activeFilter === "unread" ? "bg-amber-600" : "bg-amber-100"}`}
              onPress={() => setActiveFilter("unread")}
            >
              <Animated.View style={{ transform: [{ scale: unreadScale }] }}>
                <Text className={`text-xs font-semibold ${activeFilter === "unread" ? "text-white" : "text-amber-800"}`}>
                  {i18n.t("settings.filterUnread")} ({unreadCount})
                </Text>
              </Animated.View>
            </Pressable>

            <Pressable
              className={`rounded-full px-3 py-1.5 ${activeFilter === "read" ? "bg-emerald-600" : "bg-emerald-100"}`}
              onPress={() => setActiveFilter("read")}
            >
              <Animated.View style={{ transform: [{ scale: readScale }] }}>
                <Text className={`text-xs font-semibold ${activeFilter === "read" ? "text-white" : "text-emerald-800"}`}>
                  {i18n.t("settings.filterRead")} ({readCount})
                </Text>
              </Animated.View>
            </Pressable>
          </View>

          {isLoading && (
            <Text className="mb-2 text-xs text-slate-500">
              {i18n.t("settings.loadingNotifications")}
            </Text>
          )}

          {error && <Text className="mb-2 text-xs text-red-500">{error}</Text>}

          {!isLoading && !error && filteredNotifications.length === 0 && (
            <Text className="mb-2 text-xs text-slate-500">
              {i18n.t("settings.noNotifications")}
            </Text>
          )}

          {filteredNotifications.map((item) => {
            const isUnread = !item.readAt;

            return (
              <View
                key={item.id}
                className="mb-2 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="flex-1 text-sm font-bold text-slate-800">{item.title}</Text>
                  {isUnread && (
                    <Text className="ml-2 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {i18n.t("settings.unread")}
                    </Text>
                  )}
                </View>

                <Text className="text-xs text-slate-600">{item.message}</Text>

                <Text className="mt-2 text-[11px] text-slate-400">
                  {formatter.format(new Date(item.createdAt))}
                </Text>

                {isUnread && (
                  <Pressable
                    className="mt-2 self-start rounded-md bg-emerald-600 px-2 py-1"
                    onPress={() => handleMarkAsRead(item.id)}
                  >
                    <Text className="text-xs font-semibold text-white">
                      {i18n.t("settings.markAsRead")}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}

          {hasMore && !isLoading && (
            <Pressable
              className="mt-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5"
              onPress={() => loadNotifications(page + 1)}
            >
              <Text className="text-center text-xs font-semibold text-slate-700">
                {i18n.t("settings.loadMore")}
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
