import { AssetCode, AssetType, AssetUnit } from "../shared/const.type";

export type AssetRow = {
  id: number;
  code: AssetCode;
  type: AssetType;
  unit: AssetUnit;
};

export type Asset = {
  id: string;
  code: AssetCode;
  type: AssetType;
  unit: AssetUnit;
};

export const mapAssetRow = (row: AssetRow): Asset => ({
  id: String(row.id),
  code: row.code,
  type: row.type,
  unit: row.unit,
});

export const testAssets: Asset[] = [
  { id: "1", code: "XAU_24K", type: "RING", unit: "mace" },
  { id: "2", code: "XAU_9999", type: "BAR", unit: "mace" },
];