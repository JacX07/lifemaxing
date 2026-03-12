"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/onboarding";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <main className={`flex-1 overflow-y-auto bg-grid${hideSidebar ? " w-full" : ""}`}>
        {children}
      </main>
    </>
  );
}
