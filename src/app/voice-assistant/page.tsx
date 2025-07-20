
'use client';

import { AppLayout } from '@/components/app-layout';
import { Mic } from 'lucide-react';

export default function VoiceAssistantPage() {
  return (
    <AppLayout pageTitle="Voice Assistant">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <Mic className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold font-headline">Feature Coming Soon!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Our Voice Assistant is being upgraded. Please check back later to chat with your finances.
        </p>
      </div>
    </AppLayout>
  );
}
