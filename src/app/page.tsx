
'use client';

import { AppLayout } from '@/components/app-layout';
import { DashboardPageContent } from '@/app/dashboard/page';

export default function RootPage() {
  return (
    <AppLayout pageTitle="Dashboard">
        <DashboardPageContent />
    </AppLayout>
  );
}
