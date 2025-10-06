import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from '@/components/providers/providers';
import { SEO } from '@/constants';
import "./globals.css";
import DatabaseInitializer from './db-init';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SEO.SITE_NAME,
    template: `%s | ${SEO.SITE_NAME}`,
  },
  description: SEO.SITE_DESCRIPTION,
  keywords: SEO.SITE_KEYWORDS,
  authors: [{ name: 'E-Commerce Team' }],
  creator: 'E-Commerce Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL,
    title: SEO.SITE_NAME,
    description: SEO.SITE_DESCRIPTION,
    siteName: SEO.SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.SITE_NAME,
    description: SEO.SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Initialize database connection */}
        <DatabaseInitializer />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
