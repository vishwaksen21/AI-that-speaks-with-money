
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, LogOut, AlertTriangle, Trash2, Sun, Moon, Laptop } from 'lucide-react';
import Image from 'next/image';
import { useFinancialData } from '@/context/financial-data-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { defaultFinancialData } from '@/lib/mock-data';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';

function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
                <h4 className="font-semibold">Theme</h4>
                <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-muted p-1">
                <Button variant={theme === 'light' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setTheme('light')}><Sun/></Button>
                <Button variant={theme === 'dark' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setTheme('dark')}><Moon/></Button>
                <Button variant={theme === 'system' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setTheme('system')}><Laptop/></Button>
            </div>
        </div>
    )
}

export default function ProfilePage() {
  const { financialData, setFinancialData } = useFinancialData();
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteData = () => {
    // Reset data to the default empty state
    setFinancialData(defaultFinancialData);
    toast({
        title: 'Data Deleted',
        description: 'Your financial data has been successfully deleted.',
        variant: 'destructive'
    });
    router.push('/import');
  };

  return (
    <AppLayout pageTitle="Profile & Settings">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <Image src="https://placehold.co/100x100.png" alt="A placeholder portrait of the user." width={64} height={64} data-ai-hint="person portrait" />
                <AvatarFallback>
                  {financialData?.profile_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline text-2xl">{financialData?.profile_name || 'Valued User'}</CardTitle>
                <CardDescription>user@example.com</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" defaultValue={financialData?.profile_name || ''} className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" defaultValue="user@example.com" className="pl-8" disabled />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
                <Button>Save Changes</Button>
                 <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Settings</CardTitle>
                <CardDescription>Customize your application experience.</CardDescription>
            </CardHeader>
            <CardContent>
                <ThemeToggle />
            </CardContent>
        </Card>

        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <AlertTriangle className="text-destructive" />
                    Danger Zone
                </CardTitle>
                <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                    <div>
                        <h4 className="font-semibold">Delete Financial Data</h4>
                        <p className="text-sm text-muted-foreground">Erase all your imported financial data from this device.</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all your financial data from your browser's storage.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteData}>
                                Yes, delete my data
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
