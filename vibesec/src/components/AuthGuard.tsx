"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

/**
 * A component that guards a route, ensuring that only authenticated users can access it.
 * It handles the loading state from Clerk and redirects unauthenticated users to the sign-in page.
 *
 * @param children The content to render if the user is authenticated.
 * @returns The children if the user is authenticated, a loading indicator, or a redirect.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const renderCount = useRef(0);
  renderCount.current += 1;
  

  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    // While Clerk is loading, show a loading indicator.
    // This prevents a flash of the sign-in page for authenticated users.
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null; // or a loading spinner
  }

  // If the user is signed in, render the protected content.
  return <>{children}</>;
}