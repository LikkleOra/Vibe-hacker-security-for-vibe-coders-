import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const createScan = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User is not authenticated.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      // In a real app, you might want to create the user here.
      // For now, we'll assume the user is created upon sign-up.
      throw new ConvexError("User not found in Convex database.");
    }

    const scanId = await ctx.db.insert("scans", {
      userId: user._id,
      url: args.url,
      status: "pending",
    });

    return scanId;
  },
});

export const getScansForUser = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Not logged in, so no scans to return.
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const scan = await ctx.db.get(args.scanId);
    if (!scan) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || scan.userId !== user._id) {
      // The user is not the owner of the scan.
      return null;
    }

    return scan;
  },
});
