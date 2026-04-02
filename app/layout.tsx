import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SmoothScrolling from "@/components/SmoothScrolling";

export const metadata: Metadata = {
  title: "BhopalRentals - Premium Car Rentals in Bhopal",
  description: "Drive Your Ambition. Premium Car Rentals in Bhopal. Modern, reliable and flexible. Choose Self-Drive or With Driver.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <SmoothScrolling>{children}</SmoothScrolling>
        </body>
      </html>
    </ClerkProvider>
  );
}
