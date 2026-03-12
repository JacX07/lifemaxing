"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { applyTheme } from "@/lib/themes";

export default function StoreInit() {
  const checkDailyReset = useStore((s) => s.checkDailyReset);
  const profileName = useStore((s) => s.profile.name);
  const equippedTheme = useStore((s) => s.profile.equippedTheme);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  useEffect(() => {
    applyTheme(equippedTheme);
  }, [equippedTheme]);

  useEffect(() => {
    // Redirect to onboarding if name hasn't been set yet
    if (profileName === "Player" && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [profileName, pathname, router]);

  return null;
}
