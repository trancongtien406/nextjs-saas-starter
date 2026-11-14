/** Only allow redirects back into the dashboard (prevents open redirects via ?next=). */
export function safeNext(value: unknown): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/dashboard") && !next.startsWith("//") && !next.includes("\\") ? next : "/dashboard";
}
