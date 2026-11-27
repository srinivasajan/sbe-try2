"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useCallback, useRef } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  IndianRupee,
  MapPin,
  Pause,
  Play,
  Search,
  ShieldCheck,
} from "lucide-react"

type Intent = "buy" | "rent" | "commercial"

interface HeroLocation {
  name: string
  region: string
  landmark: string
  image: string
  alt: string
  position: string
}

interface FilterOption {
  label: string
  value: string
}

const HERO_LOCATIONS: HeroLocation[] = [
  {
    name: "Vasai–Virar",
    region: "Western MMR",
    landmark: "Residential Communities & Coastal Belt",
    image: "/images/location/vasai.webp",
    alt: "Aerial panorama of residential communities across Vasai and Virar",
    position: "center 48%",
  },
  {
    name: "Navi Mumbai",
    region: "Harbour Corridor",
    landmark: "Vashi Commercial & Urban Skyline",
    image: "/images/location/navi-mumbai.webp",
    alt: "Navi Mumbai commercial skyline and wide avenues in Vashi after dusk",
    position: "center 50%",
  },
  {
    name: "Mira Road",
    region: "Western Express Belt",
    landmark: "High-Rise Residential Corridors",
    image: "/images/location/mira-road.webp",
    alt: "Evening panorama of modern high-rise residential towers across Mira Road",
    position: "center 44%",
  },
  {
    name: "Titwala",
    region: "Central Line North",
    landmark: "Lake Precinct & Emerging Townships",
    image: "/images/location/titwala.webp",
    alt: "Lakefront greens and residential buildings in Titwala",
    position: "center 50%",
  },
  {
    name: "Ambernath",
    region: "Eastern MMR Suburbs",
    landmark: "Ambreshwar Heritage & Civic Centre",
    image: "/images/location/ambernath.webp",
    alt: "Historic carved stone architecture of Ambreshwar Temple in Ambernath",
    position: "center 42%",
  },
  {
    name: "Badlapur",
    region: "Eastern Growth Belt",
    landmark: "Barvi Dam & Sahyadri Reserves",
    image: "/images/location/badlapur.webp",
    alt: "Barvi river cascades surrounded by monsoon greenery near Badlapur",
    position: "center 32%",
  },
  {
    name: "Khopoli",
    region: "Mumbai–Pune Corridor",
    landmark: "Expressway & Industrial Gateway",
    image: "/images/location/khopoli.webp",
    alt: "Mumbai-Pune Expressway winding through green hills near Khopoli",
    position: "center 50%",
  },
]

const PROPERTY_TYPES_BY_INTENT: Record<Intent, FilterOption[]> = {
  buy: [
    { label: "All property types", value: "" },
    { label: "Apartment / flat", value: "Apartment" },
    { label: "House / villa", value: "House" },
    { label: "Shop / office", value: "Commercial" },
    { label: "Industrial", value: "Industrial" },
    { label: "Plot / land", value: "Plot" },
  ],
  rent: [
    { label: "All property types", value: "" },
    { label: "Apartment / flat", value: "Apartment" },
    { label: "House / villa", value: "House" },
    { label: "Shop / office", value: "Commercial" },
    { label: "Industrial", value: "Industrial" },
  ],
  commercial: [
    { label: "Commercial & industrial", value: "Commercial" },
    { label: "Shop / retail / office", value: "Commercial" },
    { label: "Industrial shed / warehouse", value: "Industrial" },
    { label: "Commercial plot / land", value: "Plot" },
  ],
}

const BUDGETS_BY_INTENT: Record<Intent, FilterOption[]> = {
  buy: [
    { label: "Any budget", value: "" },
    { label: "Under ₹50 lakh", value: ":5000000" },
    { label: "₹50 lakh – ₹1 crore", value: "5000000:10000000" },
    { label: "₹1 – ₹2 crore", value: "10000000:20000000" },
    { label: "Above ₹2 crore", value: "20000000:" },
  ],
  rent: [
    { label: "Any monthly rent", value: "" },
    { label: "Under ₹15,000 / mo", value: ":15000" },
    { label: "₹15,000 – ₹30,000 / mo", value: "15000:30000" },
    { label: "₹30,000 – ₹60,000 / mo", value: "30000:60000" },
    { label: "Above ₹60,000 / mo", value: "60000:" },
  ],
  commercial: [
    { label: "Any budget", value: "" },
    { label: "Under ₹50 lakh", value: ":5000000" },
    { label: "₹50 lakh – ₹1 crore", value: "5000000:10000000" },
    { label: "₹1 – ₹2 crore", value: "10000000:20000000" },
    { label: "Above ₹2 crore", value: "20000000:" },
  ],
}

const QUICK_CORRIDORS = [
  { label: "Mumbai", href: "/buy?location=Mumbai" },
  { label: "Navi Mumbai", href: "/buy?location=Navi+Mumbai" },
  { label: "Thane", href: "/buy?location=Thane" },
  { label: "Dombivli", href: "/buy?location=Dombivli" },
  { label: "Badlapur", href: "/buy?location=Badlapur" },
  { label: "Ambernath", href: "/buy?location=Ambernath" },
]

export function HomeHero() {
  const [intent, setIntent] = useState<Intent>("buy")
  const [selectedPropertyType, setSelectedPropertyType] = useState<FilterOption>(
    PROPERTY_TYPES_BY_INTENT.buy[0]
  )
  const [selectedBudget, setSelectedBudget] = useState<FilterOption>(
    BUDGETS_BY_INTENT.buy[0]
  )
  const [openMenu, setOpenMenu] = useState<"type" | "budget" | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [manualPaused, setManualPaused] = useState(false)

  const fadeTimeoutRef = useRef<number | null>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  const totalSlides = HERO_LOCATIONS.length
  const nextIndex = (activeIndex + 1) % totalSlides
  const currentSlide = HERO_LOCATIONS[activeIndex]
  const listingPath = intent === "rent" ? "/rent" : "/buy"

  const handleIntentChange = (nextIntent: Intent) => {
    setIntent(nextIntent)
    setSelectedPropertyType(PROPERTY_TYPES_BY_INTENT[nextIntent][0])
    setSelectedBudget(BUDGETS_BY_INTENT[nextIntent][0])
    setOpenMenu(null)
  }

  const goToSlide = useCallback(
    (target: number) => {
      if (target === activeIndex) return
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
      }
      setPrevIndex(activeIndex)
      setActiveIndex(target)
      fadeTimeoutRef.current = window.setTimeout(() => {
        setPrevIndex(null)
      }, 1200)
    },
    [activeIndex]
  )

  const stepSlide = useCallback(
    (direction: -1 | 1) => {
      const target = (activeIndex + direction + totalSlides) % totalSlides
      goToSlide(target)
    },
    [activeIndex, totalSlides, goToSlide]
  )

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (consoleRef.current && !consoleRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null)
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (isPaused || manualPaused || prefersReduced) return

    const handleVisibility = () => {
      setIsPaused(document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibility)

    const timer = window.setInterval(() => {
      stepSlide(1)
    }, 5500)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [isPaused, manualPaused, stepSlide])

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section
      className="relative isolate overflow-visible bg-[#101e33]"
      aria-label="Explore real estate across Mumbai and the Mumbai Metropolitan Region"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background photographic slideshow — mounts only current, previous & upcoming slides */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {HERO_LOCATIONS.map((location, index) => {
          const isCurrent = index === activeIndex
          const isPrevious = index === prevIndex
          const isUpcoming = index === nextIndex
          if (!isCurrent && !isPrevious && !isUpcoming) return null

          const zIndex = isCurrent ? 2 : isPrevious ? 1 : 0
          const opacity = isCurrent || isPrevious ? 1 : 0

          return (
            <div
              key={location.name}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none"
              style={{ zIndex, opacity }}
            >
              <Image
                src={location.image}
                alt={location.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={82}
                className="object-cover"
                style={{ objectPosition: location.position }}
              />
            </div>
          )
        })}

        {/* Directional gradient overlay protecting readability while preserving natural tones */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0d1b2e]/84 via-[#0d1b2e]/48 to-[#0d1b2e]/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0d1b2e]/74 via-transparent to-[#0d1b2e]/30" />
      </div>

      {/* Main foreground container */}
      <div className="relative z-20 mx-auto flex min-h-[580px] max-w-[1360px] flex-col justify-between px-4 pb-5 pt-10 sm:min-h-[600px] sm:px-8 sm:pb-6 sm:pt-12 lg:min-h-[620px] lg:px-12">
        {/* Top Hero Editorial Intro */}
        <div className="max-w-[740px] pt-1 sm:pt-3">
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85 sm:text-xs">
            <span className="h-[1.5px] w-5 bg-[#f59e0b]" aria-hidden="true" />
            Residential &middot; Commercial &middot; Industrial Advisory
          </p>

          <h1 className="font-brand text-[clamp(2.1rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white drop-shadow-xs">
            Find your place across{" "}
            <span className="text-[#60a5fa]">Mumbai &amp; MMR.</span>
          </h1>

          <p className="mt-3.5 max-w-[600px] text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base sm:leading-7">
            Independent advisory for buying, renting, and selling across Mumbai, Navi Mumbai,
            Thane, and the wider Mumbai Metropolitan Region.
          </p>
        </div>

        {/* Centerpiece: Compass & Betterhomes Streamlined Search Console */}
        <div className="mt-7 w-full sm:mt-9" ref={consoleRef}>
          <div className="w-full rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgba(8,20,38,0.42)] ring-1 ring-black/5">
            {/* Intent Switcher Row */}
            <div
              className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 px-4 sm:px-6"
              role="group"
              aria-label="Property search category"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                {(
                  [
                    { id: "buy", label: "Buy" },
                    { id: "rent", label: "Rent" },
                    { id: "commercial", label: "Commercial" },
                  ] as const
                ).map((tab) => {
                  const isActive = intent === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleIntentChange(tab.id)}
                      className={`relative inline-flex h-12 cursor-pointer items-center px-3 text-sm font-semibold transition-colors sm:px-4 ${
                        isActive ? "text-[#006aff]" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <span
                          className="absolute inset-x-2 bottom-0 h-[2.5px] rounded-full bg-[#006aff]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <Link
                href="/sell"
                className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-[#006aff] transition-colors hover:text-[#0055d4] sm:text-sm"
              >
                <span>Selling a property?</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Unified Search Fields */}
            <form
              action={listingPath}
              method="get"
              className="grid grid-cols-1 divide-y divide-slate-200/80 md:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_auto] lg:items-center lg:divide-x lg:divide-y-0 lg:p-2"
            >
              <input type="hidden" name="propertyType" value={selectedPropertyType.value} />
              <input type="hidden" name="budget" value={selectedBudget.value} />

              {/* 1. Location or Project Input */}
              <div className="flex items-center gap-3 px-4 py-3 md:col-span-2 lg:col-span-1 lg:px-4 lg:py-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#006aff]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="home-location"
                    className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                  >
                    Location or Project
                  </label>
                  <input
                    id="home-location"
                    name="q"
                    type="search"
                    placeholder="City, locality or project name..."
                    className="mt-0.5 h-6 w-full border-0 bg-transparent p-0 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 2. Property Type Accessible Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  id="home-property-type-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === "type"}
                  onClick={() => setOpenMenu((prev) => (prev === "type" ? null : "type"))}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-slate-50/70 lg:px-4 lg:py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        Property Type
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-medium text-slate-900">
                        {selectedPropertyType.label}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${
                      openMenu === "type" ? "rotate-180 text-[#006aff]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {openMenu === "type" && (
                  <ul
                    role="listbox"
                    aria-labelledby="home-property-type-trigger"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl"
                  >
                    {PROPERTY_TYPES_BY_INTENT[intent].map((option) => {
                      const active = option.label === selectedPropertyType.label
                      return (
                        <li key={option.label} role="option" aria-selected={active}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPropertyType(option)
                              setOpenMenu(null)
                            }}
                            className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                              active
                                ? "bg-blue-50/80 font-semibold text-[#006aff]"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{option.label}</span>
                            {active && <Check className="h-3.5 w-3.5 text-[#006aff]" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* 3. Budget Accessible Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  id="home-budget-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === "budget"}
                  onClick={() => setOpenMenu((prev) => (prev === "budget" ? null : "budget"))}
                  className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-slate-50/70 lg:px-4 lg:py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IndianRupee className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {intent === "rent" ? "Monthly Rent" : "Budget"}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-medium text-slate-900">
                        {selectedBudget.label}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${
                      openMenu === "budget" ? "rotate-180 text-[#006aff]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {openMenu === "budget" && (
                  <ul
                    role="listbox"
                    aria-labelledby="home-budget-trigger"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl"
                  >
                    {BUDGETS_BY_INTENT[intent].map((option) => {
                      const active = option.label === selectedBudget.label
                      return (
                        <li key={option.label} role="option" aria-selected={active}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBudget(option)
                              setOpenMenu(null)
                            }}
                            className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                              active
                                ? "bg-blue-50/80 font-semibold text-[#006aff]"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{option.label}</span>
                            {active && <Check className="h-3.5 w-3.5 text-[#006aff]" />}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* 4. Search Action Button */}
              <div className="p-2 md:col-span-2 lg:col-span-1 lg:p-0 lg:pl-2">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#006aff] px-7 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#0057d6] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006aff] lg:h-[54px] lg:w-auto"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sub-Console: Popular Corridors + Verified MahaRERA Badge */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-white/75">
                Explore:
              </span>
              {QUICK_CORRIDORS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-white/20 bg-[#0d1b2e]/55 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-md transition-colors hover:border-white/40 hover:bg-[#0d1b2e]/80"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <a
              href="https://maharera.maharashtra.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0d1b2e]/65 px-3.5 py-1 text-[11px] font-medium text-white/95 backdrop-blur-md transition-colors hover:bg-[#0d1b2e]/85"
              aria-label="Verify MahaRERA registration A51700023633"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#f59e0b]" aria-hidden="true" />
              <span>MahaRERA Reg: A51700023633</span>
              <span className="text-white/45" aria-hidden="true">
                &middot;
              </span>
              <span className="text-white/80">Est. 2016</span>
            </a>
          </div>
        </div>

        {/* Bottom Location Showcase Caption & Accessible Slideshow Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4 text-white">
          <div aria-live="polite" className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
              <p className="text-sm font-semibold tracking-wide text-white sm:text-base">
                {currentSlide.name}
              </p>
              <span className="text-xs text-white/60" aria-hidden="true">
                &middot;
              </span>
              <p className="text-xs font-medium text-white/80 sm:text-[13px]">
                {currentSlide.region} &mdash; {currentSlide.landmark}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Progress dots */}
            <div
              className="hidden items-center gap-1.5 sm:flex"
              role="group"
              aria-label="Choose a location photograph"
            >
              {HERO_LOCATIONS.map((location, index) => (
                <button
                  key={location.name}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Show ${location.name}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/35 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Slide index counter */}
            <span
              className="min-w-[44px] text-right font-mono text-[11px] font-medium tabular-nums text-white/80"
              aria-live="off"
            >
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(totalSlides).padStart(2, "0")}
            </span>

            {/* Navigation controls */}
            <div
              className="flex items-center gap-0.5 rounded-full border border-white/25 bg-[#0d1b2e]/50 p-0.5 backdrop-blur-md"
              role="group"
              aria-label="Location slideshow controls"
            >
              <button
                type="button"
                onClick={() => stepSlide(-1)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Previous location"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setManualPaused((prev) => !prev)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                aria-label={manualPaused ? "Resume location slideshow" : "Pause location slideshow"}
              >
                {manualPaused ? (
                  <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                ) : (
                  <Pause className="h-3 w-3" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => stepSlide(1)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Next location"
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
