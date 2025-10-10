import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navbar/navigation";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { SessionProviderWrapper } from "@/components/provider/session-provider";
import ToastProvider from "@/components/provider/toast-provider";
import { QueryProviderWrapper } from "@/components/provider/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA List - Study, Track & Manage Coding Problems",
  description:
    "A comprehensive tool for managing and studying coding problems with tags, progress tracking, and study options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <SessionProviderWrapper>
          <QueryProviderWrapper>
            <ThemeProvider>
              <Navigation />
              <main className="min-h-screen">{children}</main>
              <ToastProvider />
            </ThemeProvider>
          </QueryProviderWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
