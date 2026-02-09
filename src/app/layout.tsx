import type { Metadata, Viewport } from "next";
import { Kaisei_Decol, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SwipeNavigator from "@/components/SwipeNavigator";

const bodyFont = Noto_Sans_JP({
  variable: "--font-adventure-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const displayFont = Kaisei_Decol({
  variable: "--font-adventure-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "冒険者クエスト - Anvil",
  description: "毎日の習慣をクエストに変えて冒険者として成長しよう",
  applicationName: "Anvil",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Anvil",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <ThemeProvider>
          <SwipeNavigator>
            <div className="relative z-10 mx-auto max-w-md min-h-screen pb-20">
              {children}
            </div>
          </SwipeNavigator>
        </ThemeProvider>
      </body>
    </html>
  );
}
