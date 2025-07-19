
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  MessageCircle,
  Bot,
  User,
  LogIn,
  Mic,
  Home,
  Upload,
  UserPlus,
  Wand2,
} from 'lucide-react';
import { useFinancialData } from '@/context/financial-data-context';

interface CommandMenuProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter();
  const { financialData } = useFinancialData();

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const navigationCommands = [
      { href: '/home', label: 'Home', icon: Home },
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/import', label: 'Import Data', icon: Upload },
      { href: '/agents', label: 'AI Agents', icon: Wand2 },
      { href: '/chat', label: 'Chat with AI', icon: MessageCircle },
      { href: '/voice-assistant', label: 'Voice Assistant', icon: Mic },
      { href: '/scenario-simulator', label: 'Scenario Simulator', icon: Bot },
      { href: '/profile', label: 'Profile', icon: User },
      { href: '/signin', label: 'Sign In', icon: LogIn },
      { href: '/signup', label: 'Sign Up', icon: UserPlus },
  ];
  
  const financialDataCommands = [];

  if (financialData) {
      if (financialData.bank_accounts) {
          financialData.bank_accounts.forEach(acc => {
              financialDataCommands.push({ name: `${acc.bank} Balance`, value: acc.balance, currency: financialData.profile_currency });
          });
      }
      if (financialData.net_worth) {
          financialDataCommands.push({ name: 'Net Worth', value: financialData.net_worth, currency: financialData.profile_currency });
      }
      if (financialData.credit_score) {
          financialDataCommands.push({ name: 'Credit Score', value: financialData.credit_score });
      }
  }


  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationCommands.map((nav) => (
            <CommandItem key={nav.href} onSelect={() => runCommand(() => router.push(nav.href))}>
              <nav.icon className="mr-2 h-4 w-4" />
              <span>{nav.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        {financialDataCommands.length > 0 && <CommandSeparator />}
        
        <CommandGroup heading="Financial Data">
            {financialDataCommands.map(item => (
                <CommandItem key={item.name}>
                    <span>{item.name}:</span>
                    <span className="ml-auto font-mono">
                         {item.currency ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.currency, minimumFractionDigits: 0 }).format(item.value) : item.value}
                    </span>
                </CommandItem>
            ))}
        </CommandGroup>
        
        <CommandSeparator />

        <CommandGroup heading="AI Actions">
            <CommandItem onSelect={() => runCommand(() => router.push('/chat'))}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask a question about your finances...
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/scenario-simulator'))}>
                <Bot className="mr-2 h-4 w-4" />
                Simulate a financial scenario...
            </CommandItem>
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
}
