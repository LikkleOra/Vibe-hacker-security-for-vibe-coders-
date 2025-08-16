"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    // You can add a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
