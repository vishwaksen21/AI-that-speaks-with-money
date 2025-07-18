import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'FinanceAI Navigator',
  description: 'Your personal AI-powered financial guide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`} style={{colorScheme: 'dark'}} suppressHydrationWarning>
      <body
        className={`font-body antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
