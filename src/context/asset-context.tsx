import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getAssets } from "@/features/asset/asset.router";
import type { Asset } from "@/features/asset/asset.type";

type AssetContextValue = {
  assets: Asset[];
  isLoadingAssets: boolean;
  assetError: string | null;
  loadAssetData: () => Promise<void>;
};

const AssetContext = createContext<AssetContextValue | undefined>(undefined);

export function AssetProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetError, setAssetError] = useState<string | null>(null);

  const loadAssetData = useCallback(async () => {
    setIsLoadingAssets(true);
    setAssetError(null);

    try {
      const response = await getAssets();
      setAssets(response);
    } catch (error) {
      setAssets([]);
      setAssetError(
        error instanceof Error ? error.message : "Unable to load assets.",
      );
      console.error("Failed to load asset data:", error);
    } finally {
      setIsLoadingAssets(false);
    }
  }, []);

  useEffect(() => {
    loadAssetData();
  }, [loadAssetData]);

  const value = useMemo(
    () => ({ assets, isLoadingAssets, assetError, loadAssetData }),
    [assets, isLoadingAssets, assetError, loadAssetData],
  );

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAssets must be used within AssetProvider");
  }
  return context;
}