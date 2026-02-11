import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type MemoryResponse, type CreateMemoryRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMemories() {
  return useQuery<MemoryResponse[]>({
    queryKey: ["/api/memories"],
    queryFn: async () => {
      const res = await fetch("/api/memories");
      if (!res.ok) return [];
      return res.json();
    },
  });
}

export function useCreateMemory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMemoryRequest) => {
      if (data.imageUrl === "") delete (data as any).imageUrl;
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save memory");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      toast({ title: "Memory unlocked!", description: "Saved to the timeline." });
    },
  });
}

export function useDeleteMemory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/memories/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      toast({ title: "Forgotten", description: "Memory removed." });
    },
  });
}
