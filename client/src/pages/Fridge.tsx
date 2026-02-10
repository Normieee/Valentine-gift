import { useState } from "react";
import { StarBackground } from "@/components/layout/StarBackground";
import { Navbar } from "@/components/layout/Navbar";
import { useNotes, useCreateNote, useDeleteNote } from "@/hooks/use-notes";
import { StickyNote } from "@/components/fridge/StickyNote";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const NOTE_COLORS = [
  { id: "yellow", bg: "bg-[#fef9c3]" },
  { id: "blue", bg: "bg-[#dbeafe]" },
  { id: "pink", bg: "bg-[#fce7f3]" },
  { id: "green", bg: "bg-[#dcfce7]" },
  { id: "purple", bg: "bg-[#f3e8ff]" },
];

export default function Fridge() {
  const { data: notes, isLoading } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    await createNote.mutateAsync({
      content,
      color: selectedColor,
      rotation: Math.floor(Math.random() * 6) - 3, // Random tilt
      x: 0, 
      y: 0,
      isDraft: false
    });
    
    setContent("");
    setIsOpen(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 relative">
      <StarBackground />
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:pt-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg">
            The Fridge
          </h1>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Write a Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Write something sweet..." 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-black/20 border-white/10 min-h-[120px] resize-none focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        c.bg,
                        selectedColor === c.id ? "border-primary scale-110" : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={createNote.isPending || !content.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {createNote.isPending ? "Sticking..." : "Stick Note"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
          <AnimatePresence>
            {notes?.map((note, index) => (
              <motion.div 
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <StickyNote 
                  note={note} 
                  onDelete={(id) => deleteNote.mutate(id)}
                  canDelete={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {notes?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground opacity-50">
               <div className="text-6xl mb-4">🧊</div>
               <p>It's cold in here. Add some warmth.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
