import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <Link href="/#features" className="hover:text-slate-900">Features</Link>
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
            <Link href="/#testimonials" className="hover:text-slate-900">Customers</Link>
            <Link href="/#faq" className="hover:text-slate-900">FAQ</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/sign-in" variant="ghost" size="sm">Sign in</ButtonLink>
          <ButtonLink href="/sign-up" size="sm">Start free</ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-slate-500 md:flex-row">
        <Logo />
        <p>© 2026 Orbit. Next.js SaaS starter by Tran Cong Tien · <a className="underline hover:text-slate-900" href="https://www.fiverr.com/optimus2003">Hire me on Fiverr</a></p>
      </div>
    </footer>
  );
}
