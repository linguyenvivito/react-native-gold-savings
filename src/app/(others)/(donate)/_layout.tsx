import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";
import DonateScreen from ".";

export default function DonateLayout() {
  const colorScheme = useColorScheme();
  return <DonateScreen />;
}
