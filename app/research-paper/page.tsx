import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Download, ExternalLink, MapPin, ShieldCheck } from "lucide-react"

const siteUrl = "https://shreebalajienterprises.live"

export const metadata: Metadata = {
  title: "MMR Property Guide | Shree Balaji Enterprises",
  description:
    "Explore Shree Balaji Enterprises' property listings and area guides across Ambernath and the wider Mumbai Metropolitan Region.",
  keywords: ["MMR property guide", "Ambernath property", "Mumbai Metropolitan Region property listings", "MahaRERA A51700023633"],
  openGraph: {
    title: "MMR Property Guide | Shree Balaji Enterprises",
    description: "Property listings, locations and business details from Shree Balaji Enterprises.",
    url: `${siteUrl}/research-paper`,
  },
  alternates: { canonical: `${siteUrl}/research-paper` },
}

export default function ResearchPaperPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MMR Property Guide",
    description: "A guide to property listings and locations served by Shree Balaji Enterprises.",
    publisher: { "@type": "RealEstateAgent", name: "Shree Balaji Enterprises", url: siteUrl },
    url: `${siteUrl}/research-paper`,
  }

  return (
    <main className="bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="border-b border-border/70 bg-[#f7f6f2] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Property guide · Mumbai Metropolitan Region</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[48px]">Explore property across Mumbai and the wider MMR.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Browse current listings, explore area pages and contact the Ambernath-based team. This guide describes the resources available on this website; it does not provide independent market forecasts.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/research-paper.pdf" download="SBE_MMR_Property_Guide.pdf" className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Download className="h-4 w-4" /> Download guide</a>
            <a href="/research-paper.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-semibold hover:border-primary hover:text-primary"><ExternalLink className="h-4 w-4" /> Open PDF</a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-12 lg:gap-14">
        <section className="lg:col-span-7">
          <h2 className="text-2xl font-semibold tracking-tight">Start with an area</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The locations directory links to property searches and local guides. Availability and listing information can change; contact the office to discuss a specific property.</p>
          <Link href="/locations" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><MapPin className="h-4 w-4" /> Browse MMR locations <ArrowRight className="h-4 w-4" /></Link>
          <div className="mt-8 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0 sm:gap-x-8">
            {[
              ["Buy", "Homes and commercial property listings", "/buy"],
              ["Rent", "Residential and commercial rentals", "/rent"],
              ["Sell", "Send the team your property details", "/sell"],
              ["Home loans", "Read about the loan guidance service", "/home-loans"],
            ].map(([title, detail, href]) => (
              <Link key={title} href={href} className="group flex items-center justify-between gap-4 py-4 sm:border-b sm:border-border sm:py-5">
                <span><span className="block font-semibold group-hover:text-primary">{title}</span><span className="mt-1 block text-sm text-muted-foreground">{detail}</span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        <aside className="h-fit border-t border-border pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-semibold">Business details</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Shree Balaji Enterprises is based in Ambernath and was established in 2016.</p></div></div>
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-border py-4 text-sm">
            <dt className="text-muted-foreground">MahaRERA registration</dt><dd className="text-right font-mono font-semibold">A51700023633</dd>
            <dt className="text-muted-foreground">Office</dt><dd className="text-right font-semibold">Ambernath West</dd>
            <dt className="text-muted-foreground">Coverage</dt><dd className="text-right font-semibold">Mumbai &amp; MMR</dd>
          </dl>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Contact the office <ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </div>
    </main>
  )
}
