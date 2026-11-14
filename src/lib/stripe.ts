import "server-only";
import Stripe from "stripe";
import { getPlan, type PlanId } from "@/lib/plans";

/** Stripe is optional: without STRIPE_SECRET_KEY the app runs in "demo billing" mode. */
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const billingMode = stripe ? "stripe" : "demo";

export async function createCheckoutUrl(opts: { teamId: number; planId: PlanId; customerId?: string | null; email: string }) {
  if (!stripe) throw new Error("Stripe is not configured");
  const plan = getPlan(opts.planId);
  const price = plan.stripePriceEnv ? process.env[plan.stripePriceEnv] : undefined;
  if (!price) throw new Error(`Missing ${plan.stripePriceEnv} env var`);
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    customer: opts.customerId ?? undefined,
    customer_email: opts.customerId ? undefined : opts.email,
    client_reference_id: String(opts.teamId),
    metadata: { teamId: String(opts.teamId), planId: plan.id },
    subscription_data: { metadata: { teamId: String(opts.teamId), planId: plan.id } },
    success_url: `${base}/dashboard/billing?success=1`,
    cancel_url: `${base}/dashboard/billing?canceled=1`,
  });
  return session.url!;
}

export async function createPortalUrl(customerId: string) {
  if (!stripe) throw new Error("Stripe is not configured");
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: `${base}/dashboard/billing` });
  return portal.url;
}
