import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          try {
            var lang = localStorage.getItem('language') || 'en';
            document.documentElement.lang = lang;
          } catch (e) {}
        })();
      `}} />
    </head>
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
