// End-to-end smoke test against a running app (`pnpm start`): sign-up, empty state, invite, plan change, demo login.
import { chromium } from "playwright-core";

const BASE = process.env.APP_URL ?? "http://localhost:3123";
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome" });
const p = await b.newPage();
const ok = (c, msg) => { if (!c) throw new Error("FAIL: " + msg); console.log("✓", msg); };
const email = `smoke${Date.now()}@example.com`;

await p.goto(BASE + "/dashboard");
ok(p.url().includes("/sign-in"), "dashboard redirects anonymous users to sign-in");
await p.goto(BASE + "/sign-up");
await p.fill("#name", "Smoke Tester"); await p.fill("#company", "Smoke Co"); await p.fill("#email", email); await p.fill("#password", "password123");
await p.click("button[type=submit]"); await p.waitForURL("**/dashboard");
await p.waitForSelector("text=Your workspace is ready");
ok(true, "new workspace shows the empty state");
await p.goto(BASE + "/dashboard/team");
await p.fill("input[name=email]", "friend@example.com"); await p.getByRole("button", { name: "Invite", exact: true }).click();
await p.waitForSelector("text=Invitation sent to friend@example.com");
ok(true, "owner can invite a teammate");
await p.fill("input[name=email]", "second@example.com"); await p.getByRole("button", { name: "Invite", exact: true }).click();
await p.waitForSelector("text=Upgrade to add more");
ok(true, "Starter seat limit (2) is enforced");
await p.goto(BASE + "/dashboard/billing");
await p.click("text=Upgrade to Business"); await p.waitForURL("**/billing?success=1");
await p.waitForSelector("text=Your plan has been updated");
ok(true, "plan upgrade works in demo billing mode");
ok((await p.textContent("body")).includes("Business"), "billing page shows the Business plan");
await p.goto(BASE + "/dashboard/activity");
await p.waitForSelector("text=Changed plan to Business");
ok(true, "activity log records the plan change");
await p.context().clearCookies();
await p.goto(BASE + "/sign-in"); await p.fill("#password", "wrongpass1"); await p.click("button[type=submit]");
await p.waitForSelector("text=Invalid email or password");
ok(true, "wrong password is rejected");
await b.close();
console.log("All smoke checks passed");
