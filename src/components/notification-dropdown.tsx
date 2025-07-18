
'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

const notifications = [
  {
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    title: 'Net worth increased by 2.5%',
    time: '15 minutes ago',
  },
  {
    icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
    title: 'New insight from AI Chat',
    time: '1 hour ago',
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    title: 'SIP of ₹10,000 processed for HDFC Index Fund',
    time: '1 day ago',
  },
];

export function NotificationDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="font-headline text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={index} className="px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <Separator />
            <div className="p-2 text-center">
                 <Button variant="link" size="sm" className="w-full">
                   Mark all as read
                </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
