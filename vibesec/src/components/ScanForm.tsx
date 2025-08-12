import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function ScanForm() {
  const [url, setUrl] = useState("");
  const { user } = useUser();
  const createScan = useMutation(api.scans.createScan);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to start a scan.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For MVP, we'll use a placeholder user ID. In a real app, you'd fetch or create the Convex user.
      // For now, we'll assume the Convex user ID is the same as the Clerk user ID for simplicity in MVP.
      // In a full implementation, you'd have a Convex mutation to get or create the user based on Clerk ID.
      const convexUserId = user.id; // Placeholder: Replace with actual Convex user ID

      const scanId = await createScan({
        userId: convexUserId as any, // Cast as any for now, will fix with proper Convex user ID
        url,
      });
      toast({
        title: "Scan Started",
        description: `Scan for ${url} initiated. Scan ID: ${scanId}`,
      });
      setUrl("");
    } catch (error) {
      console.error("Failed to create scan:", error);
      toast({
        title: "Error",
        description: "Failed to start scan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Label htmlFor="url">Application URL or ZIP Upload (MVP: URL only)</Label>
      <Input
        id="url"
        type="url"
        placeholder="https://your-app.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <Button type="submit">Start Scan</Button>
    </form>
  );
}
