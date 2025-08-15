"use client";


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



import { useAuth, ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Header />
            <main>{children}</main>
            <Toaster />
          </body>
        </html>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}