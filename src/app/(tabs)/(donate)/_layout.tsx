import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";

export default function DonateLayout() {
  const colorScheme = useColorScheme();
  return <Breadcrumbs />;
}
