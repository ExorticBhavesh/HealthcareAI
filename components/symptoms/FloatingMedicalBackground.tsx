import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const medicalIcons = [
  // Heart
  <svg key="heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
  // Lungs
  <svg key="lungs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v8M8 6c-2 0-4 2-4 6s2 8 4 8c1 0 2-1 4-1M16 6c2 0 4 2 4 6s-2 8-4 8c-1 0-2-1-4-1" />
  </svg>,
  // Brain
  <svg key="brain" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 5c-1-2-4-2-5 0s0 4 1 5c-2 0-3 2-2 4s3 2 4 2c0 2 1 4 3 4s3-2 3-4c1 0 3 0 4-2s0-4-2-4c1-1 2-3 1-5s-4-2-5 0" />
    <path d="M12 5v14" />
  </svg>,
  // Pill
  <svg key="pill" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10.5 20.5L3.5 13.5c-1.4-1.4-1.4-3.6 0-5l6-6c1.4-1.4 3.6-1.4 5 0l7 7c1.4 1.4 1.4 3.6 0 5l-6 6c-1.4 1.4-3.6 1.4-5 0z" />
    <path d="M8.5 8.5l7 7" />
  </svg>,
  // Stethoscope
  <svg key="stethoscope" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 12V8a4 4 0 0 1 8 0v4M12 12a2 2 0 1 0 4 0V8a4 4 0 0 0-8 0" />
    <circle cx="18" cy="12" r="2" />
    <path d="M18 14v4a4 4 0 0 1-8 0v-1" />
  </svg>,
  // Activity
  <svg key="activity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
  // Droplet
  <svg key="droplet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>,
  // DNA
  <svg key="dna" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 15c6.667-6 13.333 0 20-6M9 22c1.798-1.998 2.518-3.995 2.807-5.993M15 2c-1.798 1.998-2.518 3.995-2.807 5.993M2 9c6.667 6 13.333 0 20 6" />
  </svg>,
];

interface FloatingIcon {
  id: number;
  icon: JSX.Element;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingMedicalBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    // Detect low-end devices
    const checkPerformance = () => {
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;
      return (memory && memory < 4) || (cores && cores < 4);
    };
    
    setIsLowEnd(checkPerformance());

    // Generate floating icons
    const generatedIcons: FloatingIcon[] = [];
    for (let i = 0; i < 12; i++) {
      generatedIcons.push({
        id: i,
        icon: medicalIcons[i % medicalIcons.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 32,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
      });
    }
    setIcons(generatedIcons);
  }, []);

  if (shouldReduceMotion || isLowEnd) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient wave background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 0% 0%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse at 100% 100%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse at 0% 100%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse at 0% 0%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating medical icons */}
      {icons.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-primary/10"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: item.size,
            height: item.size,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [-5, 5, -5],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Soft particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-50, 50],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
    </div>
  );
}
