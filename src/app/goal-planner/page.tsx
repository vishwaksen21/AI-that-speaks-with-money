
'use client';

import { useActions, useUIState } from 'ai/rsc';
import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Target } from 'lucide-react';
import { useFinancialData } from '@/context/financial-data-context';
import { AI } from './actions.tsx';
import { Skeleton } from '@/components/ui/skeleton';

function PageContent() {
  const [inputValue, setInputValue] = useState('');
  const { getGoalPlan } = useActions();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [isLoading, setIsLoading] = useState(false);
  const { financialData, isLoading: isDataLoading } = useFinancialData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !financialData) return;

    setIsLoading(true);
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div className="p-4 text-muted-foreground text-center">User asked about: "{inputValue}"</div>
      },
    ]);

    try {
        const dataForAI = { ...financialData };
        delete (dataForAI as any).transactions;
        const cleanedDataString = JSON.stringify(dataForAI, null, 2);

        const responseMessage = await getGoalPlan(inputValue, cleanedDataString);
        setMessages(currentMessages => [...currentMessages, responseMessage]);
    } catch (error) {
        console.error("Error generating goal plan:", error);
         setMessages(currentMessages => [
            ...currentMessages,
            { id: Date.now(), display: <div className="p-4 text-destructive">Sorry, an error occurred.</div> }
        ]);
    } finally {
        setInputValue('');
        setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="text-center"><Skeleton className="h-10 w-3/4 mx-auto" /><Skeleton className="h-4 w-1/2 mx-auto mt-2" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full max-w-xl mx-auto" /><Skeleton className="h-10 w-full max-w-xl mx-auto mt-4" /></CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center mb-4">
                    <Target className="h-12 w-12 text-primary" />
                 </div>
                <CardTitle className="font-headline text-3xl">Plan Your Financial Goals</CardTitle>
                <CardDescription className="max-w-xl mx-auto">
                    Describe a financial goal, and our AI will create a personalized, step-by-step plan for you.
                    For example: "I want to save for a down payment on a house" or "Plan my retirement savings".
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
                    <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="e.g., I want to buy a new car in 3 years..."
                        rows={3}
                        disabled={isLoading || isDataLoading}
                    />
                    <Button type="submit" disabled={!inputValue.trim() || isLoading || isDataLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Plan
                    </Button>
                </form>
            </CardContent>
        </Card>
        
        {messages.map((message, index) => (
            <Card key={message.id || `msg-${index}`}>
                <CardContent className="pt-6">
                    {message.display}
                </CardContent>
            </Card>
        ))}
    </div>
  )
}

export default function GoalPlannerPage() {
  return (
    <AppLayout pageTitle="AI Goal Planner">
        <AI>
            <PageContent />
        </AI>
    </AppLayout>
  );
}
