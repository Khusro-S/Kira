import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all cycles for the authenticated user
export const getUserCycles = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; // Return empty array instead of throwing error for better UX
    }

    return await ctx.db
      .query("cycles")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();
  },
});

// Add a new cycle (authenticated)
export const addCycle = mutation({
  args: {
    startDate: v.string(),
    symptoms: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("cycles", {
      userId: identity.subject,
      startDate: args.startDate,
      symptoms: args.symptoms,
      notes: args.notes,
    });
  },
});

// Add or update daily tracking data (mood, energy, sleep, symptoms)
export const addDailyTracking = mutation({
  args: {
    date: v.string(), // ISO date string
    flow: v.optional(v.string()), // 'light' | 'medium' | 'heavy' | 'none'
    mood: v.optional(v.string()), // 'great' | 'good' | 'okay' | 'low' | 'irritable'
    energy: v.optional(v.string()), // 'high' | 'medium' | 'low'  
    sleep: v.optional(v.number()), // hours of sleep
    symptoms: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    isPeriod: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if daily tracking entry already exists for this date
    const existing = await ctx.db
      .query("dailyTracking")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), identity.subject),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    if (existing) {
      // Update existing entry
      return await ctx.db.patch(existing._id, {
        flow: args.flow,
        mood: args.mood,
        energy: args.energy,
        sleep: args.sleep,
        symptoms: args.symptoms,
        notes: args.notes,
        isPeriod: args.isPeriod,
      });
    } else {
      // Create new entry
      return await ctx.db.insert("dailyTracking", {
        userId: identity.subject,
        date: args.date,
        flow: args.flow,
        mood: args.mood,
        energy: args.energy,
        sleep: args.sleep,
        symptoms: args.symptoms,
        notes: args.notes,
        isPeriod: args.isPeriod,
      });
    }
  },
});

// Get daily tracking data for the authenticated user
export const getUserDailyTracking = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("dailyTracking")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .order("desc")
      .collect();
  },
});

// Get daily tracking for a specific date
export const getDailyTrackingByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("dailyTracking")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), identity.subject),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();
  },
});

// Delete daily tracking data for a specific date
export const deleteDailyTracking = mutation({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("dailyTracking")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), identity.subject),
          q.eq(q.field("date"), args.date)
        )
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
