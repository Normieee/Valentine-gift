import { useEffect } from "react";
import { StarBackground } from "@/components/layout/StarBackground";
import { Navbar } from "@/components/layout/Navbar";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Simple schema for the form
const formSchema = z.object({
  partnerName: z.string().min(1, "Name is required"),
  partnerTimezone: z.string().min(1, "Timezone is required"),
  relationshipStartDate: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Settings() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerName: "",
      partnerTimezone: "Asia/Tokyo",
      relationshipStartDate: "",
    },
  });

  // Load data into form when fetched
  useEffect(() => {
    if (prefs) {
      form.reset({
        partnerName: prefs.partnerName || "",
        partnerTimezone: prefs.partnerTimezone || "Asia/Tokyo",
        // Format date for datetime-local input
        relationshipStartDate: prefs.relationshipStartDate 
          ? new Date(prefs.relationshipStartDate).toISOString().slice(0, 16) 
          : "",
      });
    }
  }, [prefs, form]);

  const onSubmit = (data: FormData) => {
    updatePrefs.mutate({
      partnerName: data.partnerName,
      partnerTimezone: data.partnerTimezone,
      relationshipStartDate: new Date(data.relationshipStartDate),
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0 relative">
      <StarBackground />
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:pt-24 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg mb-8">
          Universe Settings
        </h1>

        <Card className="glass-panel border-white/10 text-white">
          <CardHeader>
            <CardTitle>Relationship Details</CardTitle>
            <CardDescription className="text-gray-400">
              Configure your dashboard to sync correctly with your partner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="partnerName">Partner's Name</Label>
                <Input 
                  id="partnerName" 
                  {...form.register("partnerName")}
                  className="bg-black/20 border-white/10" 
                />
                {form.formState.errors.partnerName && (
                  <p className="text-sm text-red-400">{form.formState.errors.partnerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerTimezone">Partner's Timezone</Label>
                <Select 
                  onValueChange={(val) => form.setValue("partnerTimezone", val)}
                  defaultValue={form.getValues("partnerTimezone")}
                >
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    <SelectItem value="America/New_York">New York (EST)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Relationship Start Date</Label>
                <Input 
                  id="date" 
                  type="datetime-local"
                  {...form.register("relationshipStartDate")}
                  className="bg-black/20 border-white/10 block w-full" 
                />
                <p className="text-xs text-muted-foreground">Used for the relationship timer.</p>
              </div>

              <Button 
                type="submit" 
                disabled={updatePrefs.isPending}
                className="w-full bg-primary hover:bg-primary/90 mt-4"
              >
                {updatePrefs.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
