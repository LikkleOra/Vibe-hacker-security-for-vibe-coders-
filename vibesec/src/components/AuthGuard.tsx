"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log('AuthGuard render count:', renderCount.current);

  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    // You can add a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
