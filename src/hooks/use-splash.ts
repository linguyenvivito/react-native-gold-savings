import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const SPLASH_SHOWN_KEY = "splash_screen_shown_v1";

export function useSplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkSplashStatus();
  }, []);

  const checkSplashStatus = async () => {
    try {
      const splashShown = await AsyncStorage.getItem(SPLASH_SHOWN_KEY);

      if (splashShown === "true") {
        // Skip splash if already shown in this session
        setShowSplash(false);
      } else {
        // Show splash for first time
        setShowSplash(true);
        // Mark splash as shown
        await AsyncStorage.setItem(SPLASH_SHOWN_KEY, "true");
      }
    } catch (error) {
      console.warn("Error checking splash status:", error);
      setShowSplash(false);
    } finally {
      setIsLoading(false);
    }
  };

  const hideSplash = () => {
    setShowSplash(false);
  };

  return {
    isLoading,
    showSplash,
    hideSplash,
  };
}
