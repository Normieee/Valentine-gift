import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Clock as ClockIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DualClocksProps {
  partnerTimezone: string;
  partnerName: string;
}

export function DualClocks({ partnerTimezone, partnerName }: DualClocksProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localTime = time;
  const remoteTime = toZonedTime(time, partnerTimezone);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      <ClockCard 
        label="My Time" 
        time={localTime} 
        timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
        color="text-blue-300"
      />
      <ClockCard 
        label={`${partnerName || "Partner"}'s Time`} 
        time={remoteTime} 
        timezone={partnerTimezone}
        color="text-purple-300"
        delay={0.2}
      />
    </div>
  );
}

function ClockCard({ label, time, timezone, color, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <ClockIcon className="w-24 h-24" />
      </div>
      
      <h3 className="text-muted-foreground text-sm uppercase tracking-widest mb-4 font-medium">{label}</h3>
      <div className="text-5xl md:text-6xl font-display font-bold tabular-nums tracking-tight">
        {format(time, "HH:mm")}
      </div>
      <div className="text-xl md:text-2xl font-light opacity-80 mt-1">
        {format(time, "ss")}
      </div>
      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {format(time, "EEEE, MMMM do")} • {timezone.split("/")[1]?.replace("_", " ")}
      </div>
    </motion.div>
  );
}
