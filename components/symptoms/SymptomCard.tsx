import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SYMPTOM_CATEGORIES } from '@/lib/constants';

interface SymptomCardProps {
  id: string;
  label: string;
  category: string;
  isSelected: boolean;
  onToggle: () => void;
}

export function SymptomCard({ id, label, category, isSelected, onToggle }: SymptomCardProps) {
  const categoryInfo = SYMPTOM_CATEGORIES[category as keyof typeof SYMPTOM_CATEGORIES];
  
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={cn(
        'relative group w-full text-left p-4 rounded-xl border-2 transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-0.5',
        isSelected 
          ? 'border-primary bg-primary/10 shadow-md shadow-primary/20' 
          : 'border-border/50 bg-card hover:border-primary/30'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection indicator */}
      <motion.div
        className={cn(
          'absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center',
          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
        )}
        animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {isSelected && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-3 h-3 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </motion.div>

      {/* Category badge */}
      <div 
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wide mb-2"
        style={{ 
          backgroundColor: `${categoryInfo?.color || 'hsl(var(--muted))'}20`,
          color: categoryInfo?.color || 'hsl(var(--muted-foreground))'
        }}
      >
        <span 
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: categoryInfo?.color || 'hsl(var(--muted-foreground))' }}
        />
        {categoryInfo?.label || category}
      </div>

      {/* Symptom label */}
      <p className={cn(
        'font-medium text-sm pr-6 transition-colors',
        isSelected ? 'text-primary' : 'text-foreground'
      )}>
        {label}
      </p>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
        }}
      />
    </motion.button>
  );
}
