import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type UserPreferenceResponse, type UpdateUserPreferenceRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function usePreferences() {
  return useQuery({
    queryKey: [api.preferences.get.path],
    queryFn: async () => {
      const res = await fetch(api.preferences.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch preferences");
      }
      // Can be empty if not set yet, handled by backend usually returning default or empty obj
      return api.preferences.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateUserPreferenceRequest) => {
      const res = await fetch(api.preferences.update.path, {
        method: api.preferences.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      return api.preferences.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.preferences.get.path] });
      toast({ title: "Settings saved", description: "Your universe is updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });
}
