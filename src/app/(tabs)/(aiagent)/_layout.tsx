import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";

export default function AIAgentLayout() {
  const colorScheme = useColorScheme();
  return <Breadcrumbs />;
}
