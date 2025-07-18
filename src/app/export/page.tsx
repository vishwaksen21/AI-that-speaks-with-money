'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { financialDataString } from '@/lib/mock-data';
import { Download } from 'lucide-react';

export default function ExportPage() {

  const handleExport = () => {
    const blob = new Blob([financialDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout pageTitle="Export Data">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Your Data, Your Control
        </h1>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Export Your Financial Data</CardTitle>
                <CardDescription>
                    Download your consolidated financial data in JSON format. You own your data and can use it with other models or tools.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
