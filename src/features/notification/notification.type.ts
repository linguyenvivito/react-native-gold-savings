export type NotificationRow = {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
};

export type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export const mapNotificationRow = (row: NotificationRow): Notification => ({
  id: row.id,
  title: row.title,
  message: row.message,
  createdAt: row.created_at,
  readAt: row.read_at,
});
