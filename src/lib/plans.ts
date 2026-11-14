export type PlanId = "starter" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number; // USD
  description: string;
  seats: number;
  features: string[];
  highlighted?: boolean;
  stripePriceEnv?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 0,
    description: "For side projects and early validation.",
    seats: 2,
    features: ["Up to 100 customers", "Revenue dashboard", "2 team seats", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 29,
    description: "For growing products with paying users.",
    seats: 10,
    features: ["Unlimited customers", "Cohorts & churn insights", "10 team seats", "CSV export", "Email support"],
    highlighted: true,
    stripePriceEnv: "STRIPE_PRICE_PRO",
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: 99,
    description: "For teams that need control and scale.",
    seats: 50,
    features: ["Everything in Pro", "Role-based access", "50 team seats", "Audit log", "Priority support"],
    stripePriceEnv: "STRIPE_PRICE_BUSINESS",
  },
];

export function getPlan(id: string): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function canAddSeat(planId: string, currentSeats: number): boolean {
  return currentSeats < getPlan(planId).seats;
}

export function formatMoney(cents: number, opts: { compact?: boolean } = {}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts.compact ? "compact" : "standard",
    maximumFractionDigits: opts.compact ? 1 : cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function percentChange(current: number, previous: number): number {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
