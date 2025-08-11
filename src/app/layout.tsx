import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import GlobeDock from '@/components/GlobeDock';
import RootLayoutClient from './RootLayoutClient';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Portfolio | Building playful AI + music products that travel the world',
  description: 'A music and travel-themed portfolio showcasing AI + music products across global destinations.',
  keywords: ['portfolio', 'AI', 'music', 'travel', 'software engineer', 'Spotify', 'machine learning'],
  authors: [{ name: 'Portfolio' }],
  openGraph: {
    title: 'Portfolio | AI + Music Products',
    description: 'Building playful AI + music products that travel the world',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | AI + Music Products',
    description: 'Building playful AI + music products that travel the world',
    images: ['/og-image.jpg'],
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <RootLayoutClient>
        {children}
        <GlobeDock />
        {process.env.NEXT_PUBLIC_ANALYTICS === 'vercel' && <Analytics />}
      </RootLayoutClient>
    </html>
  );
}