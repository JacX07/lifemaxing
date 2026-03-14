"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { applyTheme } from "@/lib/themes";

export default function StoreInit() {
  const checkDailyReset = useStore((s) => s.checkDailyReset);
  const profileName = useStore((s) => s.profile.name);
  const equippedTheme = useStore((s) => s.profile.equippedTheme);
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand to rehydrate from localStorage before acting
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (hydrated) checkDailyReset();
  }, [hydrated, checkDailyReset]);

  useEffect(() => {
    if (hydrated) applyTheme(equippedTheme);
  }, [hydrated, equippedTheme]);

  useEffect(() => {
    if (!hydrated) return;
    // Redirect to onboarding if name hasn't been set yet
    if (profileName === "Player" && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [hydrated, profileName, pathname, router]);

  return null;
}
