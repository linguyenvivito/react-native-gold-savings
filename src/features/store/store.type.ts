export type StoreRow = {
  id: number;
  code: string;
  name: string;
  image: string;
  address: string;
  phone: string;
  culture: string;
  note: string;
};

export type Store = {
  id: number;
  code: string;
  name: string;
  image: string;
  address: string;
  phone: string;
  culture: string;
  note: string;
};

export const mapStoreRow = (row: StoreRow): Store => ({
  id: row.id,
  code: row.code,
  name: row.name,
  image: row.image,
  address: row.address,
  phone: row.phone,
  culture: row.culture,
  note: row.note,
});

export type Store_User_Row = {
  id: number;
  user_id: number;
  store_id: number;
};