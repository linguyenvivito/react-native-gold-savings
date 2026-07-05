import { PriceSource } from "../shared/const.type";

export type PriceRow = {
  id: number;
  asset_id: number;
  buy_price: number;
  sell_price: number;
  source: PriceSource;
  release_date: string;
};

export type Price = {
  id: string;
  assetId: string;
  buyPrice: number;
  sellPrice: number;
  source: PriceSource;
  releaseDate: string;
};

export const mapPriceRow = (row: PriceRow): Price => ({
  id: String(row.id),
  assetId: String(row.asset_id),
  buyPrice: row.buy_price,
  sellPrice: row.sell_price,
  source: row.source,
    releaseDate: row.release_date,
});

export const testPrices: Price[] = [
  { id: "201", assetId: "1", buyPrice: 84500000, sellPrice: 85500000, source: "SJC", releaseDate: "2024-06-01" },
  { id: "202", assetId: "1", buyPrice: 84400000, sellPrice: 85400000, source: "PNJ", releaseDate: "2024-06-01" },
  { id: "203", assetId: "2", buyPrice: 2750000, sellPrice: 2820000, source: "DOJI", releaseDate: "2024-06-01" },
  { id: "204", assetId: "2", buyPrice: 2740000, sellPrice: 2810000, source: "INTERNAL", releaseDate: "2024-06-01" },
];