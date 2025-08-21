import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "fs";
import path from "path";

type ReportItem = {
  vulnerability: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  poc: string;
  fix: string;
  educationalNotes: string;
};

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
      throw new ConvexError("User not found in Convex database.");
    }

    const scanId = await ctx.db.insert("scans", {
      userId: user._id,
      url: args.url,
      status: "cloning",
    });

    const dir = path.join("/tmp", scanId.toString());
    
    try {
      await fs.promises.mkdir(dir, { recursive: true });
      await git.clone({
        fs,
        http,
        dir,
        url: args.url,
        singleBranch: true,
        depth: 1,
      });

      // In the next phase, we will scan the files here.
      // For now, just mark it as cloned.
      await ctx.db.patch(scanId, {
        status: "cloned",
      });

    } catch (error) {
      console.error("Error cloning repository:", error);
      await ctx.db.patch(scanId, {
        status: "failed",
      });
      // We don't rethrow the error to the client, but the status reflects the failure.
    } finally {
      // Clean up the cloned repository
      await fs.promises.rm(dir, { recursive: true, force: true });
    }

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
