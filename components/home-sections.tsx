"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  Compass,
  FileCheck2,
  Home,
  KeyRound,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react"
import { BuyListingCard } from "@/components/buy-listing-card"
import { RentListingCard } from "@/components/rent-listing-card"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { useBuyProperties, useRentProperties } from "@/hooks/use-properties"
import { CURATED_RENT_PROPERTIES } from "@/lib/rent-data"

type PortfolioTab = "buy" | "rent" | "townships"

const SERVICE_PATHWAYS = [
  {
    title: "Buy a Residence",
    description:
      "Explore apartments, houses, and residential projects across Mumbai and the wider MMR.",
    href: "/buy",
    cta: "Browse properties",
    icon: Home,
  },
  {
    title: "Rent & Leasing",
    description:
      "Browse residential flats and commercial spaces with leave-and-license support.",
    href: "/rent",
    cta: "View rentals",
    icon: KeyRound,
  },
  {
    title: "Commercial & Industrial",
    description:
      "Retail shops, office units, business hubs, and MIDC industrial properties across the corridor.",
    href: "/buy?propertyType=Commercial",
    cta: "Explore commercial",
    icon: Building2,
  },
  {
    title: "Home Loan Guidance",
    description:
      "Understand home loan eligibility, bank documentation, and sanction steps for your purchase.",
    href: "/home-loans",
    cta: "Compare options",
    icon: Calculator,
  },
]

const MMR_COMMUNITIES = [
  {
    name: "Navi Mumbai",
    corridor: "Harbour & Commercial Hub",
    summary:
      "Explore planned sectors, Vashi commercial nodes, and residential developments across Navi Mumbai.",
    image: "/images/location/navi-mumbai.webp",
    alt: "Navi Mumbai commercial skyline and wide avenues",
    href: "/locations#navi-mumbai",
    searchHref: "/buy?q=Navi+Mumbai",
    position: "center 52%",
  },
  {
    name: "Dombivli",
    corridor: "Central MMR Townships",
    summary:
      "Established family neighbourhoods and integrated residential townships with central rail access.",
    image: "/images/properties/dombivli/runwal-garden-city/exterior.jpg",
    alt: "Residential and business towers at Runwal Garden City in Dombivli",
    href: "/locations#dombivli",
    searchHref: "/buy?location=Dombivli",
    position: "center 35%",
  },
  {
    name: "Vasai–Virar",
    corridor: "Western Suburban Belt",
    summary:
      "Expansive western residential communities connecting coastal green belts to metropolitan rail.",
    image: "/images/location/vasai.webp",
    alt: "Aerial panorama across Vasai and Virar residential developments",
    href: "/locations#vasai",
    searchHref: "/buy?q=Vasai",
    position: "center 50%",
  },
  {
    name: "Mira Road",
    corridor: "Western Express Corridor",
    summary:
      "High-rise residential societies along the western highway belt serving daily Mumbai commuters.",
    image: "/images/location/mira-road.webp",
    alt: "Modern high-rise residential towers across Mira Road",
    href: "/locations#mira-road",
    searchHref: "/buy?q=Mira+Road",
    position: "center 45%",
  },
  {
    name: "Badlapur",
    corridor: "Eastern Growth Belt",
    summary:
      "Value-driven residential homes framed by hills and the green Barvi river corridor.",
    image: "/images/location/badlapur.webp",
    alt: "Barvi river cascades and green hills in Badlapur",
    href: "/locations#badlapur",
    searchHref: "/buy?location=Badlapur",
    position: "center 30%",
  },
  {
    name: "Ambernath",
    corridor: "Eastern Suburbs & HQ",
    summary:
      "Civic neighbourhoods, gated residential projects, and industrial belts around SBE's headquarters.",
    image: "/images/location/ambernath.webp",
    alt: "Historic carved stone facade of Ambreshwar Temple in Ambernath",
    href: "/locations#ambernath",
    searchHref: "/buy?location=Ambernath",
    position: "center 45%",
  },
]

const ADVISORY_PILLARS = [
  {
    title: "MahaRERA & Title Verification",
    detail:
      "Screening project registrations, ownership documentation, and statutory approvals prior to shortlisting.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Process & Pricing",
    detail:
      "Clear property comparisons, documented brokerage terms, and coordinated site inspections.",
    icon: FileCheck2,
  },
  {
    title: "Financing & Registration Guidance",
    detail:
      "Practical support for home loan documentation and sub-registrar deed completion.",
    icon: Landmark,
  },
]

const PREFERRED_BUY_IDS = [13, 10, 7, 9]
const PREFERRED_TOWNSHIP_IDS = [13, 10, 11, 5]
const PREFERRED_RENT_IDS = [101, 102, 106, 107]

export function HomeSections() {
  const [activePortfolioTab, setActivePortfolioTab] = useState<PortfolioTab>("buy")

  const buyProperties = useBuyProperties()
  const adminRentals = useRentProperties()

  const rentalList = useMemo(() => {
    if (adminRentals && adminRentals.length > 0) {
      const seen = new Set(adminRentals.map((p) => p.id))
      return [
        ...adminRentals,
        ...CURATED_RENT_PROPERTIES.filter((p) => !seen.has(p.id)),
      ]
    }
    return CURATED_RENT_PROPERTIES
  }, [adminRentals])

  const displayedBuy = useMemo(() => {
    const preferredOrder =
      activePortfolioTab === "townships" ? PREFERRED_TOWNSHIP_IDS : PREFERRED_BUY_IDS
    const prioritized = preferredOrder
      .map((id) => buyProperties.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
    const remainder = buyProperties.filter(
      (p) => p.isFeatured && !preferredOrder.includes(p.id)
    )
    return [...prioritized, ...remainder].slice(0, 4)
  }, [buyProperties, activePortfolioTab])

  const displayedRent = useMemo(() => {
    const prioritized = PREFERRED_RENT_IDS.map((id) =>
      rentalList.find((p) => p.id === id)
    ).filter((p): p is NonNullable<typeof p> => Boolean(p))
    const remainder = rentalList.filter((p) => !PREFERRED_RENT_IDS.includes(p.id))
    return [...prioritized, ...remainder].slice(0, 4)
  }, [rentalList])

  return (
    <div className="bg-background text-foreground">
      {/* ── 1. Betterhomes-Style Quick Advisory Pathways ───────────────── */}
      <section
        id="services"
        aria-label="Real estate services across Mumbai and MMR"
        className="border-b border-border/70 bg-background py-10 sm:py-12"
      >
        <div className="mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_PATHWAYS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                >
                  <div>
                    <div className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-base font-bold tracking-tight text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span>{item.cta}</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 2. Compass & Betterhomes Curated Inventory Showcase ────────── */}
      <section className="border-b border-border/70 bg-slate-50/70 py-14 dark:bg-muted/20 sm:py-16">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Verified Portfolio
              </p>
              <h2 className="font-brand mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Current Listings Across MMR
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Browse residential homes, township projects, and rental listings handled directly by
                our advisory team.
              </p>
            </div>

            {/* Clean Segmented Portfolio Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex rounded-lg border border-border bg-card p-1 shadow-2xs"
                role="tablist"
                aria-label="Filter featured inventory"
              >
                {(
                  [
                    { id: "buy", label: "For Sale" },
                    { id: "townships", label: "Townships" },
                    { id: "rent", label: "For Rent" },
                  ] as const
                ).map((tab) => {
                  const active = activePortfolioTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActivePortfolioTab(tab.id)}
                      className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all sm:text-[13px] ${
                        active
                          ? "bg-foreground text-background shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <Link
                href={activePortfolioTab === "rent" ? "/rent" : "/buy"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline sm:text-sm"
              >
                <span>
                  {activePortfolioTab === "rent" ? "All rentals" : "View all properties"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activePortfolioTab === "rent"
              ? displayedRent.map((property) => (
                  <RentListingCard key={property.id} property={property} />
                ))
              : displayedBuy.map((property) => (
                  <BuyListingCard key={property.id} property={property} />
                ))}
          </div>
        </div>
      </section>

      {/* ── 3. haus & haus Regional Communities Showcase ───────────────── */}
      <section className="border-b border-border/70 bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                Regional Coverage
              </p>
              <h2 className="font-brand mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Neighbourhoods Across Mumbai &amp; MMR
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Explore area guides and active property markets across harbour, western, and
                central corridors.
              </p>
            </div>

            <Link
              href="/locations"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline sm:text-sm"
            >
              <span>Explore all 13+ areas</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MMR_COMMUNITIES.map((area) => (
              <article
                key={area.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_14px_34px_rgba(15,23,42,0.07)]"
              >
                <Link
                  href={area.searchHref}
                  className="relative block aspect-[16/10] w-full overflow-hidden bg-muted"
                >
                  <Image
                    src={area.image}
                    alt={area.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: area.position }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        {area.corridor}
                      </p>
                      <h3 className="font-brand text-xl font-bold tracking-tight">
                        {area.name}
                      </h3>
                    </div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors group-hover:bg-primary">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {area.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3.5 text-xs font-semibold">
                    <Link
                      href={area.searchHref}
                      className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-primary"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>Browse properties</span>
                    </Link>
                    <Link
                      href={area.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Area guide
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Knight Frank & Betterhomes Institutional Advisory ───────── */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left: Grounded Advisory Principles */}
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Advisory Practice &middot; Est. 2016
              </p>
              <h2 className="font-brand mt-2 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2.15rem]">
                Straightforward real estate guidance backed by clear documentation.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                Founded by Anju Jangiti in 2016, Shree Balaji Enterprises assists homebuyers,
                tenants, commercial enterprises, and property owners from initial site inspection
                through deed registration.
              </p>

              <div className="mt-7 space-y-5">
                {ADVISORY_PILLARS.map((pillar) => {
                  const Icon = pillar.icon
                  return (
                    <div key={pillar.title} className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-slate-50 text-primary dark:bg-muted">
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground sm:text-[15px]">
                          {pillar.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                          {pillar.detail}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Verified Practice Credentials & Research Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-slate-50/80 p-6 dark:bg-muted/30 sm:p-8">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Practice Credentials
                    </p>
                    <p className="font-brand mt-0.5 text-lg font-bold text-foreground">
                      Shree Balaji Enterprises
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    MahaRERA
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-left">
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Registration No.
                    </dt>
                    <dd className="mt-0.5 font-mono text-sm font-bold text-foreground">
                      A51700023633
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Established
                    </dt>
                    <dd className="mt-0.5 text-sm font-bold text-foreground">
                      2016 (Ambernath HQ)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Asset Classes
                    </dt>
                    <dd className="mt-0.5 text-sm font-bold text-foreground">
                      Residential &amp; Commercial
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Regional Focus
                    </dt>
                    <dd className="mt-0.5 text-sm font-bold text-foreground">
                      Across Mumbai &amp; MMR
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col gap-2.5 border-t border-border/80 pt-5 sm:flex-row">
                  <Link
                    href="/about"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    <span>About Our Practice</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/research-paper"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>MMR Research Paper</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── 5. Direct Consultation Closing Banner ──────────────────── */}
          <div className="mt-14 rounded-2xl bg-[#101e33] px-6 py-9 text-white sm:mt-16 sm:px-10 sm:py-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#60a5fa]">
                  Speak With An Advisor
                </p>
                <h2 className="font-brand mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Planning to buy, rent, or sell in Mumbai &amp; MMR?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Tell us your requirements and preferred MMR localities for a curated shortlist and
                  site visits.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#006aff] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0057d6]"
                >
                  <span>Schedule Consultation</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://wa.me/917767805544?text=Hello%20Shree%20Balaji%20Enterprises%2C%20I%20would%20like%20assistance%20finding%20a%20property."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
                >
                  <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
