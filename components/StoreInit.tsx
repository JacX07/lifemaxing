"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export default function StoreInit() {
  const checkDailyReset = useStore((s) => s.checkDailyReset);
  const profileName = useStore((s) => s.profile.name);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  useEffect(() => {
    // Redirect to onboarding if name hasn't been set yet
    if (profileName === "Player" && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
  }, [profileName, pathname, router]);

  return null;
}
