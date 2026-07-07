import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";
import AssetScreen from ".";

export default function AssetLayout() {
  const colorScheme = useColorScheme();
  return <AssetScreen />;
}
