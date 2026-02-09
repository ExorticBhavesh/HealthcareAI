import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HealthScoreCardProps {
  score: number;
  previousScore?: number;
  trend?: 'up' | 'down' | 'stable';
  factors?: { name: string; impact: 'positive' | 'negative' | 'neutral'; value: number }[];
}

export function HealthScoreCard({ score, previousScore, trend = 'stable', factors = [] }: HealthScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreGradient = (value: number) => {
    if (value >= 80) return 'from-success/20 to-success/5';
    if (value >= 60) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference * (1 - score / 100);

  return (
    <Card className="relative overflow-hidden border-primary/20">
      {/* Animated background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        getScoreGradient(score)
      )} />
      
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, hsl(var(--primary) / 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          Health Improvement Score
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center gap-6">
          {/* Score Ring */}
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              {/* Background track */}
              <circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              {/* Score arc */}
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={getScoreColor(score)}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={cn('text-4xl font-bold', getScoreColor(score))}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                {score}
              </motion.span>
              <span className="text-xs text-muted-foreground">out of 100</span>
            </div>

            {/* Glow effect */}
            <motion.div
              className={cn(
                'absolute inset-4 rounded-full blur-xl',
                score >= 80 ? 'bg-success/30' : score >= 60 ? 'bg-warning/30' : 'bg-destructive/30'
              )}
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Score Details */}
          <div className="flex-1 space-y-3">
            {/* Trend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <TrendIcon className={cn('w-5 h-5', trendColor)} />
              <span className="text-sm">
                {trend === 'up' && 'Improving'}
                {trend === 'down' && 'Declining'}
                {trend === 'stable' && 'Stable'}
              </span>
              {previousScore !== undefined && (
                <span className={cn('text-sm font-medium', trendColor)}>
                  ({trend === 'up' ? '+' : ''}{score - previousScore} pts)
                </span>
              )}
            </motion.div>

            {/* Factors */}
            {factors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Contributing Factors
                </p>
                {factors.slice(0, 3).map((factor, i) => (
                  <motion.div
                    key={factor.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Zap className={cn(
                      'w-3 h-3',
                      factor.impact === 'positive' ? 'text-success' :
                      factor.impact === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                    )} />
                    <span className="flex-1">{factor.name}</span>
                    <span className={cn(
                      'text-xs font-medium',
                      factor.impact === 'positive' ? 'text-success' :
                      factor.impact === 'negative' ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {factor.impact === 'positive' ? '+' : factor.impact === 'negative' ? '-' : ''}{factor.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
