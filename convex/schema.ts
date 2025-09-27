import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Clean schema without Convex Auth tables
export default defineSchema({
  cycles: defineTable({
    userId: v.string(), // This will now be Clerk user ID
    startDate: v.string(),
    symptoms: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "startDate"]),

  dailyTracking: defineTable({
    userId: v.string(), // This will now be Clerk user ID
    date: v.string(), // ISO date string
    flow: v.optional(v.string()), // 'light' | 'medium' | 'heavy' | 'none'
    mood: v.optional(v.string()), // 'great' | 'good' | 'okay' | 'low' | 'irritable'
    energy: v.optional(v.string()), // 'high' | 'medium' | 'low'
    sleep: v.optional(v.number()), // hours of sleep
    symptoms: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    isPeriod: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),
});
