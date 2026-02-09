import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PredictiveWarning {
  id: string;
  symptom: string;
  riskLevel: 'moderate' | 'elevated' | 'high';
  probability: number;
  basedOn: string[];
  preventiveActions: string[];
  timeframe: string;
}

interface PredictiveWarningCardProps {
  warnings: PredictiveWarning[];
  onDismiss?: (id: string) => void;
  onTakeAction?: (warning: PredictiveWarning) => void;
}

const riskConfig = {
  moderate: {
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
    label: 'Moderate Risk',
  },
  elevated: {
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    label: 'Elevated Risk',
  },
  high: {
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    label: 'High Risk',
  },
};

function WarningItem({ warning, index, onTakeAction }: { 
  warning: PredictiveWarning; 
  index: number;
  onTakeAction?: (warning: PredictiveWarning) => void;
}) {
  const config = riskConfig[warning.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className={cn(
        'relative p-5 rounded-2xl border-2 bg-card overflow-hidden',
        config.borderColor
      )}
    >
      {/* Background pulse for high risk */}
      {warning.riskLevel === 'high' && (
        <motion.div
          className="absolute inset-0 bg-destructive/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn('p-2 rounded-xl', config.bgColor)}
              animate={warning.riskLevel === 'high' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className={cn('w-5 h-5', config.color)} />
            </motion.div>
            <div>
              <h4 className="font-semibold">{warning.symptom}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  config.bgColor,
                  config.color
                )}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {warning.timeframe}
                </span>
              </div>
            </div>
          </div>

          {/* Probability meter */}
          <div className="text-right">
            <span className={cn('text-2xl font-bold', config.color)}>
              {warning.probability}%
            </span>
            <p className="text-xs text-muted-foreground">probability</p>
          </div>
        </div>

        {/* Based on */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Based on historical patterns:
          </p>
          <div className="flex flex-wrap gap-2">
            {warning.basedOn.map((factor, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        {/* Preventive actions */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Preventive actions:
          </p>
          <ul className="space-y-1">
            {warning.preventiveActions.slice(0, 2).map((action, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {action}
              </li>
            ))}
          </ul>
        </div>

        {/* Action button */}
        <Button
          variant="outline"
          size="sm"
          className={cn('w-full', config.borderColor)}
          onClick={() => onTakeAction?.(warning)}
        >
          Take Preventive Action
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

export function PredictiveWarningCard({ warnings, onTakeAction }: PredictiveWarningCardProps) {
  if (warnings.length === 0) {
    return (
      <Card className="border-success/20">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-12 h-12 text-success/30 mb-4" />
          </motion.div>
          <p className="text-muted-foreground">No health warnings detected</p>
          <p className="text-sm text-muted-foreground/70">
            Your health patterns look stable
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-warning/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <AlertTriangle className="w-5 h-5 text-warning" />
          </motion.div>
          Predictive Health Warnings
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {warnings.length} potential {warnings.length === 1 ? 'issue' : 'issues'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {warnings.map((warning, index) => (
          <WarningItem 
            key={warning.id} 
            warning={warning} 
            index={index}
            onTakeAction={onTakeAction}
          />
        ))}
      </CardContent>
    </Card>
  );
}
