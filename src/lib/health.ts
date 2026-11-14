export interface HealthInput {
  status: string;
  plan: string;
  tenureDays: number;
  failedPayments: number;
  upgrades: number;
}

/** 0–100 customer health score from billing signals (simple, explainable heuristic). */
export function healthScore(c: HealthInput): number {
  if (c.status === "churned") return 8;
  let score = 45;
  score += c.status === "active" ? 25 : c.status === "trialing" ? 8 : c.status === "past_due" ? -20 : 0;
  score += Math.min(15, (c.tenureDays / 30) * 1.25);
  score += Math.min(10, c.upgrades * 10);
  score += ["Scale", "Enterprise"].includes(c.plan) ? 5 : 0;
  score -= c.failedPayments * 15;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function healthLabel(score: number): { label: string; tone: "green" | "amber" | "red" } {
  if (score >= 75) return { label: "Healthy", tone: "green" };
  if (score >= 50) return { label: "Needs attention", tone: "amber" };
  return { label: "At risk", tone: "red" };
}
