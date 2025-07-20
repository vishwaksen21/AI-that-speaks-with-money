
'use client';

import { useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useFinancialData } from '@/context/financial-data-context';
import { AI } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

function PageContent() {
  const [inputValue, setInputValue] = useState('');
  const { getScenarioResponse } = useActions();
  const [messages, setMessages] = useUIState<typeof AI>();
  const [isLoading, setIsLoading] = useState(false);
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  
  const popularScenarios = [
      "What is the impact of a ₹50 Lakh home loan on my finances?",
      "Project my wealth at age 40.",
      "How will a 10% market crash affect my portfolio?",
      "Can I afford to retire 5 years early?",
  ]

  const handlePopularScenarioClick = (scenario: string) => {
    setInputValue(scenario);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !financialData) return;

    setIsLoading(true);
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div className="p-4 text-muted-foreground text-center">User is simulating: "{inputValue}"</div>
      },
    ]);
    
    try {
        const dataForAI = { ...financialData };
        delete (dataForAI as any).transactions;
        const cleanedDataString = JSON.stringify(dataForAI, null, 2);

        const responseMessage = await getScenarioResponse(inputValue, cleanedDataString);
        setMessages(currentMessages => [...currentMessages, responseMessage]);

    } catch (error) {
        console.error("Error simulating scenario:", error);
        setMessages(currentMessages => [
            ...currentMessages,
            { id: Date.now(), display: <div className="p-4 text-destructive">Sorry, an error occurred during simulation.</div> }
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
              <Bot className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Simulate Financial Scenarios</CardTitle>
          <CardDescription className="max-w-xl mx-auto">
            Ask "what if" questions about your finances, and our AI will project the impact. Explore potential futures for your money.
          </Description>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
                <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., What if I invest an extra ₹20,000 per month in mutual funds?"
                    rows={3}
                    disabled={isLoading || isDataLoading}
                />
                <Button type="submit" disabled={!inputValue.trim() || isLoading || isDataLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Simulate Scenario
                </Button>
            </form>
             <div className="max-w-xl mx-auto mt-4">
                <p className="text-sm text-muted-foreground text-center mb-2">Or try one of these popular scenarios:</p>
                <div className="grid grid-cols-2 gap-2">
                    {popularScenarios.map(scenario => (
                        <Button 
                            key={scenario} 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-auto py-2"
                            onClick={() => handlePopularScenarioClick(scenario)}
                            disabled={isLoading || isDataLoading}
                        >
                            {scenario}
                        </Button>
                    ))}
                </div>
            </div>
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
  );
}


export default function ScenarioSimulatorPage() {
  return (
    <AppLayout pageTitle="AI Scenario Simulator">
      <AI>
        <PageContent />
      </AI>
    </AppLayout>
  );
}
