// orders: id, user_id, asset_id, side (BUY or SELL), quantity, price, created_at

export type OrderRow = {
    id: number;
    user_id: string;
    asset_id: number;
    side: "BUY" | "SELL";
    quantity: number;
    price: number;
    otherPrice?: number;
    created_at: string;
};

export type Order = {
    id: number;
    userId: string;
    assetId: number;
    side: "BUY" | "SELL";
    quantity: number;
    price: number;
    otherPrice?: number;
    createdAt: string;
};

export const mapOrderRow = (row: OrderRow): Order => ({
    id: row.id,
    userId: row.user_id,
    assetId: row.asset_id,
    side: row.side,
    quantity: row.quantity,
    price: row.price,
    otherPrice: row.otherPrice,
    createdAt: row.created_at,
});

export const testOrders: Order[] = [
    { id: 1, userId: "18f22a43-64a1-45b6-ad48-257f79d4b4e5", assetId: 1, side: "BUY", quantity: 1, price: 85000000, otherPrice: 84000000, createdAt: "2023-01-01T10:00:00Z" },
    { id: 2, userId: "18f22a43-64a1-45b6-ad48-257f79d4b4e5", assetId: 2, side: "SELL", quantity: 1.0, price: 2800000, otherPrice: 2900000, createdAt: "2023-01-02T11:00:00Z" },
    { id: 3, userId: "18f22a43-64a1-45b6-ad48-257f79d4b4e5", assetId: 1, side: "BUY", quantity: 1, price: 84500000, otherPrice: 84000000, createdAt: "2023-01-03T12:00:00Z" },
    { id: 4, userId: "18f22a43-64a1-45b6-ad48-257f79d4b4e5", assetId: 2, side: "SELL", quantity: 3.0, price: 2750000, otherPrice: 2900000, createdAt: "2023-01-04T13:00:00Z" },
];
