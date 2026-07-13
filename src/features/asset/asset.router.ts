import { mapAssetRow, type Asset, type AssetRow } from "./asset.type";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
  "https://python-gold-savings.onrender.com"; // https://python-gold-savings.onrender.com

// Types for Asset API response
type AssetApiResponse =
  | AssetRow
  | {
      id: number;
      sku: string;
      product_type: string;
      purity: string;
      weight: number;
      weight_unit: string;
      quantity: number;
    };

// Custom error class for Asset API errors
export class AssetApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AssetApiError";
    this.status = status;
  }
}

function mapAssetApiResponse(row: AssetApiResponse): Asset {
  if ("id" in row) {
    return {
      id: row.id,
      sku: row.sku,
      product_type: row.product_type,
      purity: row.purity,
      weight: row.weight,
      weight_unit: row.weight_unit,
      quantity: row.quantity,
    };
  }

  return mapAssetRow(row);
}

export async function getAssets(): Promise<Asset[]> {
  const response = await fetch(`${API_BASE_URL}/assets/get`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
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

    throw new AssetApiError(errorMessage, response.status);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new AssetApiError("Invalid Asset response payload", response.status);
  }

  return payload.map((row) => mapAssetApiResponse(row as AssetApiResponse));
}
