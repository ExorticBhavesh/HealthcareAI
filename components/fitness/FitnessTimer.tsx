import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw, Check, Timer } from 'lucide-react';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface FitnessTimerProps {
  activity: string;
  activityIcon: string;
  duration: number; // in minutes
  onComplete?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

export function FitnessTimer({ activity, activityIcon, duration, onComplete, onStop, onReset }: FitnessTimerProps) {
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    setState('running');
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setState('completed');
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, onComplete]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setState('paused');
  }, [clearTimer]);

  const stopTimer = useCallback(() => {
    clearTimer();
    setState('idle');
    setTimeLeft(duration * 60);
    onStop?.();
  }, [clearTimer, duration, onStop]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setState('idle');
    setTimeLeft(duration * 60);
    onReset?.();
  }, [clearTimer, duration, onReset]);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setState('idle');
    clearTimer();
  }, [duration, activity, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const stateColors = {
    idle: 'hsl(var(--muted-foreground))',
    running: 'hsl(var(--primary))',
    paused: 'hsl(var(--warning))',
    completed: 'hsl(var(--success))',
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="shadow-card border-border/40 overflow-hidden">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <span className="text-2xl">{activityIcon}</span>
          {activity}
        </CardTitle>
        <Badge
          variant="secondary"
          className={`mx-auto ${
            state === 'running' ? 'bg-primary/10 text-primary' :
            state === 'paused' ? 'bg-warning/10 text-warning' :
            state === 'completed' ? 'bg-success/10 text-success' :
            ''
          }`}
        >
          {state === 'idle' && 'Ready'}
          {state === 'running' && 'In Progress'}
          {state === 'paused' && 'Paused'}
          {state === 'completed' && 'Completed!'}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-4">
        {/* Timer Ring */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <motion.circle
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke={stateColors[state]}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {state === 'completed' ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mb-2">
                    <Check className="h-8 w-8 text-success" />
                  </div>
                  <span className="text-sm font-medium text-success">Great job!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-4xl font-bold tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {duration} min session
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {state === 'idle' && (
            <Button
              onClick={startTimer}
              className="gradient-health gap-2 shadow-lg shadow-primary/20"
              size="lg"
            >
              <Play className="h-5 w-5" />
              Start
            </Button>
          )}

          {state === 'running' && (
            <>
              <Button
                onClick={pauseTimer}
                variant="outline"
                size="lg"
                className="gap-2 border-warning/30 text-warning hover:bg-warning/10"
              >
                <Pause className="h-5 w-5" />
                Pause
              </Button>
              <Button
                onClick={stopTimer}
                variant="outline"
                size="lg"
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
            </>
          )}

          {state === 'paused' && (
            <>
              <Button
                onClick={startTimer}
                className="gradient-health gap-2"
                size="lg"
              >
                <Play className="h-5 w-5" />
                Resume
              </Button>
              <Button
                onClick={stopTimer}
                variant="outline"
                size="lg"
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
            </>
          )}

          {state === 'completed' && (
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              New Session
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
