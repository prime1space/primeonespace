import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { OmnichannelWidget } from "@/components/OmnichannelWidget";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "PrimeOne Space - Vavuniya",
  description: "Premier Community workspace in Vavuniya with Starlink WiFi, modern amenities, and flexible workspace solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
        <OmnichannelWidget />
        <CookieConsent />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}