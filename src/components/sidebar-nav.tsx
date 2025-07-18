
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  MessageCircle,
  Bot,
  User,
  LogIn,
  Mic,
  Home,
  ChevronDown,
  Upload,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const dataNavItems = [
    { href: '/import', label: 'Import Data', icon: Upload },
];

const aiToolsNavItems = [
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/chat', label: 'Chat with AI', icon: MessageCircle },
  { href: '/voice-assistant', label: 'Voice Assistant', icon: Mic },
  { href: '/scenario-simulator', label: 'Scenario Simulator', icon: Bot },
];

const accountNavItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/signin', label: 'Sign In', icon: LogIn },
    { href: '/signup', label: 'Sign Up', icon: UserPlus },
];


export function SidebarNav() {
  const pathname = usePathname();
  const [isAiToolsOpen, setIsAiToolsOpen] = useState(
      aiToolsNavItems.some(item => pathname.startsWith(item.href))
  );

  return (
    <SidebarMenu>
        {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className="justify-start"
            >
                <Link href={item.href}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        ))}

        <SidebarGroup className="p-0 pt-4">
            <SidebarGroupLabel className="px-2 group-data-[collapsible=icon]:px-0">
                <span className="group-data-[collapsible=icon]:hidden">Data Management</span>
            </SidebarGroupLabel>
            {dataNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                >
                    <Link href={item.href}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarGroup>

        <Collapsible open={isAiToolsOpen} onOpenChange={setIsAiToolsOpen} asChild>
          <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                      variant="ghost"
                      className="w-full justify-start group-data-[collapsible=icon]:w-8"
                      tooltip="AI Tools"
                  >
                      <Bot />
                      <span className="group-data-[collapsible=icon]:hidden flex-1 text-left">AI Tools</span>
                      <ChevronDown className={cn("group-data-[collapsible=icon]:hidden h-4 w-4 transition-transform", isAiToolsOpen && "rotate-180")} />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenu className="group-data-[collapsible=icon]:hidden ml-7 border-l pl-2 mt-1">
                      {aiToolsNavItems.map((item) => (
                          <SidebarMenuItem key={item.href} className="p-0 m-0">
                              <SidebarMenuButton
                                  asChild
                                  variant="ghost"
                                  size="sm"
                                  isActive={pathname === item.href}
                                  tooltip={item.label}
                                  className="justify-start w-full"
                              >
                                  <Link href={item.href}>
                                  <item.icon />
                                  <span>{item.label}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
              </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        
         <SidebarGroup className="p-0 pt-4">
            <SidebarGroupLabel className="px-2 group-data-[collapsible=icon]:px-0">
                <span className="group-data-[collapsible=icon]:hidden">Account Pages</span>
            </SidebarGroupLabel>
            {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                >
                    <Link href={item.href}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarGroup>
    </SidebarMenu>
  );
}
