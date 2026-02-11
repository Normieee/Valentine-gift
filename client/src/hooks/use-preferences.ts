import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type UserPreferenceResponse, type UpdateUserPreferenceRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// We hardcode the path because the 'api' helper is missing
const PREFERENCES_PATH = "/api/preferences";

export function usePreferences() {
  return useQuery<UserPreferenceResponse>({
    queryKey: [PREFERENCES_PATH],
    queryFn: async () => {
      const res = await fetch(PREFERENCES_PATH);
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch preferences");
      }
      return res.json();
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateUserPreferenceRequest) => {
      const res = await fetch(PREFERENCES_PATH, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PREFERENCES_PATH] });
      toast({ title: "Settings saved", description: "Your universe is updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });
}
