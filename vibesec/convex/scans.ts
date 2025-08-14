import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createScan = mutation({
  args: {
    userId: v.string(), // Clerk user ID
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const scanId = await ctx.db.insert("scans", {
      userId: user._id,
      url: args.url,
      status: "pending",
    });

    // In a real app, you would trigger a backend process to perform the scan.
    // For this example, we'll simulate the scan and generate a mock report.
    // Do not block the client for the full scan duration.

    return scanId;
  },
});

export const getScansForUser = query({
  args: {
    userId: v.string(), // Clerk user ID
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("scans")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getScanById = query({
  args: {
    scanId: v.id("scans"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scanId);
  },
});
