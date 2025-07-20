
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function GoalPlannerPage() {
  return (
    <AppLayout pageTitle="Financial Goal Planner">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <Target className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold font-headline">Feature Coming Soon!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          The AI-powered Goal Planner is being refined. Please check back later for personalized financial planning.
        </p>
      </div>
    </AppLayout>
  );
}
