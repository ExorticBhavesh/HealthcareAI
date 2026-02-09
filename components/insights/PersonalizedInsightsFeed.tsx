import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertTriangle, Lightbulb, Heart, Moon, Footprints, Droplets, Activity, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface HealthInsight {
  id: string;
  type: 'warning' | 'improvement' | 'suggestion' | 'achievement';
  category: 'sleep' | 'stress' | 'activity' | 'hydration' | 'nutrition' | 'general';
  title: string;
  message: string;
  metric?: {
    value: number;
    change: number;
    unit: string;
  };
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
}

const categoryIcons = {
  sleep: Moon,
  stress: Brain,
  activity: Footprints,
  hydration: Droplets,
  nutrition: Heart,
  general: Activity,
};

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
  },
  improvement: {
    icon: TrendingUp,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
  },
  suggestion: {
    icon: Lightbulb,
    color: 'text-info',
    bgColor: 'bg-info/10',
    borderColor: 'border-info/30',
  },
  achievement: {
    icon: Heart,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
};

interface InsightCardProps {
  insight: HealthInsight;
  index: number;
}

function InsightCard({ insight, index }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const CategoryIcon = categoryIcons[insight.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative p-4 rounded-xl border-l-4 bg-card transition-all duration-300 hover:shadow-md',
        config.borderColor
      )}
    >
      {/* Priority indicator */}
      {insight.priority === 'high' && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('p-2 rounded-lg shrink-0', config.bgColor)}>
          <config.icon className={cn('w-4 h-4', config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <CategoryIcon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground capitalize">
              {insight.category}
            </span>
            <Badge 
              variant="outline" 
              className={cn(
                'text-[10px] px-1.5 py-0',
                insight.priority === 'high' ? 'border-destructive/30 text-destructive' :
                insight.priority === 'medium' ? 'border-warning/30 text-warning' :
                'border-muted text-muted-foreground'
              )}
            >
              {insight.priority}
            </Badge>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>

          {/* Message */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.message}
          </p>

          {/* Metric */}
          {insight.metric && (
            <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-muted/50">
              <span className="text-lg font-bold">
                {insight.metric.value}{insight.metric.unit}
              </span>
              <span className={cn(
                'flex items-center gap-1 text-sm font-medium',
                insight.metric.change > 0 ? 'text-success' : 
                insight.metric.change < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {insight.metric.change > 0 ? <TrendingUp className="w-3 h-3" /> : 
                 insight.metric.change < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                {insight.metric.change > 0 ? '+' : ''}{insight.metric.change}{insight.metric.unit}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface PersonalizedInsightsFeedProps {
  insights: HealthInsight[];
  isLoading?: boolean;
}

export function PersonalizedInsightsFeed({ insights, isLoading }: PersonalizedInsightsFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Personalized Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-xl shimmer" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lightbulb className="w-5 h-5 text-primary" />
          </motion.div>
          Personalized Health Insights
          {insights.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {insights.length} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No insights yet</p>
            <p className="text-sm text-muted-foreground/70">
              Keep logging your lifestyle data to receive personalized insights
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {insights.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
