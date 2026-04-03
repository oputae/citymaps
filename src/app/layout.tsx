import type { Metadata } from "next";
import {
  DM_Serif_Display,
  Geist,
  Geist_Mono,
  Libre_Baskerville,
  Outfit,
  Space_Grotesk,
  Syne,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-poster-space",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-poster-outfit",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-poster-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-poster-dm",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "City Vibe Maps — Posters from real places",
  description:
    "Design print-ready map posters from OpenStreetMap: search a place, choose a theme, optionally mark a pin by address or map click, export a PNG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    geistSans.variable,
    syne.variable,
    geistMono.variable,
    spaceGrotesk.variable,
    outfit.variable,
    libreBaskerville.variable,
    dmSerifDisplay.variable,
  ].join(" ");

  return (
    <html lang="en">
      <body className={`${fontVars} font-sans`}>{children}</body>
    </html>
  );
}
