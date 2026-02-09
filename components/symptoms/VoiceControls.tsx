import { motion } from 'framer-motion';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  voiceEnabled: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
}

export function VoiceControls({
  voiceEnabled,
  isSpeaking,
  isPaused,
  isSupported,
  onPlay,
  onPause,
  onStop,
  onToggleVoice,
}: VoiceControlsProps) {
  if (!isSupported) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/50 border border-border/50"
        role="toolbar"
        aria-label="Voice feedback controls"
      >
        <span className="text-xs font-semibold text-muted-foreground mr-1 select-none">Voice</span>

        {/* Play / Pause */}
        {isSpeaking ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10"
                onClick={onPause}
                aria-label="Pause voice feedback"
              >
                <Pause className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pause</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10"
                onClick={onPlay}
                disabled={!voiceEnabled}
                aria-label="Play voice feedback"
              >
                <Play className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isPaused ? 'Resume' : 'Play risk level'}</TooltipContent>
          </Tooltip>
        )}

        {/* Stop */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-destructive/10"
              onClick={onStop}
              disabled={!isSpeaking && !isPaused}
              aria-label="Stop voice feedback"
            >
              <Square className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Stop</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 bg-border/60 mx-0.5" />

        {/* Enable / Disable */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-lg transition-colors',
                voiceEnabled ? 'hover:bg-primary/10' : 'hover:bg-muted'
              )}
              onClick={onToggleVoice}
              aria-label={voiceEnabled ? 'Disable voice feedback' : 'Enable voice feedback'}
              aria-pressed={voiceEnabled}
            >
              {voiceEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{voiceEnabled ? 'Disable voice' : 'Enable voice'}</TooltipContent>
        </Tooltip>

        {/* Speaking indicator */}
        {isSpeaking && (
          <motion.div
            className="flex items-center gap-0.5 ml-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{ height: [4, 12, 4] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
