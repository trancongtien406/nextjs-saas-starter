import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { stripe } from "@/lib/stripe";

/** Signed Stripe webhook: keeps team plan/subscription status in sync. Test with `stripe listen --forward-to localhost:3000/api/stripe/webhook`. */
export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  const sig = req.headers.get("stripe-signature");
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig ?? "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const teamId = Number(s.metadata?.teamId);
    const planId = s.metadata?.planId as "pro" | "business" | undefined;
    if (teamId && planId) {
      db.update(schema.teams).set({ plan: planId, subscriptionStatus: "active", stripeCustomerId: String(s.customer), stripeSubscriptionId: String(s.subscription) })
        .where(eq(schema.teams.id, teamId)).run();
      db.insert(schema.activityLogs).values({ teamId, action: "plan.upgraded", detail: `Subscribed to ${planId} via Stripe Checkout`, createdAt: new Date() }).run();
    }
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const deleted = event.type === "customer.subscription.deleted";
    db.update(schema.teams).set({ subscriptionStatus: deleted ? "canceled" : sub.status, ...(deleted ? { plan: "starter" as const } : {}) })
      .where(eq(schema.teams.stripeSubscriptionId, sub.id)).run();
  }
  return NextResponse.json({ received: true });
}
