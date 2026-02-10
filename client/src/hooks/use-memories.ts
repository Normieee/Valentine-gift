import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type MemoryResponse, type CreateMemoryRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMemories() {
  return useQuery({
    queryKey: [api.memories.list.path],
    queryFn: async () => {
      const res = await fetch(api.memories.list.path, { credentials: "include" });
      if (!res.ok) {
         if (res.status === 401) return [];
         throw new Error("Failed to fetch memories");
      }
      return api.memories.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateMemoryRequest) => {
      const res = await fetch(api.memories.create.path, {
        method: api.memories.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create memory");
      return api.memories.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.memories.list.path] });
      toast({ title: "Memory captured!", description: "Saved to your gallery." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save memory.", variant: "destructive" });
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.memories.delete.path, { id });
      const res = await fetch(url, {
        method: api.memories.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete memory");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.memories.list.path] });
      toast({ title: "Memory faded", description: "Removed from gallery." });
    },
  });
}
