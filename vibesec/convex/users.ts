import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const getOrCreateUser = mutation({
  args: {}, // No arguments needed, will use auth context.
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User is not authenticated.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user) {
      return user;
    }

    // The user's email and name from Clerk are optional, so we need to handle
    // the case where they are not present. For this application, we will
    // assume they are always present and use a non-null assertion.
    // A more robust implementation might use a default value or have
    // a different logic for handling missing user details.
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      name: identity.name!,
    });
  },
});

export const getUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});
