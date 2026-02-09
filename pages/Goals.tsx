import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useHealthGoals, HealthGoal } from '@/hooks/useHealthGoals';
import { FitnessActivities } from '@/components/fitness/FitnessActivities';
import { Target, Trophy, TrendingUp, CheckCircle2, Calendar, Dumbbell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Goals() {
  const { goals, activeGoals, completedGoals, isLoading, getProgress, updateGoal, deleteGoal } = useHealthGoals();
  const [selectedTab, setSelectedTab] = useState('fitness');

  // Calculate stats
  const goalsCompleted = completedGoals.length;
  const currentStreak = 7;

  const getIncrement = (goalType: string): number => {
    switch (goalType) {
      case 'steps': return 1000;
      case 'sleep': return 0.5;
      case 'water': return 1;
      case 'exercise': return 5;
      case 'weight': return 0.1;
      default: return 1;
    }
  };

  const handleUpdateProgress = (goal: HealthGoal, increment: number) => {
    const newValue = Math.max(0, goal.current_value + increment);
    updateGoal({
      id: goal.id,
      current_value: newValue,
      is_active: newValue < goal.target_value,
    });
  };

  const allGoals = [...activeGoals, ...completedGoals];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              <span className="gradient-text">Fitness</span> 🏋️
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your wellness activities and stay active
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-3xl font-bold">{activeGoals.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">{goalsCompleted}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold">{currentStreak} days</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs — only Activities and Goals merged */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="fitness" className="gap-2">
              <Dumbbell className="h-4 w-4" />
              Activities & Timer
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Target className="h-4 w-4" />
              Goals ({allGoals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fitness" className="space-y-6">
            <Card className="health-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  Fitness Activities & Timer
                </CardTitle>
                <CardDescription>
                  Select an activity, set your duration, and start your session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FitnessActivities />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Active Goals
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeGoals.map((goal) => {
                    const progress = getProgress(goal);
                    return (
                      <Card key={goal.id} className="health-card">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{goal.goal_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()} {goal.unit}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteGoal(goal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Progress value={progress} className="h-2 mb-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateProgress(goal, -getIncrement(goal.goal_type))}
                                disabled={goal.current_value <= 0}
                              >−</Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => handleUpdateProgress(goal, getIncrement(goal.goal_type))}
                              >+</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Completed Goals
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completedGoals.map((goal) => (
                    <Card key={goal.id} className="health-card bg-success/5 border-success/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <h4 className="font-medium">{goal.goal_name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Target: {goal.target_value.toLocaleString()} {goal.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completed {new Date(goal.updated_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {allGoals.length === 0 && (
              <Card className="health-card">
                <CardContent className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="font-semibold text-lg mb-2">No goals yet</h3>
                  <p className="text-muted-foreground">
                    Use the Activities tab to start tracking your fitness!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
