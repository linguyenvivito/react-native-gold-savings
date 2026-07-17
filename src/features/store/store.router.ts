import { Store } from "./store.type";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  process.env.EXPO_PUBLIC_BACKEND_URL?.trim() ||
  "https://python-gold-savings.onrender.com"; // https://python-gold-savings.onrender.com

type StoreApiResponse = {
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
