import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import fs from "fs";
import path from "path";
import { secretPatterns } from "../src/lib/patterns";

// Securely join a path and ensure it stays within the base directory
function secureJoin(base: string, ...paths: string[]): string {
  const joinedPath = path.join(base, ...paths);
  const normalizedPath = path.normalize(joinedPath);

  if (!normalizedPath.startsWith(path.normalize(base))) {
    throw new ConvexError("Potential path traversal attempt detected.");
  }

  return normalizedPath;
}

// Helper function to recursively walk a directory
async function walkDir(dir: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = secureJoin(dir, entry.name);
    if (entry.isDirectory()) {
      // Exclude .git directory
      if (entry.name !== ".git") {
        files = files.concat(await walkDir(res));
      }
    } else {
      files.push(res);
    }
  }
  return files;
}

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

    const dir = secureJoin("/tmp", scanId.toString());

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

      await ctx.db.patch(scanId, { status: "scanning" });

      const allFiles = await walkDir(dir);
      const findings: ReportItem[] = [];

      for (const file of allFiles) {
        const content = await fs.promises.readFile(file, "utf-8");
        for (const { type, pattern } of secretPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            for (const match of matches) {
              findings.push({
                vulnerability: `Hardcoded Secret: ${type}`,
                severity: "high",
                description: "A hardcoded secret matching the pattern for ${type} was found in the file. Storing secrets in code is a major security risk.",
                poc: `File: ${path.relative(dir, file)}, Match: "${match.substring(0, 50)}"..."",
                fix: "Store secrets in a secure vault or environment variables, and access them at runtime.",
                educationalNotes: "Hardcoding secrets makes them easily accessible to anyone with source code access and complicates key rotation.",
              });
            }
          }
        }
      }

      await ctx.db.patch(scanId, {
        status: "completed",
        report: findings,
      });

    } catch (error) {
      console.error("Error during scan:", error);
      await ctx.db.patch(scanId, {
        status: "failed",
      });
    } finally {
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
      return null;
    }

    return scan;
  },
});
