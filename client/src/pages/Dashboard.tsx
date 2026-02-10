import { StarBackground } from "@/components/layout/StarBackground";
import { Navbar } from "@/components/layout/Navbar";
import { DualClocks } from "@/components/dashboard/DualClocks";
import { RelationshipTimer } from "@/components/dashboard/RelationshipTimer";
import { usePreferences } from "@/hooks/use-preferences";
import { useNotes } from "@/hooks/use-notes";
import { motion } from "framer-motion";
import { StickyNote } from "@/components/fridge/StickyNote";
import { Link } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: prefs, isLoading: prefsLoading } = usePreferences();
  const { data: notes, isLoading: notesLoading } = useNotes();

  if (prefsLoading || notesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // Use defaults if prefs not set yet
  const partnerName = prefs?.partnerName || "Partner";
  const partnerTimezone = prefs?.partnerTimezone || "Asia/Tokyo";
  const startDate = prefs?.relationshipStartDate;

  // Get 2 latest notes
  const recentNotes = notes?.slice(0, 2) || [];

  return (
    <div className="min-h-screen pb-24 md:pb-0 relative">
      <StarBackground />
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:pt-24 space-y-16">
        
        <section>
          <DualClocks 
            partnerName={partnerName} 
            partnerTimezone={partnerTimezone} 
          />
        </section>

        <section>
          <RelationshipTimer startDate={startDate} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick Fridge Peek */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border-t border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">On The Fridge</h2>
              <Link href="/fridge" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentNotes.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {recentNotes.map(note => (
                  <div key={note.id} className="transform scale-90 hover:scale-100 transition-transform">
                     <StickyNote note={note} onDelete={() => {}} canDelete={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground italic border-2 border-dashed border-white/10 rounded-xl">
                No notes yet... go stick one!
              </div>
            )}
          </motion.div>

          {/* Quick Memory Peek */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl border-t border-white/10 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6 z-10 relative">
              <h2 className="text-xl font-display font-bold">Latest Memory</h2>
              <Link href="/memories" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 group">
              {/* Placeholder for now since we don't have images yet */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
                <span className="opacity-50">Upload your first photo</span>
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
