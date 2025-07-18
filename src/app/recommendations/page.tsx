
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { getRecommendations } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { getFinancialData } from '@/lib/mock-data';

// The result is now a single markdown string.
interface RecommendationResult {
  recommendations: string;
}

export default function RecommendationsPage() {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [financialDataString, setFinancialDataString] = useState('');
  const [financialDataObject, setFinancialDataObject] = useState(null);

  useEffect(() => {
    const data = getFinancialData();
    setFinancialDataObject(data as any);
  }, []);

  const handleGenerate = async () => {
    if (!financialDataObject) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Create a copy of the data and remove the transactions array before sending to the AI.
      // The transactions are not needed for high-level recommendations and can add noise.
      const dataForAI = { ...financialDataObject };
      delete (dataForAI as any).transactions;
      const cleanedDataString = JSON.stringify(dataForAI, null, 2);

      const response = await getRecommendations(cleanedDataString);
      setResult(response);
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="AI Recommendations">
      <div className="space-y-6">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Get Personalized Financial Insights</CardTitle>
                <CardDescription className="max-w-2xl mx-auto">
                    Our AI will analyze your complete financial profile to give you tailored recommendations on investments, savings, and expense management.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleGenerate} disabled={isLoading || !financialDataObject} size="lg">
                    {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Generate My Recommendations
                </Button>
            </CardContent>
        </Card>

        {error && <p className="text-destructive text-center">{error}</p>}

        {isLoading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{result.recommendations}</ReactMarkdown>
              </CardContent>
            </Card>
             <Card className="mt-4 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
                <CardHeader>
                    <CardTitle className="text-sm text-yellow-800 dark:text-yellow-300">Disclaimer</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-yellow-700 dark:text-yellow-400">
                    This information is for educational purposes only and is not financial advice. All financial decisions should be discussed with a qualified human financial advisor.
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
