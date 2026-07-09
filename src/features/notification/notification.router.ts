import {
  mapNotificationRow,
  type Notification,
  type NotificationRow,
} from "./notification.type";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
  "https://python-gold-savings.onrender.com";

export class NotificationApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NotificationApiError";
    this.status = status;
  }
}

async function readApiError(response: Response): Promise<string> {
  let errorMessage = `Request failed with status ${response.status}`;

  try {
    const payload = await response.json();
    if (payload?.detail) {
      errorMessage = payload.detail;
    }
  } catch {
    const text = await response.text();
    if (text) {
      errorMessage = text;
    }
  }

  return errorMessage;
}

export async function getUnreadNotificationsForUser(
  userId: number,
  limit = 20,
): Promise<Notification[]> {
  return getNotificationsForUser(userId, {
    unreadOnly: true,
    limit,
  });
}

export async function getNotificationsForUser(
  userId: number,
  options?: {
    unreadOnly?: boolean;
    limit?: number;
  },
): Promise<Notification[]> {
  const unreadOnly = options?.unreadOnly ?? false;
  const limit = options?.limit ?? 20;
  const response = await fetch(
    `${API_BASE_URL}/notifications/users/${userId}?unread_only=${unreadOnly ? "true" : "false"}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new NotificationApiError(await readApiError(response), response.status);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new NotificationApiError("Invalid notification response payload", response.status);
  }

  return payload.map((row) => mapNotificationRow(row as NotificationRow));
}

export async function markNotificationAsRead(
  userId: number,
  notificationId: number,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/users/${userId}/${notificationId}/read`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new NotificationApiError(await readApiError(response), response.status);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("marked_read" in payload)) {
    throw new NotificationApiError("Invalid mark-as-read response payload", response.status);
  }

  return Boolean((payload as { marked_read?: boolean }).marked_read);
}

export async function registerPushTokenForUser(
  userId: number,
  token: string,
  provider = "expo",
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/notifications/users/${userId}/push-token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider,
      token,
    }),
  });

  if (!response.ok) {
    throw new NotificationApiError(await readApiError(response), response.status);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !("registered" in payload)) {
    throw new NotificationApiError("Invalid push-token registration response", response.status);
  }

  return Boolean((payload as { registered?: boolean }).registered);
}

export function resolveBackendUserId(currentUser: any): number | null {
  const envUserId = process.env.EXPO_PUBLIC_BACKEND_USER_ID?.trim();
  if (envUserId && /^\d+$/.test(envUserId)) {
    return Number(envUserId);
  }

  const candidates = [
    currentUser?.user_metadata?.backend_user_id,
    currentUser?.user_metadata?.backendUserId,
    currentUser?.user_metadata?.user_id,
    currentUser?.app_metadata?.backend_user_id,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isInteger(candidate)) {
      return candidate;
    }

    if (typeof candidate === "string" && /^\d+$/.test(candidate)) {
      return Number(candidate);
    }
  }

  return null;
}
