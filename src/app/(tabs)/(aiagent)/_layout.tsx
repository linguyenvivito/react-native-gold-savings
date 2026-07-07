import { useColorScheme } from "react-native";

import Breadcrumbs from "@/components/app-breadcrumbs";
import AIAgentScreen from ".";

export default function AIAgentLayout() {
  const colorScheme = useColorScheme();
  return <AIAgentScreen />;
}
