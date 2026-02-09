import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FitnessTimer } from './FitnessTimer';
import { Dumbbell, Clock } from 'lucide-react';

interface FitnessActivity {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultDuration: number;
  color: string;
}

const ACTIVITIES: FitnessActivity[] = [
  { id: 'meditation', name: 'Meditation', icon: '🧘', description: 'Calm your mind and reduce stress', defaultDuration: 10, color: 'hsl(var(--primary))' },
  { id: 'exercise', name: 'Exercise', icon: '🏋️', description: 'Physical workout and training', defaultDuration: 30, color: 'hsl(var(--success))' },
  { id: 'yoga', name: 'Yoga', icon: '🧘‍♀️', description: 'Flexibility, balance & inner peace', defaultDuration: 20, color: 'hsl(var(--accent))' },
  { id: 'reading', name: 'Reading', icon: '📖', description: 'Expand your knowledge and relax', defaultDuration: 15, color: 'hsl(var(--info))' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🌿', description: 'Present-moment awareness practice', defaultDuration: 5, color: 'hsl(var(--chart-5))' },
  { id: 'breathing', name: 'Breathing', icon: '💨', description: 'Deep breathing exercises', defaultDuration: 5, color: 'hsl(var(--warning))' },
];

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export function FitnessActivities() {
  const [selectedActivity, setSelectedActivity] = useState<FitnessActivity | null>(null);
  const [duration, setDuration] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);

  const handleSelectActivity = (activity: FitnessActivity) => {
    if (timerActive) return;
    setSelectedActivity(activity);
    setDuration(activity.defaultDuration);
  };

  const handleStartTimer = () => {
    if (selectedActivity) {
      setTimerActive(true);
    }
  };

  const handleComplete = () => {
    if (selectedActivity) {
      setCompletedSessions(prev => [...prev, selectedActivity.id]);
    }
    setTimerActive(false);
  };

  const handleStop = () => {
    setTimerActive(false);
  };

  const handleReset = () => {
    setTimerActive(false);
    setSelectedActivity(null);
  };

  return (
    <div className="space-y-6">
      {/* Activity Selection */}
      {!timerActive && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((activity, i) => {
            const isCompleted = completedSessions.includes(activity.id);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
                    selectedActivity?.id === activity.id
                      ? 'ring-2 ring-primary border-primary/50 shadow-lg'
                      : 'border-border/40 hover:border-primary/30'
                  } ${isCompleted ? 'bg-success/5 border-success/30' : ''}`}
                  onClick={() => handleSelectActivity(activity)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{activity.name}</h4>
                          {isCompleted && (
                            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">✓ Done</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Duration Picker + Start */}
      {selectedActivity && !timerActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-card border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Set Duration for {selectedActivity.name}
              </CardTitle>
              <CardDescription>Choose how long you want to practice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-2xl font-bold">{duration} min</span>
              </div>
              <Slider
                value={[duration]}
                onValueChange={([val]) => setDuration(val)}
                min={1}
                max={60}
                step={1}
                className="py-2"
              />
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map(d => (
                  <Button
                    key={d}
                    variant={duration === d ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration(d)}
                    className="rounded-full"
                  >
                    {d} min
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleStartTimer}
                className="w-full gradient-health shadow-lg shadow-primary/20 gap-2"
                size="lg"
              >
                <Dumbbell className="h-5 w-5" />
                Start {selectedActivity.name} Session
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Timer */}
      {selectedActivity && timerActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FitnessTimer
            activity={selectedActivity.name}
            activityIcon={selectedActivity.icon}
            duration={duration}
            onComplete={handleComplete}
            onStop={handleStop}
            onReset={handleReset}
          />
        </motion.div>
      )}

      {/* Completed Sessions Summary */}
      {completedSessions.length > 0 && !timerActive && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏆</span>
              <span className="font-semibold text-sm">
                Today's Completed Sessions ({completedSessions.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {completedSessions.map((sessionId, i) => {
                const act = ACTIVITIES.find(a => a.id === sessionId);
                return (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                    {act?.icon} {act?.name}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
