import { useMemo } from 'react';
import { useLifestyleLogs } from '@/hooks/useLifestyleLogs';
import { useSymptomHistory } from '@/hooks/useSymptomHistory';
import { useHealthGoals } from '@/hooks/useHealthGoals';
import { HealthInsight } from '@/components/insights/PersonalizedInsightsFeed';
import { PredictiveWarning } from '@/components/insights/PredictiveWarningCard';

export function useHealthInsights() {
  const { logs } = useLifestyleLogs();
  const { history } = useSymptomHistory();
  const { goals } = useHealthGoals();

  const insights = useMemo<HealthInsight[]>(() => {
    const generatedInsights: HealthInsight[] = [];
    
    if (!logs || logs.length === 0) return generatedInsights;

    const recentLogs = logs.slice(0, 7);
    const olderLogs = logs.slice(7, 14);

    // Calculate averages
    const avgSleep = recentLogs.reduce((acc, log) => acc + (log.sleep_hours || 0), 0) / recentLogs.length;
    const avgSteps = recentLogs.reduce((acc, log) => acc + (log.daily_steps || 0), 0) / recentLogs.length;
    const avgStress = recentLogs.reduce((acc, log) => acc + (log.stress_level || 0), 0) / recentLogs.length;
    const avgExercise = recentLogs.reduce((acc, log) => acc + (log.exercise_minutes || 0), 0) / recentLogs.length;
    const avgWater = recentLogs.reduce((acc, log) => acc + (log.water_glasses || 0), 0) / recentLogs.length;

    // Compare with older period if available
    if (olderLogs.length > 0) {
      const oldAvgSleep = olderLogs.reduce((acc, log) => acc + (log.sleep_hours || 0), 0) / olderLogs.length;
      const sleepChange = ((avgSleep - oldAvgSleep) / oldAvgSleep) * 100;

      if (Math.abs(sleepChange) > 10) {
        generatedInsights.push({
          id: 'sleep-change',
          type: sleepChange > 0 ? 'improvement' : 'warning',
          category: 'sleep',
          title: sleepChange > 0 ? 'Sleep Improvement' : 'Sleep Decline',
          message: `Your sleep ${sleepChange > 0 ? 'increased' : 'dropped'} by ${Math.abs(sleepChange).toFixed(0)}% this week compared to last week.`,
          metric: {
            value: Number(avgSleep.toFixed(1)),
            change: Number((avgSleep - oldAvgSleep).toFixed(1)),
            unit: 'hrs'
          },
          priority: Math.abs(sleepChange) > 20 ? 'high' : 'medium',
          timestamp: new Date()
        });
      }

      const oldAvgSteps = olderLogs.reduce((acc, log) => acc + (log.daily_steps || 0), 0) / olderLogs.length;
      const stepsChange = ((avgSteps - oldAvgSteps) / (oldAvgSteps || 1)) * 100;

      if (oldAvgSteps > 0 && Math.abs(stepsChange) > 15) {
        generatedInsights.push({
          id: 'activity-change',
          type: stepsChange > 0 ? 'improvement' : 'warning',
          category: 'activity',
          title: stepsChange > 0 ? 'Activity Boost' : 'Activity Drop',
          message: `Your daily steps ${stepsChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(stepsChange).toFixed(0)}% compared to the previous week.`,
          metric: {
            value: Math.round(avgSteps),
            change: Math.round(avgSteps - oldAvgSteps),
            unit: ' steps'
          },
          priority: Math.abs(stepsChange) > 30 ? 'high' : 'medium',
          timestamp: new Date()
        });
      }
    }

    // Check for concerning patterns
    if (avgSleep < 6) {
      generatedInsights.push({
        id: 'low-sleep',
        type: 'warning',
        category: 'sleep',
        title: 'Insufficient Sleep',
        message: 'Your average sleep is below the recommended 7-9 hours. This may affect your immune system and mental clarity.',
        priority: avgSleep < 5 ? 'high' : 'medium',
        timestamp: new Date()
      });
    }

    if (avgStress > 7) {
      generatedInsights.push({
        id: 'high-stress',
        type: 'warning',
        category: 'stress',
        title: 'Elevated Stress Levels',
        message: 'Your stress levels have been consistently high. Consider relaxation techniques or speaking with a professional.',
        priority: avgStress > 8 ? 'high' : 'medium',
        timestamp: new Date()
      });
    }

    if (avgWater < 6) {
      generatedInsights.push({
        id: 'low-hydration',
        type: 'suggestion',
        category: 'hydration',
        title: 'Increase Hydration',
        message: 'You\'re averaging less than 6 glasses of water daily. Aim for 8+ glasses for optimal health.',
        priority: 'low',
        timestamp: new Date()
      });
    }

    // Positive achievements
    if (avgExercise >= 30) {
      generatedInsights.push({
        id: 'exercise-goal',
        type: 'achievement',
        category: 'activity',
        title: 'Exercise Goal Met',
        message: 'Great job! You\'re averaging 30+ minutes of exercise daily, meeting WHO recommendations.',
        priority: 'low',
        timestamp: new Date()
      });
    }

    // Correlations with symptoms
    if (history.length > 0 && avgStress > 6) {
      const recentSymptoms = history.slice(0, 3);
      const hasStressSymptoms = recentSymptoms.some(check => 
        check.symptoms.some(s => ['headache', 'insomnia', 'anxiety'].includes(s))
      );
      
      if (hasStressSymptoms) {
        generatedInsights.push({
          id: 'stress-symptom-correlation',
          type: 'suggestion',
          category: 'stress',
          title: 'Stress-Symptom Correlation',
          message: 'Your recent symptoms may be linked to elevated stress levels. Consider stress management techniques.',
          priority: 'medium',
          timestamp: new Date()
        });
      }
    }

    return generatedInsights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [logs, history]);

  const predictiveWarnings = useMemo<PredictiveWarning[]>(() => {
    const warnings: PredictiveWarning[] = [];
    
    if (!history || history.length < 3) return warnings;

    // Analyze symptom patterns
    const symptomCounts: Record<string, number> = {};
    history.forEach(check => {
      check.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    // Find recurring symptoms
    Object.entries(symptomCounts)
      .filter(([_, count]) => count >= 2)
      .forEach(([symptom, count]) => {
        const probability = Math.min(85, 40 + count * 10);
        
        if (probability > 50) {
          warnings.push({
            id: `recurring-${symptom}`,
            symptom: symptom.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            riskLevel: probability > 70 ? 'high' : probability > 55 ? 'elevated' : 'moderate',
            probability,
            basedOn: [
              `Occurred ${count} times recently`,
              'Historical pattern detected'
            ],
            preventiveActions: [
              'Monitor triggers and patterns',
              'Consider lifestyle adjustments',
              'Track symptom frequency'
            ],
            timeframe: 'Next 7 days'
          });
        }
      });

    return warnings.slice(0, 3);
  }, [history]);

  const healthScore = useMemo(() => {
    if (!logs || logs.length === 0) return { score: 75, trend: 'stable' as const, factors: [], previousScore: 72 };

    const recentLog = logs[0];
    let score = 50;
    const factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; value: number }[] = [];

    // Sleep (max 15 points)
    const sleepScore = Math.min(15, (recentLog.sleep_hours || 0) / 8 * 15);
    score += sleepScore;
    factors.push({
      name: 'Sleep Quality',
      impact: sleepScore >= 12 ? 'positive' : sleepScore >= 7 ? 'neutral' : 'negative',
      value: Math.round(sleepScore)
    });

    // Exercise (max 12 points)
    const exerciseScore = Math.min(12, (recentLog.exercise_minutes || 0) / 30 * 12);
    score += exerciseScore;
    factors.push({
      name: 'Physical Activity',
      impact: exerciseScore >= 8 ? 'positive' : exerciseScore >= 4 ? 'neutral' : 'negative',
      value: Math.round(exerciseScore)
    });

    // Stress penalty (max -8 points)
    const stressPenalty = Math.min(8, ((recentLog.stress_level || 5) - 5) * 1.6);
    score -= stressPenalty;
    if (stressPenalty > 0) {
      factors.push({
        name: 'Stress Impact',
        impact: 'negative',
        value: -Math.round(stressPenalty)
      });
    }

    // Hydration (max 5 points)
    const hydrationScore = Math.min(5, (recentLog.water_glasses || 0) / 8 * 5);
    score += hydrationScore;

    // Social quality (max 6 points)
    const socialScore = Math.min(6, ((recentLog as any).social_quality || 5) / 10 * 6);
    score += socialScore;
    factors.push({
      name: 'Social Well-being',
      impact: socialScore >= 4 ? 'positive' : socialScore >= 2 ? 'neutral' : 'negative',
      value: Math.round(socialScore)
    });

    // Spiritual activities (max 5 points)
    const spiritualMin = (recentLog as any).spiritual_minutes || 0;
    const spiritualScore = spiritualMin >= 20 ? 5 : spiritualMin >= 10 ? 3 : spiritualMin > 0 ? 1 : 0;
    score += spiritualScore;

    // Family time (max 5 points)
    const familyMin = (recentLog as any).family_time_minutes || 0;
    const familyScore = familyMin >= 60 ? 5 : familyMin >= 30 ? 3 : familyMin > 0 ? 1 : 0;
    score += familyScore;
    if (familyScore > 0 || spiritualScore > 0) {
      factors.push({
        name: 'Holistic Wellness',
        impact: (familyScore + spiritualScore) >= 6 ? 'positive' : 'neutral',
        value: Math.round(familyScore + spiritualScore)
      });
    }

    // Determine trend
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (logs.length >= 2) {
      const prevLog = logs[1];
      const prevSleep = prevLog.sleep_hours || 0;
      const currSleep = recentLog.sleep_hours || 0;
      if (currSleep > prevSleep + 0.5) trend = 'up';
      else if (currSleep < prevSleep - 0.5) trend = 'down';
    }

    return {
      score: Math.round(Math.max(0, Math.min(100, score))),
      previousScore: 72,
      trend,
      factors
    };
  }, [logs]);

  return {
    insights,
    predictiveWarnings,
    healthScore,
    isLoading: false
  };
}
