"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Search } from "lucide-react"

const areas = ["Ambernath", "Badlapur", "Thane", "Navi Mumbai", "Mumbai"]

export function HomeHero() {
  const [intent, setIntent] = useState<"buy" | "rent">("buy")
  const listingPath = intent === "buy" ? "/buy" : "/rent"

  return (
    <main className="flex-1 bg-[#f5f3ee] text-[#18253b]">
      <section className="mx-auto grid min-h-[calc(100svh-60px)] max-w-[1440px] items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-12 lg:py-12 xl:px-16">
        <div className="relative z-10 max-w-[610px] lg:py-8">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#536277] sm:text-xs">
            <span className="h-px w-8 bg-[#d99524]" aria-hidden="true" />
            Property guidance across Mumbai &amp; the MMR
          </p>

          <h1 className="max-w-[620px] font-serif text-[clamp(3.35rem,6.2vw,5.6rem)] font-normal leading-[0.98] tracking-[-0.055em] text-[#17243a]">
            Find your place in <span className="italic text-[#1458a4]">the region.</span>
          </h1>

          <p className="mt-6 max-w-[490px] text-base leading-7 text-[#536277] sm:text-lg sm:leading-8">
            From Ambernath and Badlapur to Mumbai and Navi Mumbai, make your next property move with people who know the neighbourhoods in between.
          </p>

          <div className="mt-9 max-w-[560px] border-y border-[#c9c8c1] py-4">
            <div className="mb-4 flex items-center gap-6" role="group" aria-label="Choose what you want to do">
              <button
                type="button"
                aria-pressed={intent === "buy"}
                onClick={() => setIntent("buy")}
                className={`min-h-11 border-b-2 px-1 text-sm font-bold transition-colors ${intent === "buy" ? "border-[#1458a4] text-[#1458a4]" : "border-transparent text-[#697487] hover:text-[#17243a]"}`}
              >
                Buy
              </button>
              <button
                type="button"
                aria-pressed={intent === "rent"}
                onClick={() => setIntent("rent")}
                className={`min-h-11 border-b-2 px-1 text-sm font-bold transition-colors ${intent === "rent" ? "border-[#1458a4] text-[#1458a4]" : "border-transparent text-[#697487] hover:text-[#17243a]"}`}
              >
                Rent
              </button>
              <Link href="/sell" className="ml-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#17243a] transition-colors hover:text-[#1458a4]">
                Sell a property <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <form action={listingPath} method="get" className="flex min-h-[58px] items-stretch border border-[#b9c0c9] bg-white focus-within:border-[#1458a4] focus-within:ring-2 focus-within:ring-[#1458a4]/15">
              <label htmlFor="home-location" className="sr-only">City or neighbourhood</label>
              <input
                id="home-location"
                name="location"
                type="search"
                placeholder="City or neighbourhood"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#17243a] outline-none placeholder:text-[#778191] sm:px-5 sm:text-base"
              />
              <button type="submit" className="inline-flex min-w-[58px] items-center justify-center gap-2 bg-[#1458a4] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0d477f] sm:px-5">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
                <span className="sr-only sm:hidden">Search properties</span>
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[13px]">
              <span className="font-semibold text-[#697487]">Explore</span>
              {areas.map((area) => (
                <Link
                  key={area}
                  href={`${listingPath}?location=${encodeURIComponent(area)}`}
                  className="min-h-8 border-b border-transparent py-1 text-[#263b56] transition-colors hover:border-[#d99524] hover:text-[#1458a4]"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8491]">
            Local roots <span className="px-2 text-[#d99524]">/</span> MMR-wide perspective
          </p>
        </div>

        <div className="relative mx-auto h-[390px] w-full max-w-[650px] sm:h-[480px] lg:h-[570px] lg:max-w-none">
          <figure className="absolute right-0 top-0 h-[82%] w-[77%] overflow-hidden bg-[#d9ddd9]">
            <Image
              src="/images/location/panvel.webp"
              alt="Residential towers among green hills in Panvel"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, (min-width: 640px) 78vw, 88vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#101b27]/65 to-transparent" aria-hidden="true" />
            <figcaption className="absolute bottom-5 left-5 text-white sm:bottom-6 sm:left-7">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">South-east corridor</span>
              <span className="mt-1 block font-serif text-3xl leading-none sm:text-4xl">Panvel</span>
            </figcaption>
          </figure>

          <figure className="absolute bottom-0 left-0 h-[39%] w-[45%] overflow-hidden border-[6px] border-[#f5f3ee] bg-[#283d4a] sm:border-[9px]">
            <Image
              src="/images/location/ambernath.webp"
              alt="The historic Ambreshwar Shiva Temple in Ambernath"
              fill
              sizes="(min-width: 1024px) 22vw, 40vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#101b27]/70 to-transparent" aria-hidden="true" />
            <figcaption className="absolute bottom-3 left-3 text-sm font-semibold text-white sm:bottom-4 sm:left-4 sm:text-base">Ambernath</figcaption>
          </figure>

          <div className="absolute bottom-[4%] right-0 hidden border-l border-[#d99524] pl-3 text-[10px] font-semibold uppercase leading-5 tracking-[0.15em] text-[#596779] sm:block">
            A wider view<br />of home
          </div>
        </div>
      </section>
    </main>
  )
}
