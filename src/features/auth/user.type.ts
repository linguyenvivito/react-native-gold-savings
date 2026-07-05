// API row models (snake_case)
export type UserRow = {
  id: number;
  email: string;
  created_at: string; // ISO datetime from API
};

// App models (camelCase)
export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export const mapUserRow = (row: UserRow): User => ({
  id: String(row.id),
  email: row.email,
  createdAt: row.created_at,
});

export const testUsers: User[] = [
  { id: "18f22a43-64a1-45b6-ad48-257f79d4b4e5", email: "li@vivito.com.au", createdAt: "2026-07-01T08:00:00.000Z" },
  { id: "b1f22a43-64a1-45b6-ad48-257f79d4b4e5", email: "bob@goldsavings.dev", createdAt: "2026-07-02T09:30:00.000Z" },
  { id: "c1f22a43-64a1-45b6-ad48-257f79d4b4e5", email: "carol@goldsavings.dev", createdAt: "2026-07-03T11:15:00.000Z" },
];