import { type Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DM_Sans, Ubuntu, Outfit } from "next/font/google";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { OmnichannelWidget } from "@/components/OmnichannelWidget";
import { CookieConsent } from "@/components/CookieConsent";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PrimeOne Space | Premium Coworking in Vavuniya, Sri Lanka",
    template: "%s | PrimeOne Space",
  },
  description:
    "Sri Lanka's premier coworking space in Vavuniya. Enjoy Starlink WiFi, private meeting rooms, hot desks, dedicated offices, and flexible hourly, daily & monthly plans.",
  keywords: [
    "coworking space Vavuniya",
    "office space Sri Lanka",
    "hot desk Vavuniya",
    "meeting room rental Vavuniya",
    "PrimeOne Space",
    "remote work Sri Lanka",
    "flexible workspace Sri Lanka",
  ],
  authors: [{ name: "Prime One Global Group of Companies" }],
  creator: "Prime One Global Group of Companies",
  metadataBase: new URL("https://primeone.space"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  themeColor: "#ff4917",
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: "https://primeone.space",
    siteName: "PrimeOne Space",
    title: "PrimeOne Space | Premium Coworking in Vavuniya, Sri Lanka",
    description:
      "Book a workspace in Vavuniya's most modern coworking hub. Starlink WiFi, meeting rooms, hot desks & more — flexible plans from 1 hour to monthly.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PrimeOne Space - Coworking in Vavuniya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimeOne Space | Premium Coworking in Vavuniya",
    description:
      "Vavuniya's premier coworking hub. Book hot desks, offices & meeting rooms with Starlink WiFi.",
    images: ["/og-image.svg"],
    creator: "@PrimeOneSpace",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${ubuntu.variable} ${outfit.variable} antialiased font-sans`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
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
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}