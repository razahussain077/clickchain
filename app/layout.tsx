import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClickChain — AI Job Intake for HVAC Teams",
  description: "Capture HVAC service enquiries, create structured job requests and route urgent cases to a human.",
  applicationName: "ClickChain",
  keywords: ["HVAC job intake", "AI service desk", "voice AI", "field service operations"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geistSans.variable + " " + geistMono.variable + " antialiased"}>{children}</body></html>;
}
