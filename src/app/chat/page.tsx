
'use client';

import { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Loader2, StopCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Logo } from '@/components/icons';
import { useChat } from 'ai/react';
import { useFinancialData } from '@/context/financial-data-context';

export default function ChatPage() {
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, stop, append } = useChat({
    api: '/api/chat', // Note: this uses a custom API route for streaming with Vercel AI SDK
    onFinish: (message) => {
      // Save history on completion
      const updatedMessages = [...messages, message];
      try {
        localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
      } catch (error) {
          console.error('Failed to save messages to local storage', error);
      }
    }
  });

  useEffect(() => {
    if (financialData) {
        try {
            const savedMessages = localStorage.getItem('chatHistory');
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        } catch (error) {
            console.error('Failed to load messages from local storage', error);
        }
    }
  }, [financialData, setMessages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDataLoading || !financialData) {
        console.error("Financial data not loaded yet.");
        return;
    }
    const dataForAI = { ...financialData };
    delete (dataForAI as any).transactions;
    
    append({
      role: 'user',
      content: input,
      data: {
        financialData: JSON.stringify(dataForAI, null, 2)
      }
    });
  }

  return (
    <AppLayout pageTitle="Chat with AI">
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                       <Logo className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-3xl p-4 rounded-lg prose prose-sm max-w-none dark:prose-invert ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border'
                  }`}
                >
                    {message.role === 'user' ? (
                        <p className="m-0">{message.content}</p>
                    ) : (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                      <User className="w-5 h-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length-1]?.role === 'user' && (
              <div className="flex items-start gap-4">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                     <Logo className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-xl p-3 rounded-lg bg-card border space-y-2">
                   <Skeleton className="h-4 w-48" />
                   <Skeleton className="h-4 w-64" />
                   <Skeleton className="h-4 w-40" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a financial question..."
              autoComplete="off"
              disabled={isLoading || isDataLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isDataLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
             {isLoading && (
              <Button variant="outline" size="icon" onClick={stop}>
                <StopCircle className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
