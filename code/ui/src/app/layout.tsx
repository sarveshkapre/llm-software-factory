import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";

const sans = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "LLM Software Factory",
  description: "Minimal, modular interface for orchestrating LLM software workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
