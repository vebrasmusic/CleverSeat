import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/navbar";

const inter = Inter_Tight({ weight: "500", subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Clever Seat",
  description: "No stress seating arrangements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Navbar />
          {children}
          <Toaster/>
        </main>
      
      </body>
    </html>
  );
}
