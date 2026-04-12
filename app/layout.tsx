import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ganapathi Kakarla | AI & Data Science Portfolio",
  description:
    "Technical professional bridging Healthcare & AI — machine learning, data analysis, and business intelligence for clinical innovation.",
  keywords: ["AI", "Data Science", "Healthcare AI", "Machine Learning", "Portfolio", "Ganapathi Kakarla"],
  authors: [{ name: "Ganapathi Kakarla" }],
  openGraph: {
    title: "Ganapathi Kakarla | AI & Data Science",
    description: "Bridging Healthcare & Artificial Intelligence",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#050510] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
