import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  scans: defineTable({
    userId: v.id("users"),
    url: v.string(),
    status: v.union(v.literal("pending"), v.literal("cloning"), v.literal("scanning"), v.literal("completed"), v.literal("failed")),
    report: v.optional(v.array(v.object({
      vulnerability: v.string(),
      severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
      description: v.string(),
      poc: v.string(),
      fix: v.string(),
      educationalNotes: v.string(),
    }))),
  }).index("by_user_id", ["userId"]),
});
