import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 shadow-md shadow-brand-600/30">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-white" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      Orbit
    </Link>
  );
}
