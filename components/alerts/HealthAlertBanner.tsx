import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Mail, CheckCircle2, Loader2, X, FileText, Eye, Download, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useHealthAlert, type AlertStatus } from '@/hooks/useHealthAlert';
import { useLifestyleLogs } from '@/hooks/useLifestyleLogs';
import { useSymptomHistory } from '@/hooks/useSymptomHistory';
import { HealthReportGenerator } from '@/components/health-report/HealthReportGenerator';

function AlertStatusChip({ status, lastSentAt }: { status: AlertStatus; lastSentAt: string | null }) {
  const config = {
    idle: { icon: Mail, label: 'Alert Pending', className: 'bg-muted text-muted-foreground border-border' },
    sending: { icon: Loader2, label: 'Sending Alert...', className: 'bg-warning/15 text-warning border-warning/30' },
    sent: { icon: CheckCircle2, label: 'Alert + Report Sent', className: 'bg-success/15 text-success border-success/30' },
    error: { icon: AlertTriangle, label: 'Send Failed', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  };

  const { icon: Icon, label, className } = config[status];
  const sentTime = lastSentAt ? new Date(lastSentAt).toLocaleString() : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`gap-1.5 px-3 py-1.5 text-xs font-medium border ${className} cursor-help`}>
            <Icon className={`h-3.5 w-3.5 ${status === 'sending' ? 'animate-spin' : ''}`} />
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-xs">
          {status === 'sent' && sentTime && (
            <p>Health alert email with embedded wellness report was sent on {sentTime}. The email includes your health stability score, symptom summary, wellness insights, and recommended actions.</p>
          )}
          {status === 'sending' && <p>Preparing and sending your personalized health alert email with a detailed wellness report...</p>}
          {status === 'error' && <p>Failed to send the alert email. This may be due to email service configuration. Your health data is still safe.</p>}
          {status === 'idle' && <p>Health alert will be sent automatically when your stability drops below 65%.</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ReportPreviewModal({ open, onOpenChange, healthScore, riskLevel }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthScore: number;
  riskLevel: string;
}) {
  const { averages } = useLifestyleLogs();
  const { history } = useSymptomHistory();
  const [acknowledged, setAcknowledged] = useState(false);

  const recentSymptoms = history.slice(0, 3).flatMap(check => check.symptoms);
  const uniqueSymptoms = [...new Set(recentSymptoms)].map(s =>
    s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  );

  const scoreColor = healthScore >= 70 ? 'text-success' : healthScore >= 50 ? 'text-warning' : 'text-destructive';
  const scoreBg = healthScore >= 70 ? 'bg-success/10' : healthScore >= 50 ? 'bg-warning/10' : 'bg-destructive/10';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Health Report Preview
          </DialogTitle>
          <DialogDescription>
            Summary of your current wellness status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Health Score */}
          <Card className={`${scoreBg} border-none`}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">Health Stability Score</p>
                <p className={`text-3xl font-bold ${scoreColor}`}>{Math.round(healthScore)}%</p>
              </div>
              <Badge variant="outline" className={`${scoreColor} border-current px-3 py-1`}>
                {riskLevel}
              </Badge>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-warning" />
              Recent Symptoms
            </h4>
            {uniqueSymptoms.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {uniqueSymptoms.slice(0, 10).map(s => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No recent symptoms recorded.</p>
            )}
          </div>

          {/* Wellness Insights */}
          <div>
            <h4 className="text-sm font-semibold mb-2">📈 Lifestyle Summary</h4>
            <div className="grid grid-cols-2 gap-2">
              {averages && [
                { label: 'Sleep', value: `${averages.sleep.toFixed(1)}h`, good: averages.sleep >= 7 },
                { label: 'Exercise', value: `${averages.exercise.toFixed(0)} min`, good: averages.exercise >= 30 },
                { label: 'Steps', value: `${(averages.steps / 1000).toFixed(1)}K`, good: averages.steps >= 8000 },
                { label: 'Stress', value: `${averages.stress.toFixed(1)}/10`, good: averages.stress <= 5 },
              ].map(item => (
                <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.good ? 'text-success' : 'text-warning'}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              📌 This report is generated for informational and wellness guidance purposes only and should not be considered a medical diagnosis.
            </p>
          </div>

          {/* Acknowledgment */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-border"
            />
            <span className="text-xs text-muted-foreground">
              I've reviewed this report and understand it is for wellness guidance only.
            </span>
          </label>

          {/* Download Button */}
          <div className="flex gap-2">
            <HealthReportGenerator />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function HealthAlertBanner() {
  const { isTriggered, alertStatus, lastSentAt, healthScore, riskLevel, sendHealthAlert, isInCooldown } = useHealthAlert();
  const [showPreview, setShowPreview] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isTriggered || dismissed) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5 p-4 mb-6"
        >
          {/* Pulsing border animation */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-destructive/40 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <motion.div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/15"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Health Stability Alert
                </h3>
                <AlertStatusChip status={alertStatus} lastSentAt={lastSentAt} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your health stability is below the safe range ({Math.round(healthScore)}%).
                {alertStatus === 'sent'
                  ? ' A detailed health report has been sent to your email.'
                  : alertStatus === 'sending'
                  ? ' Sending a detailed health report to your email...'
                  : ' A health report will be sent to your email.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview Report
              </Button>

              {alertStatus === 'error' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={sendHealthAlert}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Retry
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ReportPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        healthScore={healthScore}
        riskLevel={riskLevel}
      />
    </>
  );
}
