import { AssetCode, AssetType, AssetUnit } from "../shared/const.type";

// Types for Asset entity
export type AssetRow = {
      id: number;
      sku: string;
      product_type: string;
      purity: string;
      weight: number;
      weight_unit: string;
      quantity: number;
};

// Types for Asset entity
export type Asset = {
      id: number;
      sku: string;
      product_type: string;
      purity: string;
      weight: number;
      weight_unit: string;
      quantity: number;
};

// Types for Asset entity
export const mapAssetRow = (row: AssetRow): Asset => ({
      id: row.id,
      sku: row.sku,
      product_type: row.product_type,
      purity: row.purity,
      weight: row.weight,
      weight_unit: row.weight_unit,
      quantity: row.quantity,
});