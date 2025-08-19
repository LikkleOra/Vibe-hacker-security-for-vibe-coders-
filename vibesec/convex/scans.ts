import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

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
      // In a real app, you might want to create the user here.
      // For now, we'll assume the user is created upon sign-up.
      throw new ConvexError("User not found in Convex database.");
    }

    const scanId = await ctx.db.insert("scans", {
      userId: user._id,
      url: args.url,
      status: "pending",
    });

    // Simulate a delay for the scan
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock vulnerability report
    const mockReport: ReportItem[] = [
      {
        vulnerability: "SQL Injection",
        severity: "high",
        description: "Potential SQL injection vulnerability found in input field.",
        poc: "' OR 1=1 --",
        fix: "Use prepared statements or parameterized queries.",
        educationalNotes: "SQL injection is a code injection technique used to attack data-driven applications, in which malicious SQL statements are inserted into an entry field for execution (e.g., to dump the database contents to the attacker).",
      },
      {
        vulnerability: "Cross-Site Scripting (XSS)",
        severity: "medium",
        description: "Reflected XSS vulnerability found in search parameter.",
        poc: "<script>alert('XSS')</script>",
        fix: "Sanitize all user-supplied input before rendering it on the page.",
        educationalNotes: "Cross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.",
      },
      {
        vulnerability: "Insecure Direct Object Reference (IDOR)",
        severity: "low",
        description: "User ID in URL is directly accessible without proper authorization checks.",
        poc: "/api/users?id=123",
        fix: "Implement proper authorization checks for all direct object references.",
        educationalNotes: "Insecure Direct Object Reference (IDOR) is a type of access control vulnerability that arises when an application uses user-supplied input to access objects directly. This can allow attackers to bypass authorization and access resources they are not authorized to access.",
      },
    ];

    await ctx.db.patch(scanId, {
      status: "completed",
      report: mockReport,
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