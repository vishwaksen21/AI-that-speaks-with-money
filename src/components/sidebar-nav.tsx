'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'Chat with AI', icon: MessageCircle },
  { href: '/voice-assistant', label: 'Voice Assistant', icon: Mic },
  { href: '/scenario-simulator', label: 'Scenario Simulator', icon: Bot },
];

const accountNavItems = [
    { href: '#', label: 'Profile', icon: User },
    { href: '#', label: 'Sign In', icon: LogIn },
];


export function SidebarNav() {
  const pathname = usePathname();

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
