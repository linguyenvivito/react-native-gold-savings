import { AssetCode, AssetType, AssetUnit } from "../shared/const.type";

export type AccountRow = {
  id: number;
  user_id: number;
  asset_id: string;
  quantity_available: number;
  source: string;
};

export type Account = {
  id: string;
  userId: string;
  assetId: string;
  quantityAvailable: number;
  source: string;
};

export const mapAccountRow = (row: AccountRow): Account => ({
  id: String(row.id),
  userId: String(row.user_id),
  assetId: row.asset_id,
  quantityAvailable: row.quantity_available,
  source: row.source,
});

export const testAccounts: Account[] = [
  { id: "101", userId: "18f22a43-64a1-45b6-ad48-257f79d4b4e5", assetId: "1", quantityAvailable: 2, source: "SJC" },
  { id: "102", userId: "2", assetId: "2", quantityAvailable: 15.0, source: "SJC" },
  { id: "103", userId: "2", assetId: "3", quantityAvailable: 1.0, source: "SJC" },
  { id: "104", userId: "3", assetId: "4", quantityAvailable: 8.5, source: "SJC" },
];
