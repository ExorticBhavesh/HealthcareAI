import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, X, Activity, Droplets, Footprints, Moon, Apple, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLifestyleLogs } from '@/hooks/useLifestyleLogs';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'reminder' | 'info';
  title: string;
  message: string;
  icon: React.ElementType;
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const { todayLog } = useLifestyleLogs();

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const notifications = useMemo<Notification[]>(() => {
    const items: Notification[] = [];
    const hour = new Date().getHours();

    if (todayLog) {
      items.push({
        id: 'today-log-done',
        type: 'success',
        title: 'Health Log Submitted ✅',
        message: "Today's health log has been successfully submitted. Great job keeping your wellness on track!",
        icon: CheckCircle2,
        read: false,
      });
    } else {
      items.push({
        id: 'today-log-pending',
        type: 'reminder',
        title: 'Daily Health Log Pending',
        message: "Add your today's health log to keep your wellness on track.",
        icon: AlertCircle,
        read: false,
      });
    }

    // Smart Health Alerts (moved from Dashboard)
    if (hour >= 8 && hour < 20) {
      items.push({
        id: 'hydration-alert',
        type: 'info',
        title: 'Stay Hydrated 💧',
        message: 'Time for a glass of water! Staying hydrated boosts energy and focus.',
        icon: Droplets,
        read: true,
      });
    }

    if (hour >= 9 && hour < 18) {
      items.push({
        id: 'activity-alert',
        type: 'info',
        title: 'Movement Break 🏃',
        message: 'Take a 5-minute stretch break to improve circulation.',
        icon: Activity,
        read: true,
      });
    }

    if ((hour >= 12 && hour < 14) || (hour >= 17 && hour < 19)) {
      items.push({
        id: 'walk-alert',
        type: 'info',
        title: 'Take a Short Walk 🚶',
        message: 'A 10-minute walk can boost your mood and creativity.',
        icon: Footprints,
        read: true,
      });
    }

    if (hour >= 20 && hour < 23) {
      items.push({
        id: 'rest-alert',
        type: 'info',
        title: 'Wind Down Time 🌙',
        message: 'Consider reducing screen time and preparing for restful sleep.',
        icon: Moon,
        read: true,
      });
    }

    items.push({
      id: 'mindfulness-alert',
      type: 'info',
      title: 'Breathing Moment ✨',
      message: 'Take 3 deep breaths. Inhale 4s, hold 4s, exhale 6s.',
      icon: Sparkles,
      read: true,
    });

    return items.filter(n => !dismissed.includes(n.id));
  }, [todayLog, dismissed]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeStyles = {
    success: {
      border: 'border-success/30',
      bg: 'bg-success/5',
      iconBg: 'bg-success/15',
      iconColor: 'text-success',
    },
    reminder: {
      border: 'border-warning/30',
      bg: 'bg-warning/5',
      iconBg: 'bg-warning/15',
      iconColor: 'text-warning',
    },
    info: {
      border: 'border-info/30',
      bg: 'bg-info/5',
      iconBg: 'bg-info/15',
      iconColor: 'text-info',
    },
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-primary/10 relative"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 sm:w-96 z-50 rounded-2xl bg-card border border-border/60 shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-muted/30">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification, index) => {
                    const styles = typeStyles[notification.type];
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'relative p-3 rounded-xl border transition-colors',
                          styles.border,
                          styles.bg,
                          !notification.read && 'ring-1 ring-primary/20'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('p-1.5 rounded-lg shrink-0', styles.iconBg)}>
                            <notification.icon className={cn('w-4 h-4', styles.iconColor)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-md shrink-0 opacity-50 hover:opacity-100"
                            onClick={() => setDismissed(prev => [...prev, notification.id])}
                            aria-label="Dismiss notification"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
