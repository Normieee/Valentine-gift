import { useState } from "react";
import { StarBackground } from "@/components/layout/StarBackground";
import { Navbar } from "@/components/layout/Navbar";
import { useMemories, useCreateMemory, useDeleteMemory } from "@/hooks/use-memories";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Memories() {
  const { data: memories, isLoading } = useMemories();
  const createMemory = useCreateMemory();
  const deleteMemory = useDeleteMemory();
  
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const handleSubmit = async () => {
    if (!imageUrl.trim()) return;
    
    await createMemory.mutateAsync({
      imageUrl,
      caption: caption || undefined,
    });
    
    setImageUrl("");
    setCaption("");
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
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg">
              Our Galaxy
            </h1>
            <p className="text-muted-foreground mt-2">Moments frozen in stars.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add a Memory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input 
                    placeholder="https://..." 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-black/20 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground">Paste a direct link to an image.</p>
                </div>
                <div className="space-y-2">
                  <Label>Caption (Optional)</Label>
                  <Input 
                    placeholder="The day we..." 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={createMemory.isPending || !imageUrl.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {createMemory.isPending ? "Uploading..." : "Save Memory"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="masonry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories?.map((memory) => (
            <motion.div 
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-xl overflow-hidden glass-card break-inside-avoid mb-6"
            >
              <img 
                src={memory.imageUrl} 
                alt={memory.caption || "Memory"} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1e293b/FFF?text=Image+Error";
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {memory.caption && (
                  <p className="text-white font-medium mb-1">{memory.caption}</p>
                )}
                <p className="text-xs text-white/60">
                  {new Date(memory.createdAt || new Date()).toLocaleDateString()}
                </p>
                
                <button 
                  onClick={() => deleteMemory.mutate(memory.id)}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {memories?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
             <ImagePlus className="w-16 h-16 mb-4 opacity-20" />
             <p>No memories yet. Add your first photo.</p>
          </div>
        )}
      </main>
    </div>
  );
}
