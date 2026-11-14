import { SiteFooter, SiteHeader } from "@/components/marketing/site-header";
import { PricingTable } from "@/components/marketing/pricing-table";

export const metadata = { title: "Pricing — Orbit" };

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pricing that grows with you</h1>
          <p className="mt-4 text-slate-600">All plans include the revenue dashboard. Cancel anytime from the billing portal.</p>
        </div>
        <div className="mt-14"><PricingTable /></div>
      </main>
      <SiteFooter />
    </>
  );
}
