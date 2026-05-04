import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const SITE_URL = "https://www.ucsdfounders.com";
const TITLE = "Founders Network · UCSD";
const DESCRIPTION =
  "One network for every founder at UCSD. Business, engineering, and science orgs in one place to find co-founders, talent, and the next thing to build.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Founders Network",
  },
  description: DESCRIPTION,
  applicationName: "Founders Network",
  keywords: [
    "UCSD",
    "founders",
    "startups",
    "entrepreneurship",
    "students",
    "engineering",
    "computer science",
    "business",
    "co-founders",
    "Student Entrepreneurs Network",
    "San Diego",
  ],
  authors: [{ name: "Founders Network at UCSD" }],
  category: "Education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Founders Network",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a08] text-neutral-200">{children}</body>
    </html>
  );
}
