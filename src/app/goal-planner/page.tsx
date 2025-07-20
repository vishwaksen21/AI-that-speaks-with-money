
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { AI } from './actions.tsx';

function PageContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
        <Target className="h-16 w-16 text-primary mb-4" />
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Plan Your Financial Goals</CardTitle>
            <CardDescription className="max-w-md mt-2">
                This feature is being updated. Describe a financial goal, and our AI will create a personalized, step-by-step plan for you.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button disabled>Generate Plan (Coming Soon)</Button>
        </CardContent>
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
