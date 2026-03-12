import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import StoreInit from "@/components/StoreInit";
import ToastContainer from "@/components/ToastContainer";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import ChestOpenModal from "@/components/shop/ChestOpenModal";

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
        <ClientLayout>{children}</ClientLayout>
        <ToastContainer />
        <LevelUpOverlay />
        <ChestOpenModal />
      </body>
    </html>
  );
}
