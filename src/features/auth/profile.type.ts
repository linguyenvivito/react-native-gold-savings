import { Store, StoreDTO } from "../store/store.type";

export interface ProfileDTO {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  created_at: string;
  updated_at: string;
  favourite_stores: FavouriteStoreDTO[];
  gold_accounts: GoldAccountDTO[];
}

interface FavouriteStoreDTO {
  id: string;
  stores: StoreDTO | StoreDTO[] | null;
}

interface GoldAccountDTO {
  id: string;
  account_name: string;
  target_amount: number;
  target_weight: number;
  target_weight_unit: string;
  transactions: TransactionDTO[];
}

interface TransactionDTO {
  id: string;
  transaction_type: string;
  quantity: number;
  executed_price: number;
  cash_amount: number;
  fee: number;
  note: string;
  created_at: string;
  updated_at: string;
  stores: StoreDTO | StoreDTO[] | null;
  gold_product: GoldProductDTO;
}

interface GoldProductDTO {
  id: string;
  product_name: string;
  product_type: string;
  purity: string;
  weight: number;
  weight_unit: string;
}

export const mapProfileDTOToModel = (row: ProfileDTO): Profile => ({
  id: String(row.id ?? ""),
  userId: String(row.user_id ?? ""),
  fullName: String(row.full_name ?? ""),
  phone: String(row.phone ?? ""),
  createdAt: String(row.created_at ?? ""),
  updatedAt: String(row.updated_at ?? ""),
  favouriteStores: Array.isArray(row.favourite_stores)
    ? row.favourite_stores.map((favourite_store) => {
        const stores = Array.isArray(favourite_store.stores)
          ? favourite_store.stores
          : favourite_store.stores
          ? [favourite_store.stores]
          : [];

        return {
          id: String(favourite_store.id ?? ""),
          stores: stores.map((store) => ({
            id: String(store.id ?? ""),
            name: String(store.name ?? ""),
            address: String(store.address ?? ""),
            phone: String(store.phone ?? ""),
            city: String(store.city ?? ""),
            email: String(store.email ?? ""),
            website: String(store.website ?? ""),
            latitude: Number(store.latitude ?? 0),
            longitude: Number(store.longitude ?? 0),
            openingTime: String(store.opening_time ?? ""),
            closingTime: String(store.closing_time ?? ""),
            createdAt: String(store.created_at ?? ""),
            updatedAt: String(store.updated_at ?? ""),
            active: String(store.active ?? ""),
          })),
        };
      })
    : [],
  goldAccounts: Array.isArray(row.gold_accounts)
    ? row.gold_accounts.map((account) => ({
        id: String(account.id ?? ""),
        accountName: String(account.account_name ?? ""),
        targetAmount: Number(account.target_amount ?? 0),
        targetWeight: Number(account.target_weight ?? 0),
        targetWeightUnit: String(account.target_weight_unit ?? ""),
        transactions: Array.isArray(account.transactions)
          ? account.transactions.map((transaction) => ({
              id: String(transaction.id ?? ""),
              transactionType: String(transaction.transaction_type ?? ""),
              quantity: Number(transaction.quantity ?? 0),
              executedPrice: Number(transaction.executed_price ?? 0),
              cashAmount: Number(transaction.cash_amount ?? 0),
              fee: Number(transaction.fee ?? 0),
              note: String(transaction.note ?? ""),
              createdAt: String(transaction.created_at ?? ""),
              updatedAt: String(transaction.updated_at ?? ""),
              goldProduct: {
                id: String(transaction.gold_product?.id ?? ""),
                productName: String(transaction.gold_product?.product_name ?? ""),
                productType: String(transaction.gold_product?.product_type ?? ""),
                purity: String(transaction.gold_product?.purity ?? ""),
                weight: Number(transaction.gold_product?.weight ?? 0),
                weightUnit: String(transaction.gold_product?.weight_unit ?? ""),
              },
              stores: (Array.isArray(transaction.stores)
                ? transaction.stores
                : transaction.stores
                ? [transaction.stores]
                : []
              ).map((store) => ({
                    id: String(store.id ?? ""),
                    name: String(store.name ?? ""),
                    address: String(store.address ?? ""),
                    phone: String(store.phone ?? ""),
                    city: String(store.city ?? ""),
                    email: String(store.email ?? ""),
                    website: String(store.website ?? ""),
                    latitude: Number(store.latitude ?? 0),
                    longitude: Number(store.longitude ?? 0),
                    openingTime: String(store.opening_time ?? ""),
                    closingTime: String(store.closing_time ?? ""),
                    createdAt: String(store.created_at ?? ""),
                    updatedAt: String(store.updated_at ?? ""),
                    active: String(store.active ?? ""),
                  }))
            }))
          : [],
      }))
    : [],
});

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  favouriteStores: FavouriteStore[];
  goldAccounts: GoldAccount[];
}

export interface FavouriteStore {
  id: string;
  stores: Store[];
}

export interface GoldAccount {
  id: string;
  accountName: string;
  targetAmount: number;
  targetWeight: number;
  targetWeightUnit: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  transactionType: string;
  quantity: number;
  executedPrice: number;
  cashAmount: number;
  fee: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  stores: Store[];
  goldProduct: GoldProduct;
}

export interface GoldProduct {
  id: string;
  productName: string;
  productType: string;
  purity: string;
  weight: number;
  weightUnit: string;
}
