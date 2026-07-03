import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  return <Breadcrumbs />;
}
