import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Profile } from "@/features/auth/profile.type";
import { getProfiles } from "@/features/auth/auth.router";
import { supabase } from "@/lib/supabase";

type ProfileContextValue = {
  profiles: Profile[];
  isLoadingProfiles: boolean;
  profileError: string | null;
  loadProfileData: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    setIsLoadingProfiles(true);
    setProfileError(null);

    try {
      const { data, error } = await supabase?.auth.getSession() ?? { data: null, error: null };
      if (error) {
        throw error;
      }

      const accessToken = data?.session?.access_token;
      if (!accessToken) {
        throw new Error("No active auth session.");
      }

      const response = await getProfiles(accessToken);
      setProfiles(response);
    } catch (error) {
      setProfiles([]);
      setProfileError(
        error instanceof Error ? error.message : "Unable to load profiles.",
      );
      console.error("Failed to load profile data:", error);
    } finally {
      setIsLoadingProfiles(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const value = useMemo(
    () => ({ profiles, isLoadingProfiles, profileError, loadProfileData }),
    [profiles, isLoadingProfiles, profileError, loadProfileData],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfiles must be used within ProfileProvider");
  }
  return context;
}