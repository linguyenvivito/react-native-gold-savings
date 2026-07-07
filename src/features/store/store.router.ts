import { mapStoreRow, type Store, type StoreRow } from "./store.type";

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
    process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
    "https://python-gold-savings.onrender.com"; // https://python-gold-savings.onrender.com

type StoreApiResponse =
    | StoreRow
    | {
            id: number;
            code: string;
            name: string;
            image: string;
            address: string;
            phone: string;
            culture: string;
            note: string;
        };

export class StoreApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "StoreApiError";
        this.status = status;
    }
}

function mapStoreApiResponse(row: StoreApiResponse): Store {
    if ("userId" in row) {
        return {
            id: row.id,
            code: row.code,
            name: row.name,
            image: row.image,
            address: row.address,
            phone: row.phone,
            culture: row.culture,
            note: row.note,
        };
    }

    return mapStoreRow(row);
}

export async function getStores(): Promise<Store[]> {
    const response = await fetch(`${API_BASE_URL}/stores/get`, {
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

        throw new StoreApiError(errorMessage, response.status);
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
        throw new StoreApiError("Invalid store response payload", response.status);
    }

    return payload.map((row) => mapStoreApiResponse(row as StoreApiResponse));
}

