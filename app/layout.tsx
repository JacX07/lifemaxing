import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import StoreInit from "@/components/StoreInit";
import ToastContainer from "@/components/ToastContainer";
import LevelUpOverlay from "@/components/LevelUpOverlay";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeMaxing",
  description: "Gamified productivity — level up your life",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} antialiased flex h-screen overflow-hidden`}>
        <StoreInit />
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-grid">
          {children}
        </main>
        <ToastContainer />
        <LevelUpOverlay />
      </body>
    </html>
  );
}
