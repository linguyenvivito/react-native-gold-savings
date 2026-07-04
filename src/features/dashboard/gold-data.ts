import { supabase } from "@/lib/supabase";

export type GoldDataRow = {
  id: string;
  price: number;
  value: number;
  unit: string;
  currency: string;
  releaseDate: string;
  location: string;
  description: string;
};

type SupabaseGoldData = {
  id: number;
  price: number | string;
  value: number | string;
  unit: string;
  currency: string;
  release_date: string;
  location: string;
  description: string | null;
};

export type FetchGoldDataPageParams = {
  fromDate?: string;
  page: number;
  pageSize?: number;
};

export type FetchGoldDataPageResult = {
  rows: GoldDataRow[];
  hasMore: boolean;
};

const DEFAULT_PAGE_SIZE = 20;

const mapGoldDataRows = (data: SupabaseGoldData[] | null): GoldDataRow[] => {
  return (data ?? []).map((item) => ({
    id: String(item.id),
    price: typeof item.price === "string" ? Number(item.price) : item.price,
    value: typeof item.value === "string" ? Number(item.value) : item.value,
    unit: item.unit,
    currency: item.currency,
    releaseDate: item.release_date,
    location: item.location,
    description: item.description ?? "",
  }));
};

export async function fetchGoldDataPage(
  params: FetchGoldDataPageParams,
): Promise<FetchGoldDataPageResult> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const start = params.page * pageSize;
  const end = start + pageSize;

  let query = supabase
    .from("gold_data")
    .select("id, price, value, unit, currency, release_date, location, description")
    .order("release_date", { ascending: false });

  if (params.fromDate) {
    query = query.gte("release_date", params.fromDate);
  }

  const { data, error } = await query.range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const mappedRows = mapGoldDataRows(data as SupabaseGoldData[] | null);
  const hasMore = mappedRows.length > pageSize;

  return {
    rows: mappedRows.slice(0, pageSize),
    hasMore,
  };
}

export async function fetchGoldDataRows(): Promise<GoldDataRow[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("gold_data")
    .select("id, price, value, unit, currency, release_date, location, description")
    .order("release_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapGoldDataRows(data as SupabaseGoldData[] | null);
}
