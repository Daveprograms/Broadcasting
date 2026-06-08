import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Payment Broadcasting Network",
  description: "Secure, reliable, and instant payment delivery and routing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cyber-bg text-slate-100">
        <SessionProviderWrapper>
          {/* Futuristic Overlay Effects */}
          <div className="scanner-line" />
          <div className="grid-bg" />

          {/* Navigation */}
          <Header />

          {/* Main content frame */}
          <main className="flex-1 flex flex-col relative z-10">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
