import { cn, initials } from "@/lib/utils";

const GRADIENTS = ["from-indigo-500 to-violet-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-500", "from-rose-400 to-pink-500", "from-fuchsia-500 to-purple-600", "from-lime-400 to-emerald-500", "from-cyan-400 to-sky-600"];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const hash = [...name].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm", GRADIENTS[hash % GRADIENTS.length],
      size === "sm" && "h-8 w-8 text-xs", size === "md" && "h-10 w-10 text-sm", size === "lg" && "h-16 w-16 text-xl")}>
      {initials(name)}
    </span>
  );
}
