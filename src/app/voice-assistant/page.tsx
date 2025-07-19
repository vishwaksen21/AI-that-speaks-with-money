
'use client';

import { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mic, User, Bot, Loader2, StopCircle, Volume2 } from 'lucide-react';
import { getChatAndSpeechResponse, getTextToSpeechOnly } from './actions';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { Logo } from '@/components/icons';
import { useFinancialData } from '@/context/financial-data-context';
import { readStreamableValue } from 'ai/rsc';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audio?: string | null;
}

export default function VoiceAssistantPage() {
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // @ts-ignore
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [financialDataString, setFinancialDataString] = useState('');


  useEffect(() => {
    if (financialData) {
      setFinancialDataString(JSON.stringify(financialData, null, 2));
    }
  }, [financialData]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleTranscript(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
    };
  }, []);

  const handleTranscript = async (transcript: string) => {
     if (!transcript.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: transcript,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();

    try {
      const { text } = await getChatAndSpeechResponse(transcript, financialDataString);
      
      let fullText = '';
      for await (const delta of readStreamableValue(text)) {
        if(delta){
          fullText = delta.text;
           setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === 'assistant') {
                  lastMsg.content = delta.text;
                  lastMsg.audio = delta.audio;
                  return [...prev];
              }
              return [...prev, { id: assistantMessageId, role: 'assistant', content: delta.text, audio: delta.audio }];
          });

          if(delta.audio && audioRef.current){
              audioRef.current.src = delta.audio;
              audioRef.current.play();
          }
        }
      }

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const playAudio = async (text: string) => {
      if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          return;
      }
      try {
          const res = await getTextToSpeechOnly(text);
          if (res?.media && audioRef.current) {
              audioRef.current.src = res.media;
              audioRef.current.play();
          }
      } catch (error) {
          console.error("Failed to play audio:", error);
      }
  }

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
         if (audioRef.current) {
            audioRef.current.pause();
        }
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert("Speech recognition not supported in this browser.")
      }
    }
  };

  return (
    <AppLayout pageTitle="Voice Assistant">
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
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
                  className={`max-w-xl p-4 rounded-lg prose prose-sm relative group ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border'
                  }`}
                >
                    {message.role === 'user' ? (
                        <p>{message.content}</p>
                    ) : (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                     {message.role === 'assistant' && message.content && (
                         <Button size="icon" variant="ghost" className="absolute -bottom-4 -right-4 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => playAudio(message.content)}>
                            <Volume2 className="h-4 w-4" />
                         </Button>
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
            {isLoading && (
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
        <div className="p-4 border-t bg-background flex flex-col items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground">
                {isRecording ? "Listening..." : "Tap the mic to speak"}
            </p>
            <Button 
                size="icon" 
                onClick={toggleRecording} 
                disabled={isLoading || isDataLoading} 
                className={`w-16 h-16 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
            >
              {isLoading || isDataLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isRecording ? (
                <StopCircle className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
        </div>
        <audio ref={audioRef} className="hidden" />
      </div>
    </AppLayout>
  );
}
