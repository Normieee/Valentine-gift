import { useAuth } from "@/hooks/use-auth";
import { StarBackground } from "@/components/layout/StarBackground";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Globe, MessageCircleHeart } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (isLoading) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <StarBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-3xl space-y-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Globe className="w-8 h-8 text-blue-400 animate-pulse" />
          <Heart className="w-8 h-8 text-pink-500 animate-bounce" />
          <Globe className="w-8 h-8 text-purple-400 animate-pulse delay-75" />
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Across the Universe
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
          A private digital sanctuary for two souls separated by distance but connected by stars. 
          Sync your time, share your thoughts, and keep your memories alive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-left">
          <FeatureCard 
            icon={Globe} 
            title="Dual Clocks" 
            desc="Always know when to say good morning or goodnight."
          />
          <FeatureCard 
            icon={MessageCircleHeart} 
            title="Digital Fridge" 
            desc="Leave cute sticky notes for them to find when they wake up."
          />
          <FeatureCard 
            icon={Heart} 
            title="Our Timer" 
            desc="Count every second since your worlds collided."
          />
        </div>

        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105"
          onClick={() => window.location.href = "/api/login"}
        >
          Enter Our World <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        
        <p className="text-xs text-muted-foreground mt-8 opacity-60">
          Built with love for LDR couples
        </p>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="glass-card p-6 rounded-xl">
      <Icon className="w-8 h-8 text-accent mb-4" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
