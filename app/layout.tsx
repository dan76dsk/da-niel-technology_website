import type { Metadata } from "next";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import "./globals.css";

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
    <html lang="en">
    <body className="antialiased">
    <LanguageProvider>
    <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">
    {children}
    </div>
    <Footer />
    </div>
    </LanguageProvider>
    </body>
    </html>
  );
}
