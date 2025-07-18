
'use client';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { getScenarioResponse } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { getFinancialData } from '@/lib/mock-data';

interface ScenarioResult {
  analysis: string;
  recommendations: string;
}

export default function ScenarioSimulatorPage() {
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [financialDataString, setFinancialDataString] = useState('');

  useEffect(() => {
      const data = getFinancialData();
      setFinancialDataString(JSON.stringify(data, null, 2));
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getScenarioResponse(scenario, financialDataString);
      setResult({
        analysis: response.scenarioAnalysis,
        recommendations: response.recommendations,
      });
    } catch (err) {
      setError('Failed to simulate scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="Scenario Simulator">
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            Simulate Your Financial Future
            </h1>
            <p className="text-muted-foreground mt-1">
                Describe a financial scenario to see its potential impact on your finances.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder='e.g., "What is the impact of a ₹50L home loan?" or "Project my wealth at age 40 if I increase my SIP by ₹5,000."'
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            rows={4}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Simulate Scenario
          </Button>
        </form>

        {error && <p className="text-destructive">{error}</p>}
        
        {isLoading && (
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Scenario Analysis</CardTitle>
                        <CardDescription>Calculating potential outcomes...</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                         <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/6" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Recommendations</CardTitle>
                         <CardDescription>Generating actionable advice...</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                </Card>
            </div>
        )}

        {result && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{result.recommendations}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
