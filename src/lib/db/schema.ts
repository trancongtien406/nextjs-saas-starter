import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  plan: text("plan", { enum: ["starter", "pro", "business"] }).notNull().default("starter"),
  subscriptionStatus: text("subscription_status").notNull().default("active"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["owner", "admin", "member"] }).notNull(),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull(),
});

export const invitations = sqliteTable("invitations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  email: text("email").notNull(),
  role: text("role", { enum: ["admin", "member"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  country: text("country").notNull(),
  plan: text("plan").notNull(),
  mrrCents: integer("mrr_cents").notNull(),
  status: text("status", { enum: ["active", "trialing", "past_due", "churned"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const monthlyMetrics = sqliteTable("monthly_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  month: text("month").notNull(), // YYYY-MM
  mrrCents: integer("mrr_cents").notNull(),
  newCustomers: integer("new_customers").notNull(),
  churnedCustomers: integer("churned_customers").notNull(),
  activeCustomers: integer("active_customers").notNull(),
  activeUsers: integer("active_users").notNull(),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  number: text("number").notNull(),
  plan: text("plan").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status", { enum: ["paid", "open", "void"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const customerEvents = sqliteTable("customer_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  type: text("type").notNull(),
  detail: text("detail").notNull(),
  amountCents: integer("amount_cents").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: integer("team_id").notNull().references(() => teams.id),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  detail: text("detail").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Customer = typeof customers.$inferSelect;
