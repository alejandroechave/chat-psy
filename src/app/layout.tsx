import type { Metadata, Viewport } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google'; // Disabled: requires internet connection
import { APP_META } from '@/lib/constants';
import './globals.css';

// Font configuration disabled for offline development
// const geistSans = Geist({
//   variable: '--font-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-mono',
//   subsets: ['latin'],
// });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: APP_META.title,
  description: APP_META.description,
  keywords: [...APP_META.keywords],
  authors: [{ name: APP_META.author }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`antialiased bg-background text-gray-900`}
      >
        <main role="main">{children}</main>
      </body>
    </html>
  );
}
