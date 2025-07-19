
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, LineChart, PiggyBank, Receipt, AlertTriangle } from 'lucide-react';
import { getInvestmentAdvice, getSavingsAdvice, getExpenseAdvice } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { getFinancialData } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AgentType = 'investment' | 'savings' | 'expense';

interface AgentResult {
  agent: AgentType;
  advice: string;
}

// Simple hash function to create a key for caching based on data content
const simpleHash = (s: string) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

export default function AgentsPage() {
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loadingAgent, setLoadingAgent] = useState<AgentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [financialDataObject, setFinancialDataObject] = useState(null);

  useEffect(() => {
    const data = getFinancialData();
    setFinancialDataObject(data as any);
  }, []);

  const handleGenerate = async (agent: AgentType) => {
    if (!financialDataObject) return;

    setLoadingAgent(agent);
    setError(null);
    setResult(null);

    try {
      const dataForAI = { ...financialDataObject };
      delete (dataForAI as any).transactions;
      const cleanedDataString = JSON.stringify(dataForAI, null, 2);
      const dataHash = simpleHash(cleanedDataString);
      const cacheKey = `agent-cache-${agent}`;

      // Check cache first
      const cachedItem = sessionStorage.getItem(cacheKey);
      if (cachedItem) {
        const { hash, advice } = JSON.parse(cachedItem);
        if (hash === dataHash) {
          setResult({ agent, advice });
          setLoadingAgent(null);
          return; // Use cached data
        }
      }

      let response;
      if (agent === 'investment') {
        response = await getInvestmentAdvice(cleanedDataString);
      } else if (agent === 'savings') {
        response = await getSavingsAdvice(cleanedDataString);
      } else {
        response = await getExpenseAdvice(cleanedDataString);
      }
      
      if (response && response.advice && !response.advice.toLowerCase().includes('error')) {
        setResult({ agent, advice: response.advice });
        // Save to cache on successful response
        sessionStorage.setItem(cacheKey, JSON.stringify({ hash: dataHash, advice: response.advice }));
      } else {
         setError(response?.advice || `Failed to get advice from the ${agent} agent. The AI returned an invalid response.`);
      }

    } catch (err: any) {
      setError(err.message || `An unexpected error occurred with the ${agent} agent.`);
    } finally {
      setLoadingAgent(null);
    }
  };

  const agents = [
    {
      type: 'investment' as AgentType,
      icon: <LineChart className="w-8 h-8 text-primary" />,
      title: 'Investment Agent',
      description: 'Get tailored advice on asset allocation and investment strategies based on your portfolio.',
    },
    {
      type: 'savings' as AgentType,
      icon: <PiggyBank className="w-8 h-8 text-primary" />,
      title: 'Savings & Debt Agent',
      description: 'Find opportunities to boost your savings rate and manage your liabilities effectively.',
    },
    {
        type: 'expense' as AgentType,
        icon: <Receipt className="w-8 h-8 text-primary" />,
        title: 'Expense Agent',
        description: 'Receive tips on optimizing your spending and identifying areas for potential cutbacks.',
    }
  ];

  return (
    <AppLayout pageTitle="AI Financial Agents">
      <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Meet Your Personal Finance Team</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Select a specialized AI agent to analyze your financial data and provide targeted, actionable advice.
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            {agents.map((agent) => (
                <Card key={agent.type} className="flex flex-col">
                    <CardHeader className="flex-grow">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full w-fit">
                                {agent.icon}
                            </div>
                            <CardTitle className="font-headline text-xl">{agent.title}</CardTitle>
                        </div>
                        <CardDescription className="pt-4">{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={() => handleGenerate(agent.type)} 
                            disabled={loadingAgent !== null || !financialDataObject}
                            className="w-full"
                        >
                            {loadingAgent === agent.type ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            Ask Agent
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {loadingAgent && !result && (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/6" />
                </CardContent>
            </Card>
        )}

        {result && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline capitalize">{result.agent} Agent's Advice</CardTitle>
                <CardDescription>Here are the personalized recommendations from the AI agent.</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{result.advice}</ReactMarkdown>
              </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
