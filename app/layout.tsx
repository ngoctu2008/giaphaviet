import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import config from "./config";
import "./globals.css";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { PushNotificationPrompt } from "./components/PushNotificationPrompt";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});
export async function generateMetadata(): Promise<Metadata> {
  // If you needed dynamically generated metadata, you'd fetch it here.
  return {
    title: config.siteName,
    description: config.siteName,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased relative`}
      >
        {children}
        <PWAInstallPrompt />
        <PushNotificationPrompt />
      </body>
    </html>
  );
}
