
'use client';

import { AppLayout } from '@/components/app-layout';
import { Bot } from 'lucide-react';

export default function ScenarioSimulatorPage() {
  return (
    <AppLayout pageTitle="Scenario Simulator">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <Bot className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold font-headline">Feature Coming Soon!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          The AI-powered Scenario Simulator is currently undergoing improvements. We're working hard to bring it back online.
        </p>
      </div>
    </AppLayout>
  );
}
