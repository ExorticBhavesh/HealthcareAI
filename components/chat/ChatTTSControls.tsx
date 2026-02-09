import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatTTSControlsProps {
  text: string;
  className?: string;
}

const STORAGE_KEY = 'wellness-chatbot-tts-enabled';

export function ChatTTSControls({ text, className }: ChatTTSControlsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(ttsEnabled));
    } catch { /* ignore */ }
  }, [ttsEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const cleanText = useCallback((raw: string) => {
    return raw
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/[🧠📌✅⚠️📊💡🔍🩺•\-]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
  }, []);

  const play = useCallback(() => {
    if (!isSupported || !text) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText(text));
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 0.9;

    // Try to pick a calm, friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Female') || v.lang.startsWith('en')
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, text, isPaused, cleanText]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  const toggleTTS = useCallback(() => {
    if (ttsEnabled) {
      stop();
    }
    setTtsEnabled(prev => !prev);
  }, [ttsEnabled, stop]);

  if (!isSupported) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn('flex items-center gap-1', className)}
        role="toolbar"
        aria-label="Text-to-speech controls"
      >
        {/* Play / Pause */}
        {isSpeaking ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-primary/10"
                onClick={pause}
                aria-label="Pause reading"
              >
                <Pause className="h-3.5 w-3.5 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Pause</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-primary/10"
                onClick={play}
                disabled={!ttsEnabled || !text}
                aria-label={isPaused ? 'Resume reading' : 'Read aloud'}
              >
                <Play className="h-3.5 w-3.5 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{isPaused ? 'Resume' : 'Read aloud'}</TooltipContent>
          </Tooltip>
        )}

        {/* Stop */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-destructive/10"
              onClick={stop}
              disabled={!isSpeaking && !isPaused}
              aria-label="Stop reading"
            >
              <Square className="h-3 w-3 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Stop</TooltipContent>
        </Tooltip>

        {/* Enable/Disable */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-7 w-7 rounded-lg', ttsEnabled ? 'hover:bg-primary/10' : 'hover:bg-muted')}
              onClick={toggleTTS}
              aria-label={ttsEnabled ? 'Disable voice' : 'Enable voice'}
              aria-pressed={ttsEnabled}
            >
              {ttsEnabled ? (
                <Volume2 className="h-3.5 w-3.5 text-primary" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">{ttsEnabled ? 'Disable voice' : 'Enable voice'}</TooltipContent>
        </Tooltip>

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="flex items-center gap-0.5 ml-0.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-0.5 bg-primary rounded-full animate-pulse"
                style={{
                  height: `${8 + (i % 2) * 4}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
