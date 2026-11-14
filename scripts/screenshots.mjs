// Captures README screenshots from a running app: `pnpm start` then `CHROME_PATH=/usr/bin/google-chrome pnpm screenshots`
import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = process.env.APP_URL ?? "http://localhost:3123";
const OUT = "docs/screenshots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const shot = async (name, opts = {}) => {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${name}.png`, ...opts });
  console.log("saved", name);
};

await page.goto(BASE + "/");
await shot("landing", { fullPage: false });
await shot("landing-full", { fullPage: true });
await page.goto(BASE + "/pricing");
await shot("pricing");
await page.goto(BASE + "/sign-in");
await shot("sign-in");
await page.click("button[type=submit]");
await page.waitForURL("**/dashboard");
await shot("dashboard");
{
  const box = await page.locator(".recharts-surface").first().boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.move(box.x + box.width * 0.78, box.y + box.height * 0.45, { steps: 8 });
    await page.waitForTimeout(600);
  }
}
await shot("dashboard-tooltip");
await page.goto(BASE + "/dashboard");
await shot("dashboard-full", { fullPage: true });
await page.goto(BASE + "/dashboard/customers");
await shot("customers");
const drawerId = process.env.DRAWER_CUSTOMER_ID ?? "187";
await page.goto(BASE + "/dashboard/customers?c=" + drawerId);
await shot("customer-drawer");
await page.goto(BASE + "/dashboard/customers?q=juniper");
await shot("customers-search");
await page.goto(BASE + "/dashboard/team");
await shot("team");
await page.fill("input[name=email]", "sam.rivera@northwind.io");
await page.selectOption("select[name=role]", "admin");
await page.getByRole("button", { name: "Invite", exact: true }).click();
await page.waitForSelector("text=Invitation sent");
await shot("team-invite");
await page.goto(BASE + "/dashboard/billing");
await shot("billing");
await shot("billing-invoices", { fullPage: true });
await page.goto(BASE + "/dashboard/activity");
await shot("activity");
await page.goto(BASE + "/dashboard/settings");
await shot("settings");
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const m = await mobile.newPage();
await m.goto(BASE + "/");
await m.waitForLoadState("networkidle");
await m.screenshot({ path: `${OUT}/landing-mobile.png` });
console.log("saved landing-mobile");
await browser.close();
