"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/onboarding";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 overflow-y-auto bg-grid${hideSidebar ? " w-full" : ""} pb-16 sm:pb-0`}>
        {children}
      </main>
      {!hideSidebar && <BottomNav />}
    </>
  );
}
