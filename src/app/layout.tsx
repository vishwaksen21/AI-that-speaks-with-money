import type { Metadata } from 'next';
import { Geist_Sans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geist = Geist_Sans({ subsets: ['latin'], variable: '--font-geist' });

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
    <html lang="en" className="dark" style={{colorScheme: 'dark'}} suppressHydrationWarning>
      <body
        className={`${geist.variable} font-body antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
