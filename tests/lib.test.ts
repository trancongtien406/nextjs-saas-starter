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
