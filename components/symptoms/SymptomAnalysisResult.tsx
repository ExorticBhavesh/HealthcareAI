import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, AlertCircle, Heart, Activity, Stethoscope, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  analysis: string;
  recommendations: string[];
  possibleCauses?: { cause: string; confidence: 'Low' | 'Medium' | 'High' }[];
  immediateActions?: string[];
  lifestyleChanges?: string[];
  monitoringAdvice?: string[];
  doctorTriggers?: string[];
}

interface SymptomAnalysisResultProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const riskConfig = {
  low: {
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    gradient: 'from-success/20 to-success/5',
    icon: CheckCircle2,
    label: 'Mild / Monitor',
    meterValue: 33,
  },
  medium: {
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    gradient: 'from-warning/20 to-warning/5',
    icon: AlertCircle,
    label: 'Moderate / Lifestyle Change Recommended',
    meterValue: 66,
  },
  high: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    gradient: 'from-destructive/20 to-destructive/5',
    icon: AlertTriangle,
    label: 'High Risk / Seek Professional Care',
    meterValue: 100,
  },
};

function LoadingShimmer() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-muted shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-muted rounded w-3/4 shimmer" />
          <div className="h-4 bg-muted rounded w-1/2 shimmer" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted rounded-xl shimmer" />
        ))}
      </div>
    </div>
  );
}

function SeverityMeter({ level, value }: { level: 'low' | 'medium' | 'high'; value: number }) {
  const config = riskConfig[level];
  
  return (
    <div className="relative w-32 h-32">
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={config.color}
          strokeDasharray={`${2 * Math.PI * 40}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - value / 100) }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <config.icon className={cn('w-8 h-8', config.color)} />
        </motion.div>
        <motion.span
          className={cn('text-xs font-semibold mt-1', config.color)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {value}%
        </motion.span>
      </div>
      
      {/* Glow effect */}
      <motion.div
        className={cn('absolute inset-0 rounded-full blur-xl opacity-30', config.bgColor)}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function ResultSection({ 
  title, 
  icon: Icon, 
  children, 
  delay = 0,
  variant = 'default'
}: { 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  delay?: number;
  variant?: 'default' | 'warning' | 'danger';
}) {
  const variants = {
    default: 'border-border/50 bg-card',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        'rounded-2xl border p-5 backdrop-blur-sm',
        variants[variant]
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          'p-2 rounded-lg',
          variant === 'danger' ? 'bg-destructive/10' : 
          variant === 'warning' ? 'bg-warning/10' : 'bg-primary/10'
        )}>
          <Icon className={cn(
            'w-4 h-4',
            variant === 'danger' ? 'text-destructive' :
            variant === 'warning' ? 'text-warning' : 'text-primary'
          )} />
        </div>
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      {children}
    </motion.div>
  );
}

export function SymptomAnalysisResult({ result, isAnalyzing }: SymptomAnalysisResultProps) {
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-3xl p-6 border border-primary/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="text-lg font-semibold">Analyzing symptoms...</span>
        </div>
        <LoadingShimmer />
      </motion.div>
    );
  }

  if (!result) return null;

  const config = riskConfig[result.riskLevel];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Main Risk Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'relative overflow-hidden rounded-3xl border-2 p-6',
            config.borderColor,
            'bg-gradient-to-br',
            config.gradient
          )}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '20px 20px',
              }}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          <div className="relative flex items-center gap-6">
            <SeverityMeter level={result.riskLevel} value={config.meterValue} />
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-2',
                  config.bgColor,
                  config.color
                )}
              >
                <config.icon className="w-4 h-4" />
                {config.label}
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold mb-2"
              >
                Risk Assessment Complete
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {result.analysis}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Possible Causes */}
        {result.possibleCauses && result.possibleCauses.length > 0 && (
          <ResultSection title="Possible Causes" icon={Activity} delay={0.2}>
            <div className="space-y-2">
              {result.possibleCauses.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{item.cause}</span>
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2 py-1 rounded-full',
                    item.confidence === 'High' ? 'bg-success/10 text-success' :
                    item.confidence === 'Medium' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {item.confidence}
                  </span>
                </motion.div>
              ))}
            </div>
          </ResultSection>
        )}

        {/* What You Should Do Now */}
        <ResultSection title="What You Should Do Now" icon={Heart} delay={0.3}>
          <div className="space-y-4">
            {result.immediateActions && result.immediateActions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Immediate Actions
                </p>
                <ul className="space-y-1.5">
                  {result.immediateActions.map((action, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {action}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {result.lifestyleChanges && result.lifestyleChanges.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Lifestyle Changes
                </p>
                <ul className="space-y-1.5">
                  {result.lifestyleChanges.map((change, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      {change}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {result.monitoringAdvice && result.monitoringAdvice.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Monitoring Advice
                </p>
                <ul className="space-y-1.5">
                  {result.monitoringAdvice.map((advice, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-info mt-2 shrink-0" />
                      {advice}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ResultSection>

        {/* When to See a Doctor */}
        {result.doctorTriggers && result.doctorTriggers.length > 0 && (
          <ResultSection 
            title="When to See a Doctor" 
            icon={Stethoscope} 
            delay={0.4}
            variant={result.riskLevel === 'high' ? 'danger' : 'warning'}
          >
            <ul className="space-y-2">
              {result.doctorTriggers.map((trigger, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  {trigger}
                </motion.li>
              ))}
            </ul>
          </ResultSection>
        )}

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
        >
          <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Medical Disclaimer:</strong> This is not a medical diagnosis and is for informational purposes only. 
            Always consult with a qualified healthcare professional for proper medical advice, diagnosis, and treatment. 
            If you are experiencing a medical emergency, please call emergency services immediately.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
