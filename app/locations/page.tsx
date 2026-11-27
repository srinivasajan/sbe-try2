import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Locations Across Mumbai & MMR | Shree Balaji Enterprises",
  description: "Explore property listings and location guides across Ambernath and the wider Mumbai Metropolitan Region.",
  alternates: { canonical: "https://shreebalajienterprises.live/locations" },
}

const locations = [
  { id: "ambernath", name: "Ambernath", region: "Thane District", image: "/images/location/ambernath.jpg", alt: "Ambarnath Shiva Temple in Ambernath", focus: "center", guide: "Our office is based in Ambernath West.", photo: true },
  { id: "badlapur", name: "Badlapur", region: "Thane District", image: "/images/location/badlapur.jpg", alt: "Waterfall and green landscape near Badlapur", focus: "center 30%", guide: "Browse the current listings and location information for Badlapur.", photo: true },
  { id: "ulhasnagar", name: "Ulhasnagar", region: "Thane District", guide: "Browse the current listings and location information for Ulhasnagar." },
  { id: "kalyan", name: "Kalyan", region: "Thane District", guide: "Browse the current listings and location information for Kalyan." },
  { id: "dombivli", name: "Dombivli", region: "Thane District", image: "/images/properties/dombivli/runwal-garden-city/exterior.jpg", alt: "Residential towers at Runwal Garden City in Dombivli", focus: "center 35%", guide: "Browse the current listings and location information for Dombivli.", photo: true },
  { id: "thane", name: "Thane", region: "Thane District", guide: "Browse the current listings and location information for Thane." },
  { id: "mumbai", name: "Mumbai", region: "Mumbai District", image: "/images/location/mumbai.jpg", alt: "Gateway of India in Mumbai", focus: "center", guide: "Browse the current listings and location information for Mumbai.", photo: true },
  { id: "navi-mumbai", name: "Navi Mumbai", region: "Raigad District", image: "/images/location/navi-mumbai.jpg", alt: "Navi Mumbai commercial district and city skyline", focus: "center", guide: "Browse the current listings and location information for Navi Mumbai.", photo: true },
  { id: "panvel", name: "Panvel", region: "Raigad District", image: "/images/location/panvel.jpg", alt: "Residential towers in Panvel", focus: "center", guide: "Browse the current listings and location information for Panvel.", photo: true },
  { id: "titwala", name: "Titwala", region: "Thane District", image: "/images/location/titwala.jpg", alt: "Residential neighbourhood in Titwala", focus: "center", guide: "Browse the current listings and location information for Titwala.", photo: true },
  { id: "khopoli", name: "Khopoli", region: "Raigad District", image: "/images/location/khopoli.jpg", alt: "Road through the green landscape near Khopoli", focus: "center", guide: "Browse the current listings and location information for Khopoli.", photo: true },
  { id: "karjat", name: "Karjat", region: "Raigad District", image: "/images/location/karjat.jpg", alt: "Waterfall and forest landscape near Karjat", focus: "center", guide: "Browse the current listings and location information for Karjat.", photo: true },
  { id: "murbad", name: "Murbad", region: "Thane District", image: "/images/location/murbad.jpg", alt: "River and hills near Murbad", focus: "center", guide: "Browse the current listings and location information for Murbad.", photo: true },
  { id: "vasai", name: "Vasai", region: "Palghar District", image: "/images/location/vasai.jpg", alt: "Aerial view of residential neighbourhoods in Vasai", focus: "center", guide: "Browse the current listings and location information for Vasai.", photo: true },
  { id: "mira-road", name: "Mira Road", region: "Thane District", image: "/images/location/mira-road.jpg", alt: "Residential buildings in Mira Road", focus: "center", guide: "Browse the current listings and location information for Mira Road.", photo: true },
]

export default function LocationsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Locations in the Shree Balaji Enterprises directory",
    numberOfItems: locations.length,
    itemListElement: locations.map((location, index) => ({
      "@type": "ListItem", position: index + 1, name: location.name,
      url: `https://shreebalajienterprises.live/locations#${location.id}`,
    })),
  }

  return (
    <main className="bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <section className="border-b border-border/70 bg-[#f7f6f2] py-11 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Location directory · Mumbai Metropolitan Region</p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[46px]">Explore places across Mumbai and the wider MMR.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Choose a location to view available property listings. Availability varies by area; contact us if you are looking for a specific place.</p></div>
            <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline">Ask about an area <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="py-9 sm:py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-12">
            {locations.map((loc, index) => {
              const className = index === 0 ? "lg:col-span-6" : index < 4 ? "lg:col-span-3" : index % 5 === 0 ? "lg:col-span-6" : "lg:col-span-3"
              const buyHref = `/buy?q=${encodeURIComponent(loc.name)}`
              return (
                <article key={loc.id} id={loc.id} className={`group min-w-0 scroll-mt-24 ${className}`}>
                  <Link href={buyHref} className={`relative block aspect-[16/9] overflow-hidden ${loc.photo ? "bg-muted" : "bg-[#f2eee5]"}`}>
                    {loc.photo && loc.image ? <Image src={loc.image} alt={loc.alt ?? loc.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" style={{ objectPosition: loc.focus }} /> : <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,61,117,0.08),transparent_55%,rgba(217,119,6,0.1))]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white sm:bottom-5 sm:left-5"><span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">{loc.region}</span><span className="mt-1 block text-2xl font-semibold tracking-tight sm:text-3xl">{loc.name}</span></span><span className="inline-flex h-9 w-9 items-center justify-center border border-white/60 transition-colors group-hover:bg-white group-hover:text-foreground"><ArrowRight className="h-4 w-4" /></span></div>
                  </Link>
                  <div className="flex flex-col gap-2 border-b border-border/80 py-3.5">
                    <div className="min-w-0"><p className="text-sm leading-relaxed text-muted-foreground">{loc.guide}</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{loc.region}</p></div>
                    <div className="flex gap-4 text-xs font-semibold"><Link href={buyHref} className="text-primary hover:underline">Buy</Link><Link href={`/rent?q=${encodeURIComponent(loc.name)}`} className="text-primary hover:underline">Rent</Link><Link href={`/locations#${loc.id}`} className="text-foreground/70 hover:text-primary">Guide</Link></div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      <section className="border-t border-border/70 bg-[#f7f6f2] py-10 sm:py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-5 px-4 sm:px-8 md:flex-row md:items-center">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Based in Ambernath · Serving Mumbai &amp; MMR</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Looking for a property in a specific area?</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Share the location and property type you have in mind.</p></div>
          <Link href="/contact" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Contact the team <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  )
}
