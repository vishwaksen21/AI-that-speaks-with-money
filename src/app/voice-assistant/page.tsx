
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mic, Pause, Play, Redo, Send, User } from 'lucide-react';
import { useFinancialData } from '@/context/financial-data-context';
import { useEffect, useRef, useState } from 'react';
import { getChatAndSpeechResponse, getTextToSpeechOnly } from './actions';
import { readStreamableValue } from 'ai/rsc';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';

// Simple polyfill for browsers that don't support requestIdleCallback
const rIC =
  typeof window !== 'undefined'
    ? window.requestIdleCallback ||
      function (cb) {
        const start = Date.now();
        return setTimeout(function () {
          cb({
            didTimeout: false,
            timeRemaining: function () {
              return Math.max(0, 50 - (Date.now() - start));
            },
          });
        }, 1);
      }
    : (cb: (deadline: any) => void) => {
        // Mock for SSR
        const start = Date.now();
        return setTimeout(() => {
             cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
            });
        }, 1)
    };

export default function VoiceAssistantPage() {
  const { financialData, isLoading: isDataLoading } = useFinancialData();
  const [isRecording, setIsRecording] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [responseAudio, setResponseAudio] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopConversation = () => {
    setIsRecording(false);
    setIsResponding(false);
    if(mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }

  const handleStartRecording = async () => {
    setTranscript('');
    setResponseText('');
    setResponseAudio(null);
    setIsRecording(true);
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition. Please try Chrome or Firefox.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
             setTranscript(prev => prev + finalTranscript);
        };
        
        recognition.start();

        mediaRecorder.onstop = () => {
            recognition.stop();
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();

    } catch(err) {
        console.error("Error accessing microphone:", err);
        setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if(transcript.trim()) {
        handleSubmit(transcript);
    }
  };
  
  const handleReplay = async () => {
      if(!responseText) return;
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        setIsResponding(true);
        const ttsResponse = await getTextToSpeechOnly(responseText);
        if (ttsResponse?.media) {
            setResponseAudio(ttsResponse.media);
        }
        setIsResponding(false);
      }
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim() || !financialData) return;
    setIsResponding(true);

    try {
        const dataForAI = { ...financialData };
        delete (dataForAI as any).transactions;
        const cleanedDataString = JSON.stringify(dataForAI, null, 2);

        const streamable = await getChatAndSpeechResponse(text, cleanedDataString);
        
        for await (const delta of readStreamableValue(streamable)) {
            if (delta) {
                setResponseText(delta.text ?? '');
                if(delta.audio){
                   setResponseAudio(delta.audio);
                }
            }
        }

    } catch (error) {
        console.error("Error in voice assistant:", error);
        setResponseText("Sorry, I encountered an error. Please try again.");
    } finally {
        setIsResponding(false);
    }
  }
  
  useEffect(() => {
    if(responseAudio) {
       rIC(() => {
            const audio = new Audio(responseAudio);
            audioRef.current = audio;
            audio.play();
            setIsPlaying(true);
            audio.onended = () => {
                setIsPlaying(false);
            }
       });
    }
  }, [responseAudio]);


  return (
    <AppLayout pageTitle="Voice Assistant">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="min-h-[400px] flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="font-headline text-center">Talk to Your Finances</CardTitle>
            <CardDescription className="text-center">
                {isRecording ? "Listening..." : (isResponding ? "Thinking..." : "Press the button to start speaking.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
             <div className="w-full text-center space-y-4">
                {transcript && (
                    <div className="flex items-start justify-end gap-3">
                         <p className="p-3 rounded-lg bg-primary text-primary-foreground max-w-sm text-left">{transcript}</p>
                         <Avatar className="w-8 h-8 border">
                            <AvatarFallback><User className="w-5 h-5 text-primary" /></AvatarFallback>
                        </Avatar>
                    </div>
                )}
                
                {isResponding && !responseText && (
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 border">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Logo className="w-5 h-5" /></AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-lg bg-card border">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}

                {responseText && (
                     <div className="flex items-start gap-3">
                         <Avatar className="w-8 h-8 border">
                            <AvatarFallback className="bg-primary text-primary-foreground"><Logo className="w-5 h-5" /></AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-lg bg-card border text-left prose prose-sm max-w-none dark:prose-invert">
                           <ReactMarkdown>{responseText}</ReactMarkdown>
                        </div>
                    </div>
                )}
             </div>
          </CardContent>
          <div className="p-4 border-t flex justify-center items-center gap-4">
            <Button 
                size="icon" 
                className="rounded-full w-16 h-16" 
                disabled={isResponding || isDataLoading}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? <Pause className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            {responseText && (
                <Button size="icon" variant="outline" onClick={handleReplay} disabled={isResponding || isPlaying}>
                    <Redo className="h-4 w-4" />
                </Button>
            )}
          </div>
        </Card>
        {responseAudio && <audio src={responseAudio} className="hidden" />}
      </div>
    </AppLayout>
  );
}

// Polyfill for SpeechRecognition
if (typeof window !== 'undefined') {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
}
