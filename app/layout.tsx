import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClickChain — AI Service Desk for HVAC & Field Service",
  description: "AI-powered call handling and structured service-request automation for HVAC and field-service teams.",
  applicationName: "ClickChain",
  keywords: ["HVAC automation", "AI service desk", "voice AI", "field service automation", "job intake"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geistSans.variable + " " + geistMono.variable + " antialiased"}>{children}</body></html>;
}
