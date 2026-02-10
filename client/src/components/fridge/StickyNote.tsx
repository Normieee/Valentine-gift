import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@shared/schema";

interface StickyNoteProps {
  note: Note;
  onDelete: (id: number) => void;
  canDelete: boolean;
}

const colors: Record<string, string> = {
  yellow: "bg-[#fef9c3] text-gray-800 rotate-1",
  blue: "bg-[#dbeafe] text-blue-900 -rotate-2",
  pink: "bg-[#fce7f3] text-pink-900 rotate-2",
  green: "bg-[#dcfce7] text-green-900 -rotate-1",
  purple: "bg-[#f3e8ff] text-purple-900 rotate-1",
};

export function StickyNote({ note, onDelete, canDelete }: StickyNoteProps) {
  const colorClass = colors[note.color || "yellow"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05, zIndex: 10, rotate: 0 }}
      layout
      className={cn(
        "relative p-6 w-full aspect-square shadow-lg flex items-center justify-center text-center font-handwriting",
        colorClass,
        "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none"
      )}
      style={{
        boxShadow: "2px 4px 8px rgba(0,0,0,0.2)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)", // Folded corner effect
      }}
    >
      <div className="absolute top-[-10px] left-[50%] -translate-x-1/2 w-32 h-8 bg-white/20 blur-sm transform rotate-1" /> {/* Tape effect */}
      
      <p className="font-display text-lg md:text-xl font-medium leading-snug break-words max-w-full">
        {note.content}
      </p>

      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* Folded corner visual */}
      <div className="absolute bottom-0 right-0 w-[10%] h-[10%] bg-black/10 backdrop-blur-sm" 
           style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} 
      />
    </motion.div>
  );
}
