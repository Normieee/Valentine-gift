import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type NoteResponse, type CreateNoteRequest, type UpdateNoteRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useNotes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery<NoteResponse[]>({
    queryKey: ["/api/notes"],
    queryFn: async () => {
      const res = await fetch("/api/notes");
      if (!res.ok) {
        return [];
      }
      return res.json();
    },
  });

  const createNote = useMutation({
    mutationFn: async (note: CreateNoteRequest) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to create note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note added!", description: "Stuck to the fridge." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not save note.", variant: "destructive" });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...note }: UpdateNoteRequest & { id: number }) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to update note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Deleted", description: "Note removed." });
    },
  });

  return { 
    notes, 
    isLoading, 
    createNote: createNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate
  };
}
