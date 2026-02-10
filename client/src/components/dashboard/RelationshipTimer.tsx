import { useEffect, useState } from "react";
import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";

interface RelationshipTimerProps {
  startDate: string | Date | null;
}

export function RelationshipTimer({ startDate }: RelationshipTimerProps) {
  const [duration, setDuration] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    if (!startDate) return;

    const start = new Date(startDate);
    
    const tick = () => {
      const now = new Date();
      // Simple calculation for display
      // Note: precise duration calculation is complex due to varying month lengths
      // This is a simplified approach for visual effect
      
      const totalSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
      
      const years = Math.floor(totalSeconds / (3600 * 24 * 365));
      const months = Math.floor((totalSeconds % (3600 * 24 * 365)) / (3600 * 24 * 30));
      const days = Math.floor((totalSeconds % (3600 * 24 * 30)) / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setDuration({ years, months, days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!startDate) return null;

  const timeUnits = [
    { label: "Years", value: duration.years },
    { label: "Months", value: duration.months },
    { label: "Days", value: duration.days },
    { label: "Hours", value: duration.hours },
    { label: "Mins", value: duration.minutes },
    { label: "Secs", value: duration.seconds },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto py-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display text-primary/80 italic">Together For</h2>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="glass-panel w-full aspect-square rounded-xl flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.15)] border-primary/20">
              <span className="text-2xl md:text-4xl font-bold font-display tabular-nums bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
                {unit.value}
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{unit.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
