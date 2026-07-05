export type StoreRow = {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  culture: string;
};

export type Store = {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
culture: string;
};

export const mapStoreRow = (row: StoreRow): Store => ({
  id: row.id,
  code: row.code,
  name: row.name,
  address: row.address,
  phone: row.phone,
  culture: row.culture,
});

export type Store_User_Row = {
  id: number;
  user_id: number;
  store_id: number;
};

export const testStores: Store[] = [
    { id: 1, code: "SJC", name: "SJC", address: "123 Main St, City A", phone: "+1-555-1234", culture: "vi-VN" },
    { id: 2, code: "PNJ", name: "PNJ", address: "456 Elm St, City B", phone: "+1-555-5678", culture: "vi-VN" },
    { id: 3, code: "DOJI", name: "DOJI", address: "789 Oak St, City C", phone: "+1-555-9012", culture: "vi-VN" },
    { id: 4, code: "KIM_MON", name: "Kim Môn", address: "Buôn Ma Thuột", phone: "+1-555-3456", culture: "vi-VN" },
];

export const testStoreUsers: Store_User_Row[] = [
    { id: 1, user_id: 1, store_id: 1 },
    { id: 2, user_id: 1, store_id: 2 },
    { id: 3, user_id: 2, store_id: 3 },
    { id: 4, user_id: 3, store_id: 4 },
];