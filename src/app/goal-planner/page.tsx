'use client';

import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Target, Wand2, User } from 'lucide-react';
import { useFinancialData } from '@/context/financial-data-context';
import { type AI } from './actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

export default function GoalPlannerPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useUIState<typeof AI>();
  const { getGoalPlan } = useActions<typeof AI>();
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialData || !inputValue.trim()) return;
    
    setIsGenerating(true);

    const dataForAI = { ...financialData };
    delete (dataForAI as any).transactions;
    const financialDataString = JSON.stringify(dataForAI, null, 2);

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: (
          <div className="flex items-start gap-4 justify-end">
            <div className="max-w-xl p-3 rounded-lg bg-primary text-primary-foreground">
              <p>{inputValue}</p>
            </div>
             <Avatar className="w-8 h-8 border">
                <AvatarFallback>
                  <User className="w-5 h-5 text-primary" />
                </AvatarFallback>
              </Avatar>
          </div>
        ),
      },
    ]);

    const responseMessage = await getGoalPlan(inputValue, financialDataString);
    setMessages(currentMessages => [...currentMessages, responseMessage]);
    
    setInputValue('');
    setIsGenerating(false);
  };

  return (
    <AppLayout pageTitle="AI Goal Planner">
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
        <ScrollArea className="flex-1 p-4 -mx-4">
            <div className="space-y-6">
                 {messages.length === 0 && (
                    <Card className="flex flex-col items-center justify-center text-center p-8">
                        <Target className="h-12 w-12 text-primary mb-4" />
                        <CardTitle className="font-headline text-2xl">Plan Your Financial Goals</CardTitle>
                        <CardDescription className="max-w-md mt-2">
                            Describe a financial goal, like "Save for a down payment on a house" or "Plan a trip to Europe," and our AI will create a personalized, step-by-step plan for you.
                        </CardDescription>
                    </Card>
                 )}
                {messages.map((message) => (
                    <div key={message.id}>
                        {message.display}
                    </div>
                ))}
                {isGenerating && messages[messages.length-1]?.display.props.children.props.children?.props?.children !== 'Loading...' && (
                     <div className="flex items-start gap-4">
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Logo className="w-5 h-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="max-w-xl p-3 rounded-lg bg-card border space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
         <div className="p-4 border-t bg-background -mx-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., I want to save for a car in 3 years..."
              autoComplete="off"
              disabled={isGenerating || isDataLoading}
            />
            <Button type="submit" size="icon" disabled={isGenerating || !inputValue.trim() || isDataLoading}>
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
