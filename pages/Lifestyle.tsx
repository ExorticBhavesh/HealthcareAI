import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLifestyleLogs, type NewLifestyleLog } from '@/hooks/useLifestyleLogs';
import { WellnessRoutinePlanner } from '@/components/wellness/WellnessRoutinePlanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  Moon,
  Activity,
  Footprints,
  Apple,
  Brain,
  Droplets,
  Cigarette,
  Wine,
  CalendarIcon,
  Save,
  Loader2,
  Check,
  Users,
  Heart,
  Sparkles,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LifestylePage() {
  const { logs, isLoading, addLog, isAdding, todayLog } = useLifestyleLogs();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Form state
  const [formData, setFormData] = useState<NewLifestyleLog>({
    sleep_hours: todayLog?.sleep_hours || 7,
    exercise_minutes: todayLog?.exercise_minutes || 30,
    daily_steps: todayLog?.daily_steps || 5000,
    diet_quality: todayLog?.diet_quality || 6,
    stress_level: todayLog?.stress_level || 5,
    water_glasses: todayLog?.water_glasses || 6,
    smoking: todayLog?.smoking || false,
    alcohol_units: todayLog?.alcohol_units || 0,
    notes: todayLog?.notes || '',
    family_time_minutes: todayLog?.family_time_minutes || 0,
    social_quality: todayLog?.social_quality || 5,
    spiritual_minutes: todayLog?.spiritual_minutes || 0,
    mental_relaxation_minutes: todayLog?.mental_relaxation_minutes || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLog({
      ...formData,
      log_date: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

  const updateField = <K extends keyof NewLifestyleLog>(field: K, value: NewLifestyleLog[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Lifestyle Tracking
            </h1>
            <p className="text-muted-foreground">
              Log your daily habits to improve your health insights
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sleep */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sleep</CardTitle>
                    <CardDescription>Hours of sleep last night</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold">{formData.sleep_hours}h</span>
                </div>
                <Slider
                  value={[formData.sleep_hours || 7]}
                  onValueChange={([val]) => updateField('sleep_hours', val)}
                  min={0}
                  max={12}
                  step={0.5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h</span><span>6h</span><span>12h</span>
                </div>
              </CardContent>
            </Card>

            {/* Exercise */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Exercise</CardTitle>
                    <CardDescription>Minutes of activity today</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold">{formData.exercise_minutes} min</span>
                </div>
                <Slider
                  value={[formData.exercise_minutes || 30]}
                  onValueChange={([val]) => updateField('exercise_minutes', val)}
                  min={0}
                  max={180}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 min</span><span>90 min</span><span>180 min</span>
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Footprints className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Daily Steps</CardTitle>
                    <CardDescription>Total steps walked today</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  value={formData.daily_steps || ''}
                  onChange={(e) => updateField('daily_steps', parseInt(e.target.value) || 0)}
                  placeholder="Enter steps"
                  min={0}
                  max={50000}
                  className="text-lg font-semibold"
                />
                <p className="text-sm text-muted-foreground">
                  Goal: 10,000 steps • Current: {((formData.daily_steps || 0) / 100).toFixed(0)}%
                </p>
              </CardContent>
            </Card>

            {/* Diet Quality */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                    <Apple className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Diet Quality</CardTitle>
                    <CardDescription>Rate your nutrition today</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality Score</span>
                  <span className="text-2xl font-bold">{formData.diet_quality}/10</span>
                </div>
                <Slider
                  value={[formData.diet_quality || 6]}
                  onValueChange={([val]) => updateField('diet_quality', val)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span><span>Average</span><span>Excellent</span>
                </div>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Stress Level</CardTitle>
                    <CardDescription>How stressed do you feel?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Level</span>
                  <span className="text-2xl font-bold">{formData.stress_level}/10</span>
                </div>
                <Slider
                  value={[formData.stress_level || 5]}
                  onValueChange={([val]) => updateField('stress_level', val)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Relaxed</span><span>Moderate</span><span>Very Stressed</span>
                </div>
              </CardContent>
            </Card>

            {/* Hydration */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Hydration</CardTitle>
                    <CardDescription>Glasses of water today</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Glasses</span>
                  <span className="text-2xl font-bold">{formData.water_glasses}</span>
                </div>
                <Slider
                  value={[formData.water_glasses || 6]}
                  onValueChange={([val]) => updateField('water_glasses', val)}
                  min={0}
                  max={15}
                  step={1}
                  className="py-2"
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 8 glasses per day
                </p>
              </CardContent>
            </Card>

            {/* Family Time */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Family & Friends Time</CardTitle>
                    <CardDescription>Minutes spent with loved ones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold">{formData.family_time_minutes} min</span>
                </div>
                <Slider
                  value={[formData.family_time_minutes || 0]}
                  onValueChange={([val]) => updateField('family_time_minutes', val)}
                  min={0}
                  max={300}
                  step={10}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 min</span><span>150 min</span><span>300 min</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Quality */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Social Interaction</CardTitle>
                    <CardDescription>Quality of social interactions today</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality</span>
                  <span className="text-2xl font-bold">{formData.social_quality}/10</span>
                </div>
                <Slider
                  value={[formData.social_quality || 5]}
                  onValueChange={([val]) => updateField('social_quality', val)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Isolated</span><span>Moderate</span><span>Very Social</span>
                </div>
              </CardContent>
            </Card>

            {/* Spiritual Activities */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Spiritual Activities</CardTitle>
                    <CardDescription>Prayer, meditation, or spiritual practice</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold">{formData.spiritual_minutes} min</span>
                </div>
                <Slider
                  value={[formData.spiritual_minutes || 0]}
                  onValueChange={([val]) => updateField('spiritual_minutes', val)}
                  min={0}
                  max={120}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 min</span><span>60 min</span><span>120 min</span>
                </div>
              </CardContent>
            </Card>

            {/* Mental Relaxation */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mental Relaxation</CardTitle>
                    <CardDescription>Time spent on calming activities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold">{formData.mental_relaxation_minutes} min</span>
                </div>
                <Slider
                  value={[formData.mental_relaxation_minutes || 0]}
                  onValueChange={([val]) => updateField('mental_relaxation_minutes', val)}
                  min={0}
                  max={120}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 min</span><span>60 min</span><span>120 min</span>
                </div>
              </CardContent>
            </Card>

            {/* Smoking & Alcohol */}
            <Card className="shadow-card border-border/50 lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Additional Factors</CardTitle>
                <CardDescription>Optional lifestyle factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Cigarette className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Smoking Today</Label>
                        <p className="text-sm text-muted-foreground">Did you smoke?</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.smoking || false}
                      onCheckedChange={(checked) => updateField('smoking', checked)}
                    />
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Wine className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Alcohol Units</Label>
                        <p className="text-sm text-muted-foreground">Units consumed</p>
                      </div>
                    </div>
                    <Input
                      type="number"
                      value={formData.alcohol_units || 0}
                      onChange={(e) => updateField('alcohol_units', parseInt(e.target.value) || 0)}
                      min={0}
                      max={20}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="shadow-card border-border/50 lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Notes</CardTitle>
                <CardDescription>Any additional notes about your day</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="How are you feeling today? Any symptoms or notable events?"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button type="submit" size="lg" className="gradient-health" disabled={isAdding}>
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Today's Log
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Daily Wellness Routine — moved from Dashboard */}
        <WellnessRoutinePlanner />

        {/* Recent Logs */}
        {logs && logs.length > 0 && (
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Entries</CardTitle>
              <CardDescription>Your last 7 days of logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.slice(0, 7).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {format(new Date(log.log_date), 'EEEE, MMMM d')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.sleep_hours}h sleep • {log.exercise_minutes} min exercise • {log.daily_steps?.toLocaleString()} steps
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Stress: {log.stress_level}/10</p>
                      <p className="text-sm text-muted-foreground">Diet: {log.diet_quality}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
