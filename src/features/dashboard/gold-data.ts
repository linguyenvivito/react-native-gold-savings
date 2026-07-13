import { useEffect, useState } from "react";

import { getOrders } from "@/features/order/order.router";
import type { Order } from "@/features/transaction/order.type";

export function useOrders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoadingOrders, setIsLoadingOrders] = useState(true);
	const [orderError, setOrderError] = useState<string | null>(null);

	const loadOrderData = async () => {
		setIsLoadingOrders(true);
		setOrderError(null);

		try {
			const response = await getOrders();
			setOrders(response);
		} catch (error) {
			setOrders([]);
			setOrderError(
				error instanceof Error ? error.message : "Unable to load orders.",
			);
			console.error("Failed to load order data:", error);
		} finally {
			setIsLoadingOrders(false);
		}
	};

	useEffect(() => {
		loadOrderData();
	}, []);

	return { orders, isLoadingOrders, orderError, loadOrderData };
}
