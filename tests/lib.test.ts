import { describe, expect, it } from "vitest";
import { canAddSeat, formatMoney, getPlan, percentChange } from "../src/lib/plans";
import { signSession, verifySession } from "../src/lib/auth/session";
import { safeNext } from "../src/lib/auth/redirect";
import { timeAgo, initials } from "../src/lib/utils";

describe("plans", () => {
  it("falls back to starter for unknown plans", () => expect(getPlan("nope").id).toBe("starter"));
  it("enforces seat limits", () => {
    expect(canAddSeat("starter", 1)).toBe(true);
    expect(canAddSeat("starter", 2)).toBe(false);
    expect(canAddSeat("pro", 9)).toBe(true);
  });
  it("formats money", () => {
    expect(formatMoney(2900)).toBe("$29");
    expect(formatMoney(2467800)).toBe("$24,678");
    expect(formatMoney(1999)).toBe("$19.99");
  });
  it("computes percent change", () => {
    expect(percentChange(110, 100)).toBe(10);
    expect(percentChange(5, 0)).toBe(0);
  });
});

describe("session", () => {
  it("round-trips a signed token", async () => {
    const token = await signSession({ userId: 7, teamId: 3 });
    expect(await verifySession(token)).toEqual({ userId: 7, teamId: 3 });
  });
  it("rejects tampered or missing tokens", async () => {
    const token = await signSession({ userId: 7, teamId: 3 });
    expect(await verifySession(token.slice(0, -2) + "xx")).toBeNull();
    expect(await verifySession(undefined)).toBeNull();
  });
});

describe("safeNext", () => {
  it("only allows dashboard paths", () => {
    expect(safeNext("/dashboard/billing")).toBe("/dashboard/billing");
    expect(safeNext("https://evil.com")).toBe("/dashboard");
    expect(safeNext("//evil.com")).toBe("/dashboard");
    expect(safeNext(null)).toBe("/dashboard");
  });
});

describe("utils", () => {
  it("formats relative time", () => {
    const now = new Date("2026-11-14T10:00:00Z");
    expect(timeAgo(new Date("2026-11-14T09:00:00Z"), now)).toBe("1h ago");
    expect(timeAgo(new Date("2026-11-12T10:00:00Z"), now)).toBe("2d ago");
  });
  it("builds initials", () => expect(initials("Linh Tran")).toBe("LT"));
});

import { healthLabel, healthScore } from "../src/lib/health";

describe("health score", () => {
  const base = { status: "active", plan: "Growth", tenureDays: 365, failedPayments: 0, upgrades: 0 };
  it("rates long-standing active customers as healthy", () => expect(healthLabel(healthScore(base)).label).toBe("Healthy"));
  it("penalises failed payments", () => expect(healthScore({ ...base, status: "past_due", failedPayments: 1 })).toBeLessThan(50));
  it("churned customers are at risk", () => expect(healthLabel(healthScore({ ...base, status: "churned" })).tone).toBe("red"));
  it("stays within 0-100", () => {
    expect(healthScore({ ...base, upgrades: 9, tenureDays: 9999, plan: "Enterprise" })).toBeLessThanOrEqual(100);
    expect(healthScore({ ...base, status: "past_due", failedPayments: 9 })).toBeGreaterThanOrEqual(0);
  });
});
