import type { Metadata } from "next";
import { JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "d@niel.technology",
  description: "Security Engineer | DevOps | Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.className}>
    <body className="antialiased bg-black text-green-500">
    <Navbar />
    {children}
    <Footer />
    </body>
    </html>
  );
}
