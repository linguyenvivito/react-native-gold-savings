import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";
import DashboardScreen from ".";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return <DashboardScreen />;
}
