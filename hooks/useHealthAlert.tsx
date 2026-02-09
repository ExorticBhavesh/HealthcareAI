import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useLifestyleLogs } from '@/hooks/useLifestyleLogs';
import { useSymptomHistory } from '@/hooks/useSymptomHistory';
import { useHealthInsights } from '@/hooks/useHealthInsights';

export type AlertStatus = 'idle' | 'sending' | 'sent' | 'error';

interface HealthAlertState {
  isTriggered: boolean;
  alertStatus: AlertStatus;
  lastSentAt: string | null;
  healthScore: number;
  riskLevel: string;
}

const ALERT_THRESHOLD = 65;
const ALERT_COOLDOWN_HOURS = 24;
const STORAGE_KEY = 'wellness_health_alert_last_sent';

export function useHealthAlert() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { logs, averages } = useLifestyleLogs();
  const { history } = useSymptomHistory();
  const { healthScore: aiHealthScore } = useHealthInsights();
  const [alertStatus, setAlertStatus] = useState<AlertStatus>('idle');
  const [lastSentAt, setLastSentAt] = useState<string | null>(null);
  const hasSentRef = useRef(false);

  // Calculate health stability score (mirrors Dashboard logic without modifying it)
  const calculateHealthStability = useCallback(() => {
    if (!averages) return 65;
    let score = 50;
    if (averages.sleep >= 7 && averages.sleep <= 9) score += 15;
    else if (averages.sleep >= 6) score += 10;
    else score += 5;
    if (averages.exercise >= 30) score += 15;
    else if (averages.exercise >= 15) score += 10;
    else score += 3;
    if (averages.steps >= 10000) score += 10;
    else if (averages.steps >= 5000) score += 6;
    else score += 2;
    score += (averages.diet / 10) * 10;
    score += ((10 - averages.stress) / 10) * 10;
    return Math.min(100, Math.max(0, score));
  }, [averages]);

  const healthStabilityScore = calculateHealthStability();

  const getRiskLevel = (score: number): string => {
    if (score >= 70) return 'Low';
    if (score >= 50) return 'Moderate';
    return 'Attention Needed';
  };

  const riskLevel = getRiskLevel(healthStabilityScore);
  const isTriggered = healthStabilityScore < ALERT_THRESHOLD;

  // Check cooldown
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLastSentAt(stored);
    }
  }, []);

  const isInCooldown = useCallback(() => {
    if (!lastSentAt) return false;
    const lastSent = new Date(lastSentAt).getTime();
    const now = Date.now();
    return (now - lastSent) < ALERT_COOLDOWN_HOURS * 60 * 60 * 1000;
  }, [lastSentAt]);

  // Build categorized symptoms from recent history
  const getCategorizedSymptoms = useCallback(() => {
    if (!history || history.length === 0) return [];

    const categoryMap: Record<string, string[]> = {};
    const recentChecks = history.slice(0, 5);

    const symptomCategories: Record<string, string> = {
      fever: 'General', fatigue: 'General', weakness: 'General', body_pain: 'General',
      chills: 'General', dizziness: 'General', loss_of_appetite: 'General',
      chest_pain: 'Cardiovascular', irregular_heartbeat: 'Cardiovascular',
      shortness_of_breath: 'Cardiovascular',
      cough: 'Respiratory', cold: 'Respiratory', sore_throat: 'Respiratory',
      breathlessness: 'Respiratory', wheezing: 'Respiratory',
      headache: 'Neurological', migraine: 'Neurological', anxiety: 'Neurological',
      stress: 'Neurological', poor_concentration: 'Neurological',
      sleep_disturbance: 'Neurological',
      stomach_pain: 'Digestive', acidity: 'Digestive', bloating: 'Digestive',
      nausea: 'Digestive', diarrhea: 'Digestive', constipation: 'Digestive',
      joint_pain: 'Musculoskeletal', muscle_cramps: 'Musculoskeletal',
      back_pain: 'Musculoskeletal', neck_pain: 'Musculoskeletal',
      insomnia: 'Sleep', poor_sleep: 'Sleep',
      dehydration: 'Metabolic', low_energy: 'Metabolic',
    };

    recentChecks.forEach(check => {
      check.symptoms.forEach(symptom => {
        const category = symptomCategories[symptom] || 'Other';
        if (!categoryMap[category]) categoryMap[category] = [];
        const formatted = symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (!categoryMap[category].includes(formatted)) {
          categoryMap[category].push(formatted);
        }
      });
    });

    return Object.entries(categoryMap).map(([category, items]) => ({
      category,
      items,
    }));
  }, [history]);

  // Build wellness insights
  const getWellnessInsights = useCallback(() => {
    if (!averages) return [];
    return [
      {
        label: 'Sleep Quality',
        value: `${averages.sleep.toFixed(1)} hrs/night`,
        trend: averages.sleep >= 7 ? 'up' : 'down',
      },
      {
        label: 'Physical Activity',
        value: `${averages.exercise.toFixed(0)} min/day`,
        trend: averages.exercise >= 30 ? 'up' : 'down',
      },
      {
        label: 'Daily Steps',
        value: averages.steps.toLocaleString(),
        trend: averages.steps >= 8000 ? 'up' : 'down',
      },
      {
        label: 'Stress Level',
        value: `${averages.stress.toFixed(1)}/10`,
        trend: averages.stress <= 5 ? 'up' : 'down',
      },
      {
        label: 'Diet Quality',
        value: `${averages.diet.toFixed(1)}/10`,
        trend: averages.diet >= 7 ? 'up' : 'down',
      },
    ];
  }, [averages]);

  // Build recommendations
  const getRecommendations = useCallback(() => {
    const recs: string[] = [];
    if (!averages) return ['Maintain a balanced lifestyle and log your daily habits.'];

    if (averages.sleep < 7) recs.push('Prioritize 7-9 hours of quality sleep each night. Establish a consistent bedtime routine.');
    if (averages.exercise < 30) recs.push('Aim for at least 30 minutes of moderate physical activity daily, such as brisk walking.');
    if (averages.stress > 5) recs.push('Practice stress management techniques: deep breathing, meditation, or gentle yoga.');
    if (averages.diet < 7) recs.push('Focus on whole foods, fruits, vegetables, and lean proteins to improve diet quality.');
    if (averages.steps < 8000) recs.push('Try to increase daily steps gradually. Walking breaks throughout the day can help.');
    recs.push('Stay hydrated — aim for 8+ glasses of water daily.');
    recs.push('Schedule regular check-ins with a healthcare professional.');

    return recs;
  }, [averages]);

  // Send alert email
  const sendHealthAlert = useCallback(async () => {
    if (!user?.email || !isTriggered || isInCooldown() || alertStatus === 'sending') return;

    setAlertStatus('sending');

    try {
      const { data, error } = await supabase.functions.invoke('send-health-alert', {
        body: {
          userName: profile?.full_name || user.email.split('@')[0],
          email: user.email,
          healthScore: healthStabilityScore,
          riskLevel,
          symptoms: getCategorizedSymptoms(),
          wellnessInsights: getWellnessInsights(),
          recommendations: getRecommendations(),
          reportDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      });

      if (error) throw error;

      const now = new Date().toISOString();
      setAlertStatus('sent');
      setLastSentAt(now);
      localStorage.setItem(STORAGE_KEY, now);
    } catch (err) {
      console.error('Failed to send health alert:', err);
      setAlertStatus('error');
    }
  }, [
    user,
    isTriggered,
    isInCooldown,
    alertStatus,
    profile,
    healthStabilityScore,
    riskLevel,
    getCategorizedSymptoms,
    getWellnessInsights,
    getRecommendations,
  ]);

  // Auto-trigger alert when health stability drops below threshold
  useEffect(() => {
    if (isTriggered && !isInCooldown() && alertStatus === 'idle' && user?.email && !hasSentRef.current) {
      hasSentRef.current = true;
      sendHealthAlert();
    }
  }, [isTriggered, isInCooldown, alertStatus, user, sendHealthAlert]);

  // Reset ref when cooldown expires or score improves
  useEffect(() => {
    if (!isTriggered || !isInCooldown()) {
      hasSentRef.current = false;
    }
  }, [isTriggered, isInCooldown]);

  return {
    isTriggered,
    alertStatus,
    lastSentAt,
    healthScore: healthStabilityScore,
    riskLevel,
    sendHealthAlert,
    isInCooldown: isInCooldown(),
  };
}
