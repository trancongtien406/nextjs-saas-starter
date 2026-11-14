import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function timeAgo(date: Date, now = new Date()): string {
  const s = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (s < 60) return "just now";
  const units: [number, string][] = [[31536000, "y"], [2592000, "mo"], [86400, "d"], [3600, "h"], [60, "m"]];
  for (const [sec, label] of units) if (s >= sec) return `${Math.floor(s / sec)}${label} ago`;
  return "just now";
}

export const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
