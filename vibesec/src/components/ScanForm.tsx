"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function ScanForm() {
  const [url, setUrl] = useState("");
  const { user, isLoaded } = useUser();
  const createScan = useMutation(api.scans.createScan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !user) {
      // This case should ideally be handled by the UI, but as a fallback:
      toast.error("Authentication Required", {
        description: "Please sign in or sign up to start a scan.",
        action: (
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign Up</Button>
            </SignUpButton>
          </div>
        ),
      });
      return;
    }

    try {
      const scanId = await createScan({
        url,
      });
      toast.success(`Scan for ${url} initiated.`, {
        description: `Scan ID: ${scanId}`,
      });
      setUrl("");
    } catch (error) {
      console.error("Failed to create scan:", error);
      toast.error("Failed to start scan.", {
        description: "Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isLoaded ? (
        <p>Loading authentication...</p>
      ) : !user ? (
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-lg font-semibold">Sign in to start scanning!</p>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outline">Sign Up</Button>
            </SignUpButton>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </form>
  );
}
