"use client";

import { useQueries, useMutation } from "convex/react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { FunctionReference } from "convex/server";
import { useEffect } from "react";

/**
 * A wrapper for useQuery that uses useQueries to safely handle errors
 * without crashing the application. It provides a structured return value
 * with data, isLoading, and error states.
 */
export function useSafeQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: Query["_args"]
) {
  const queryKey = "safeQuery";
  const results = useQueries({
    [queryKey]: {
      query,
      args,
    },
  });

  const result = results[queryKey];
  const isLoading = result === undefined;
  const error = result instanceof Error ? result : null;
  const data = !isLoading && !error ? result : undefined;

  useEffect(() => {
    if (error && process.env.NODE_ENV === "development") {
      console.error("Convex query error:", error);
    }
  }, [error]);

  return { data, isLoading, error };
}

/**
 * A wrapper for useMutation that adds error handling, logging, and toast
 * notifications without crashing the application.
 */
export function useSafeMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation
) {
  const convexMutation = useMutation(mutation);

  const safeMutation = async (args: Mutation["_args"]) => {
    try {
      return await convexMutation(args);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Convex mutation error:", error);
      }

      if (error instanceof ConvexError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }

      return null;
    }
  };

  return safeMutation;
}
