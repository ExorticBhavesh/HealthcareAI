import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Heart,
  Activity,
  Stethoscope,
  Shield,
  ChevronRight,
  Sparkles,
  X,
  Download,
  TrendingUp,
  Droplets,
  Moon,
  Dumbbell,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HealthReportGenerator } from '@/components/health-report/HealthReportGenerator';
import { VoiceControls } from '@/components/symptoms/VoiceControls';
import { useRiskVoiceFeedback } from '@/hooks/useRiskVoiceFeedback';

import healthRiskLow from '@/assets/health-risk-low.jpg';
import healthRiskMedium from '@/assets/health-risk-medium.jpg';
import healthRiskHigh from '@/assets/health-risk-high.jpg';

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore?: number;
  analysis: string;
  recommendations: string[];
  possibleCauses?: { cause: string; confidence: 'Low' | 'Medium' | 'High' }[];
  immediateActions?: string[];
  lifestyleChanges?: string[];
  monitoringAdvice?: string[];
  doctorTriggers?: string[];
}

interface SymptomAnalysisModalProps {
  result: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
  selectedSymptoms: string[];
}

const riskImages: Record<string, string> = {
  low: healthRiskLow,
  medium: healthRiskMedium,
  high: healthRiskHigh,
};

const riskConfig = {
  low: {
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    ringColor: 'stroke-success',
    gradient: 'from-success/20 via-success/10 to-transparent',
    headerGradient: 'from-emerald-500 to-teal-500',
    icon: CheckCircle2,
    label: 'Mild / Low Risk',
    subtitle: 'Your symptoms suggest a manageable wellness concern',
    meterValue: 33,
  },
  medium: {
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    ringColor: 'stroke-warning',
    gradient: 'from-warning/20 via-warning/10 to-transparent',
    headerGradient: 'from-amber-500 to-orange-500',
    icon: AlertCircle,
    label: 'Moderate / Attention Recommended',
    subtitle: 'Consider lifestyle adjustments and monitoring',
    meterValue: 66,
  },
  high: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    ringColor: 'stroke-destructive',
    gradient: 'from-destructive/20 via-destructive/10 to-transparent',
    headerGradient: 'from-red-500 to-rose-500',
    icon: AlertTriangle,
    label: 'Attention Needed',
    subtitle: 'Professional consultation is strongly recommended',
    meterValue: 100,
  },
};

function AnimatedRing({ level, value }: { level: 'low' | 'medium' | 'high'; value: number }) {
  const circumference = 2 * Math.PI * 44;
  const config = riskConfig[level];

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" opacity="0.3" />
        <motion.circle
          cx="50" cy="50" r="44" fill="none"
          stroke="currentColor"
          strokeWidth="6" strokeLinecap="round"
          className={config.color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        >
          <config.icon className={cn('w-7 h-7', config.color)} />
        </motion.div>
        <motion.span
          className={cn('text-xs font-bold mt-0.5', config.color)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {value}%
        </motion.span>
      </div>
      <motion.div
        className={cn('absolute inset-0 rounded-full blur-xl opacity-20', config.bgColor)}
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  delay = 0,
  variant = 'default',
  iconColor,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
  variant?: 'default' | 'warning' | 'danger';
  iconColor?: string;
}) {
  const bgMap = {
    default: 'bg-card border-border/40',
    warning: 'bg-warning/5 border-warning/20',
    danger: 'bg-destructive/5 border-destructive/20',
  };
  const iconBgMap = {
    default: 'bg-primary/10',
    warning: 'bg-warning/10',
    danger: 'bg-destructive/10',
  };
  const iconColorMap = {
    default: 'text-primary',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={cn('rounded-2xl border p-5 shadow-sm', bgMap[variant])}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('p-2.5 rounded-xl', iconBgMap[variant])}>
          <Icon className={cn('w-5 h-5', iconColor || iconColorMap[variant])} />
        </div>
        <h4 className="font-bold text-base tracking-tight text-foreground">{title}</h4>
      </div>
      {children}
    </motion.div>
  );
}

function ActionItem({ text, icon: Icon, delay, color }: { text: string; icon: React.ElementType; delay: number; color: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-3 py-2"
    >
      <div className={cn('mt-0.5 p-1 rounded-lg shrink-0', `bg-${color}/10`)}>
        <Icon className={cn('w-3.5 h-3.5', `text-${color}`)} />
      </div>
      <span className="text-sm leading-relaxed text-foreground/80 font-medium">{text}</span>
    </motion.li>
  );
}

export function SymptomAnalysisModal({ result, isOpen, onClose, selectedSymptoms }: SymptomAnalysisModalProps) {
  const voice = useRiskVoiceFeedback();

  // Auto-speak risk level when modal opens with a new result
  useEffect(() => {
    if (isOpen && result) {
      const analysisId = `${result.riskLevel}-${selectedSymptoms.join('-')}-${Date.now()}`;
      voice.autoSpeak(result.riskLevel, analysisId);
    }
    // Stop speaking when modal closes
    if (!isOpen) {
      voice.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, result?.riskLevel]);

  if (!result) return null;

  const config = riskConfig[result.riskLevel];
  const riskImage = riskImages[result.riskLevel];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-2xl gap-0 rounded-3xl max-h-[92vh]">
        <ScrollArea className="max-h-[92vh]">
          {/* Hero Header with Image */}
          <div className="relative overflow-hidden">
            <div className={cn('absolute inset-0 bg-gradient-to-br', config.headerGradient, 'opacity-90')} />
            <img
              src={riskImage}
              alt="Health assessment illustration"
              className="w-full h-48 object-cover opacity-30"
            />

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Header Content */}
            <div className="absolute inset-0 flex items-center p-6">
              <div className="flex items-center gap-5">
                <AnimatedRing level={result.riskLevel} value={config.meterValue} />
                <div className="text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="mb-2 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs font-semibold px-3 py-1">
                      <config.icon className="w-3.5 h-3.5 mr-1.5" />
                      {config.label}
                    </Badge>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-extrabold tracking-tight drop-shadow-lg"
                  >
                    Health Assessment Complete
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-white/85 mt-1 font-medium"
                  >
                    {config.subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5">
            {/* AI Analysis Summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                'relative overflow-hidden rounded-2xl border-2 p-5',
                config.borderColor,
                config.bgColor
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-xl shrink-0', config.bgColor)}>
                  <Sparkles className={cn('w-5 h-5', config.color)} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1.5 text-foreground">AI Wellness Assessment</h4>
                  <p className="text-sm leading-relaxed text-foreground/75 font-medium">
                    {result.analysis}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Selected Symptoms */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl border border-border/40 bg-muted/30 p-5"
            >
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-foreground">
                <Stethoscope className="w-4 h-4 text-primary" />
                Analyzed Symptoms
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom, i) => (
                  <motion.div
                    key={symptom}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                  >
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold py-1 px-3 bg-primary/10 text-primary border border-primary/20 rounded-full"
                    >
                      {symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* What This May Indicate */}
            {result.possibleCauses && result.possibleCauses.length > 0 && (
              <SectionCard title="What This May Indicate" icon={Activity} delay={0.4}>
                <div className="space-y-2">
                  {result.possibleCauses.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.08 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ChevronRight className="w-4 h-4 text-primary/60" />
                        <span className="text-sm font-medium text-foreground/80">{item.cause}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                          item.confidence === 'High'
                            ? 'bg-success/10 text-success border-success/30'
                            : item.confidence === 'Medium'
                            ? 'bg-warning/10 text-warning border-warning/30'
                            : 'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        {item.confidence}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* What You Can Do Now */}
            <SectionCard title="What You Can Do Now" icon={Heart} delay={0.5} iconColor="text-rose-500">
              <div className="space-y-4">
                {result.immediateActions && result.immediateActions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Immediate Actions
                    </p>
                    <ul className="space-y-0.5">
                      {result.immediateActions.map((action, i) => (
                        <ActionItem key={i} text={action} icon={CheckCircle2} delay={0.55 + i * 0.05} color="primary" />
                      ))}
                    </ul>
                  </div>
                )}

                {result.lifestyleChanges && result.lifestyleChanges.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Lifestyle Adjustments
                    </p>
                    <ul className="space-y-0.5">
                      {result.lifestyleChanges.map((change, i) => (
                        <ActionItem key={i} text={change} icon={Dumbbell} delay={0.6 + i * 0.05} color="accent" />
                      ))}
                    </ul>
                  </div>
                )}

                {result.monitoringAdvice && result.monitoringAdvice.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      <Brain className="w-3 h-3" /> Monitoring Tips
                    </p>
                    <ul className="space-y-0.5">
                      {result.monitoringAdvice.map((advice, i) => (
                        <ActionItem key={i} text={advice} icon={Activity} delay={0.65 + i * 0.05} color="info" />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* When to Seek Medical Help */}
            {result.doctorTriggers && result.doctorTriggers.length > 0 && (
              <SectionCard
                title="When to Seek Medical Help"
                icon={Stethoscope}
                delay={0.6}
                variant={result.riskLevel === 'high' ? 'danger' : 'warning'}
              >
                <ul className="space-y-2">
                  {result.doctorTriggers.map((trigger, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + i * 0.06 }}
                      className="flex items-start gap-3 py-1.5"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        <AlertTriangle className={cn(
                          'w-4 h-4 shrink-0 mt-0.5',
                          result.riskLevel === 'high' ? 'text-destructive' : 'text-warning'
                        )} />
                      </motion.div>
                      <span className="text-sm font-medium leading-relaxed text-foreground/80">{trigger}</span>
                    </motion.li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {/* Medical Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-muted/40 border border-border/40"
            >
              <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                <strong className="text-foreground/70">Medical Disclaimer:</strong> This tool provides wellness guidance only and is not a medical diagnosis.
                Always consult with a qualified healthcare professional for proper medical advice, diagnosis, and treatment.
                If you are experiencing a medical emergency, please call emergency services immediately.
              </p>
            </motion.div>

            {/* Voice Controls */}
            <VoiceControls
              voiceEnabled={voice.voiceEnabled}
              isSpeaking={voice.isSpeaking}
              isPaused={voice.isPaused}
              isSupported={voice.isSupported}
              onPlay={() => voice.play(result.riskLevel)}
              onPause={voice.pause}
              onStop={voice.stop}
              onToggleVoice={voice.toggleVoice}
            />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-3 pt-2 pb-1"
            >
              <HealthReportGenerator />
              <Button
                variant="default"
                onClick={onClose}
                className="flex-1 gradient-health text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Close Assessment
              </Button>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
