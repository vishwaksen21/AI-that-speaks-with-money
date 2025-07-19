
'use client';
import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, StopCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { useFinancialData } from '@/context/financial-data-context';
import { useActions, useUIState } from 'ai/rsc';
import type { AI } from './actions';

export default function ScenarioSimulatorPage() {
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const { getScenarioResponse } = useActions<typeof AI>();
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
        display: <div>User message</div>, // Placeholder
      },
    ]);

    const responseMessage = await getScenarioResponse(inputValue, financialDataString);
    setMessages(currentMessages => [...currentMessages, responseMessage]);
    setIsStreaming(false);
  };
  
  const lastMessage = messages[messages.length-1];
  const completion = lastMessage?.role === 'assistant' ? lastMessage.display : null;
  const completionText = lastMessage?.role === 'assistant' ? lastMessage.content : '';
  
  const { analysis, recommendations } = useMemo(() => {
    if (!completionText) {
      return { analysis: '', recommendations: '' };
    }
    const parts = completionText.split('### Recommendations');
    const analysisPart = parts[0].replace('### Scenario Analysis', '').trim();
    const recommendationsPart = parts[1] || '';
    return { analysis: analysisPart, recommendations: recommendationsPart };
  }, [completionText]);

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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Textarea
            placeholder='e.g., "What is the impact of a ₹50L home loan?" or "Project my wealth at age 40 if I increase my SIP by ₹5,000."'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
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
              {isStreaming ? 'Generating...' : 'Simulate Scenario'}
            </Button>
            {isStreaming && (
              <Button variant="outline" type="button" onClick={() => { /* Stop logic */ }}>
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </form>

        {(isStreaming && !completion) && (
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

        {completion && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{recommendations}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
