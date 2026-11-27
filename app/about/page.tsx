import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, Home, KeyRound, MapPin, Phone, ShieldCheck } from "lucide-react"
import { OFFICIAL_GOOGLE_MAPS_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About Us | Shree Balaji Enterprises — Ambernath & MMR",
  description:
    "Learn about Shree Balaji Enterprises, an Ambernath real estate practice established in 2016 and registered with MahaRERA (A51700023633).",
  openGraph: {
    title: "About Shree Balaji Enterprises",
    description: "A local real estate practice based in Ambernath, serving the wider Mumbai Metropolitan Region.",
    url: "https://shreebalajienterprises.live/about",
  },
}

const pathways = [
  { title: "Buy property", detail: "Residential and commercial listings across the region.", href: "/buy", icon: Home },
  { title: "Rent property", detail: "Residential and commercial rental listings.", href: "/rent", icon: KeyRound },
  { title: "Sell property", detail: "Share your property details with the team.", href: "/sell", icon: Building2 },
  { title: "Home loans", detail: "Information and assistance for the loan process.", href: "/home-loans", icon: ShieldCheck },
]

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/70 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">About Shree Balaji Enterprises</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[46px]">A local real estate practice, based in Ambernath and serving the wider MMR.</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Established in 2016, Shree Balaji Enterprises helps people explore property to buy, rent or sell across Mumbai and the Mumbai Metropolitan Region.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Contact the office <ArrowRight className="h-4 w-4" /></Link>
              <a href="tel:+917767805544" className="inline-flex h-11 items-center gap-2 border border-border px-5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"><Phone className="h-4 w-4" /> +91 77678 05544</a>
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image src="/images/location/ambernath.jpg" alt="Ambarnath Shiva Temple in Ambernath" fill priority sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-xs text-muted-foreground">Ambernath, where the practice is based.</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-border/70 bg-[#f7f6f2] py-10 sm:py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map(({ title, detail, href, icon: Icon }) => (
              <Link key={title} href={href} className="group flex gap-4 border-b border-border/80 py-5 first:pt-0 last:border-0 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 lg:border-b-0 lg:border-r lg:py-2 lg:pl-0 lg:pr-6 lg:last:border-r-0">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span><span className="block font-semibold group-hover:text-primary">{title}<ArrowRight className="ml-2 inline h-3.5 w-3.5" /></span><span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{detail}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Our practice</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Clear property information. A nearby point of contact.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The team works with buyers, tenants, sellers and property owners. Our listings cover homes, commercial spaces and other property types in Ambernath and across the wider MMR. Enquiries can be made online, by phone or in person at the office.
            </p>
            <Link href="/locations" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore locations <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="border-y border-border py-5 lg:col-span-5 lg:border-y-0 lg:border-l lg:py-1 lg:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Business details</p>
            <dl className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Established</dt><dd className="text-right font-semibold">2016</dd>
              <dt className="text-muted-foreground">Office</dt><dd className="text-right font-semibold">Ambernath West</dd>
              <dt className="text-muted-foreground">MahaRERA registration</dt><dd className="text-right font-mono text-xs font-semibold sm:text-sm">A51700023633</dd>
              <dt className="text-muted-foreground">Service area</dt><dd className="text-right font-semibold">Mumbai &amp; MMR</dd>
            </dl>
            <a href={OFFICIAL_GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-start gap-2 text-sm text-primary hover:underline"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />Shop No. 6, Vallabh Building, Avdhoot Residency, Chikhloli, Ambernath West 421505</a>
          </div>
        </div>
      </section>
    </main>
  )
}
