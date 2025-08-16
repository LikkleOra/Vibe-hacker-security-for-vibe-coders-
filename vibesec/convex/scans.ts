import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

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
    userId: v.id("users"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const scanId = await ctx.db.insert("scans", {
      userId: args.userId,
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

export const getScans = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
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
