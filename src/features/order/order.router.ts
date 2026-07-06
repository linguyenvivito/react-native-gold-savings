import { mapOrderRow, type Order, type OrderRow } from "./order.type";

const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
	"https://python-gold-savings.onrender.com"; // https://python-gold-savings.onrender.com

type OrderApiResponse =
	| OrderRow
	| {
			id: number;
			userId: string;
			assetId: number;
			side: "BUY" | "SELL";
			quantity: number;
			price: number;
			otherPrice?: number;
			createdAt: string;
		};

export class OrderApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "OrderApiError";
		this.status = status;
	}
}

function mapOrderApiResponse(row: OrderApiResponse): Order {
	if ("userId" in row) {
		return {
			id: row.id,
			userId: row.userId,
			assetId: row.assetId,
			side: row.side,
			quantity: row.quantity,
			price: row.price,
			otherPrice: row.otherPrice,
			createdAt: row.createdAt,
		};
	}

	return mapOrderRow(row);
}

export async function getOrders(): Promise<Order[]> {
	const response = await fetch(`${API_BASE_URL}/orders/get`, {
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

		throw new OrderApiError(errorMessage, response.status);
	}

	const payload: unknown = await response.json();

	if (!Array.isArray(payload)) {
		throw new OrderApiError("Invalid order response payload", response.status);
	}

	return payload.map((row) => mapOrderApiResponse(row as OrderApiResponse));
}

