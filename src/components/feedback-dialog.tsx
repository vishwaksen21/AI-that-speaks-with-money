
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

export function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Feedback Submitted!',
      description: "Thank you for helping us improve the application.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton tooltip="Feedback" className="justify-start">
            <MessageSquarePlus />
            <span className="group-data-[collapsible=icon]:hidden">Feedback</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
                Have a suggestion or found a bug? Let us know!
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input type="email" id="email" placeholder="So we can follow up with you" />
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea placeholder="Please be as detailed as possible." id="feedback" required />
            </div>
            </div>
            <DialogFooter>
            <Button type="submit">Submit Feedback</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
