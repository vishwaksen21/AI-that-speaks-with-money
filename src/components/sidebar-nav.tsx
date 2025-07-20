
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
  ChevronDown,
  Upload,
  UserPlus,
  Wand2,
  Target,
  HelpCircle,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/context/onboarding-context';
import { FeedbackDialog } from './feedback-dialog';

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, id: 'sidebar-dashboard-link' },
];

const dataNavItems = [
    { href: '/import', label: 'Import Data', icon: Upload, id: 'sidebar-import-link' },
];

const aiToolsNavItems = [
  { href: '/goal-planner', label: 'Goal Planner', icon: Target },
  { href: '/agents', label: 'AI Agents', icon: Wand2 },
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
  const { startTour } = useOnboarding();
  const [isAiToolsOpen, setIsAiToolsOpen] = useState(
      aiToolsNavItems.some(item => pathname.startsWith(item.href))
  );

  return (
    <SidebarMenu>
        {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href} id={item.id}>
            <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href === '/dashboard' && pathname === '/')}
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
                <SidebarMenuItem key={item.label} id={item.id}>
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
                <span className="group-data-[collapsible=icon]:hidden">Account & Help</span>
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
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={startTour}
                    tooltip="Help / Tour"
                    className="justify-start"
                >
                    <HelpCircle />
                    <span className="group-data-[collapsible=icon]:hidden">Help / Tour</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <FeedbackDialog />
            </SidebarMenuItem>
        </SidebarGroup>
    </SidebarMenu>
  );
}
