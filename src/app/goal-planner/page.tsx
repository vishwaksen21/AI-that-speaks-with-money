
'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Target, StopCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { useFinancialData } from '@/context/financial-data-context';
import { getGoalResponse } from './actions';
import { readStreamableValue } from 'ai/rsc';

export default function GoalPlannerPage() {
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const [completion, setCompletion] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDataLoading || !financialData || !input.trim()) return;

    setIsLoading(true);
    setCompletion('');
    const controller = new AbortController();
    setAbortController(controller);

    try {
        const dataForAI = { ...financialData };
        delete (dataForAI as any).transactions;
        const financialDataString = JSON.stringify(dataForAI, null, 2);

        const stream = await getGoalResponse(input, financialDataString);

        let result = '';
        for await (const delta of readStreamableValue(stream)) {
            if (typeof delta === 'string') {
                result += delta;
                setCompletion(result);
            }
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            console.error('Error fetching goal plan:', error);
            setCompletion("Sorry, an error occurred while generating your plan. Please try again.");
        }
    } finally {
        setIsLoading(false);
        setAbortController(null);
    }
  };
  
  const stop = () => {
    if (abortController) {
        abortController.abort();
        setIsLoading(false);
    }
  };

  return (
    <AppLayout pageTitle="Financial Goal Planner">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full w-fit">
                <Target className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Plan Your Financial Goals
                </h1>
                <p className="text-muted-foreground mt-1">
                    Tell our AI your goal, and we'll create a personalized plan to help you achieve it.
                </p>
            </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Textarea
            placeholder='e.g., "I want to save for a down payment on a house. My budget is ₹20 lakhs and I want to achieve this in 5 years." or "I want to retire at age 55 with a corpus of ₹5 crores."'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            disabled={isLoading || isDataLoading}
          />
           <div className="flex items-center gap-2">
            <Button type="submit" disabled={isLoading || isDataLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating Plan...' : 'Create My Plan'}
            </Button>
            {isLoading && (
              <Button variant="outline" onClick={stop}>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </form>

        {(isLoading && !completion) && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Generating Your Personalized Plan...</CardTitle>
                    <CardDescription>Our AI is analyzing your goals and financial data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/6" />
                     <Skeleton className="h-4 w-full mt-4" />
                    <Skeleton className="h-4 w-3/6" />
                </CardContent>
            </Card>
        )}

        {completion && (
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Your Personalized Financial Plan</CardTitle>
                <CardDescription>Here is a step-by-step guide to help you reach your goal.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{completion}</ReactMarkdown>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
