
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { AI } from './actions.tsx';

function PageContent() {
  return (
      <div className="flex flex-col items-center justify-center text-center py-12">
          <Bot className="h-16 w-16 text-primary mb-4" />
          <CardHeader>
              <CardTitle className="font-headline text-2xl">Simulate Financial Scenarios</CardTitle>
              <CardDescription className="max-w-md mt-2">
                 This feature is being updated. Ask "what if" questions about your finances, and our AI will project the impact.
              </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Simulate Scenario (Coming Soon)</Button>
          </CardContent>
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
