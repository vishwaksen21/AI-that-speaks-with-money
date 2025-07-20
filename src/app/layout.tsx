import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FinancialDataProvider } from '@/context/financial-data-context';
import { OnboardingProvider } from '@/context/onboarding-context';
import 'intro.js/introjs.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body
        className={`font-body antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <OnboardingProvider>
                <FinancialDataProvider>
                    {children}
                </FinancialDataProvider>
            </OnboardingProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
