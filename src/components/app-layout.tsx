import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Logo } from './icons';
import { Button } from './ui/button';
import { Search, User, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AppLayout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) {
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold font-headline text-foreground group-data-[collapsible=icon]:hidden">
              Soft UI
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
          {/* Need help card can go here if needed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <div>
              <p className="text-sm text-muted-foreground">Pages / {pageTitle}</p>
              <h1 className="text-lg font-bold font-headline">
                {pageTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Type here..." className="pl-9" />
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
