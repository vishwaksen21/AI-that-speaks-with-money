
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Target, StopCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFinancialData } from '@/context/financial-data-context';
import { useActions, useUIState } from 'ai/rsc';
import type { AI } from './actions.tsx';

export default function GoalPlannerPage() {
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const { getGoalPlan } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDataLoading || !financialData || !inputValue.trim() || isStreaming) {
        return;
    }

    const dataForAI = { ...financialData };
    delete (dataForAI as any).transactions;
    const financialDataString = JSON.stringify(dataForAI, null, 2);

    setIsStreaming(true);
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div>User message</div>, // This won't be displayed, but is required by the hook
      },
    ]);

    try {
        const responseMessage = await getGoalPlan(inputValue, financialDataString);
        setMessages(currentMessages => [...currentMessages, responseMessage]);
    } catch (error) {
        console.error("Failed to get goal plan", error);
    } finally {
        setIsStreaming(false);
        setInputValue('');
    }
  };
  
  const lastMessage = messages[messages.length - 1];

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={4}
            name="prompt"
            disabled={isStreaming || isDataLoading}
          />
           <div className="flex items-center gap-2">
            <Button type="submit" disabled={isStreaming || isDataLoading || !inputValue.trim()}>
              {isStreaming ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isStreaming ? 'Generating Plan...' : 'Create My Plan'}
            </Button>
            {isStreaming && (
              <Button variant="outline" type="button" onClick={() => { /* Stop logic would go here if needed */ }}>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </form>

        {(isStreaming && !lastMessage) && (
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

        {lastMessage && (
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Your Personalized Financial Plan</CardTitle>
                <CardDescription>Here is a step-by-step guide to help you reach your goal.</CardDescription>
            </CardHeader>
            <CardContent>
                {lastMessage.display}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
