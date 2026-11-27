"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import type { PropertyData } from "@/lib/data"

interface BuyListingCardProps {
  property: PropertyData
  compact?: boolean
  highlighted?: boolean
  onHover?: (id: number | null) => void
}

export function BuyListingCard({
  property,
  compact = false,
  highlighted = false,
  onHover,
}: BuyListingCardProps) {
  const [saved, setSaved] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const href = `/buy/${property.id}`

  // Ensure raw document/spreadsheet screenshots are never displayed on property discovery cards
  const images = useMemo(() => {
    const raw = property.images?.length ? property.images : [property.image]
    const filtered = raw.filter(
      (img) =>
        !img.toLowerCase().includes("whatsapp-image-2026-10-29-at-5.55.04-pm") &&
        !img.toLowerCase().includes("dggtg.jpg")
    )
    return filtered.length > 0 ? filtered : [property.image]
  }, [property.images, property.image])

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((i) => (i - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIndex((i) => (i + 1) % images.length)
  }
  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(!saved)
  }
  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const msg = encodeURIComponent(
      `Hello Anju ji, I am interested in ${property.address}, ${property.city} (${displayPrice}). Please share more details and floor plans.`
    )
    window.open(`https://wa.me/917767805544?text=${msg}`, "_blank")
  }

  // Display "Price on Request" instead of repetitive "Contact for Price"
  const displayPrice =
    property.price === "Contact for Price" ? "Price on Request" : property.price

  // Format type with first letter capitalized (e.g. "house" -> "House")
  const formattedType = property.type
    ? property.type.charAt(0).toUpperCase() + property.type.slice(1)
    : "Apartment"

  // Specs: show only what actually exists — never fabricate
  const specs: string[] = []
  if (property.beds > 0) specs.push(`${property.beds} BHK`)
  if (property.baths > 0)
    specs.push(`${property.baths} ${property.baths === 1 ? "Bath" : "Baths"}`)
  if (property.sqft && property.sqft !== "On Request")
    specs.push(`${property.sqft} sqft`)

  // ── Compact card for map-mode sidebar ────────────────
  if (compact) {
    return (
      <Link
        href={href}
        className={`flex gap-3 px-4 py-3.5 transition-colors border-b border-border/60 ${
          highlighted ? "bg-primary/5" : "hover:bg-muted/40"
        }`}
        onMouseEnter={() => onHover?.(property.id)}
        onMouseLeave={() => onHover?.(null)}
      >
        <div className="relative w-24 h-18 rounded-md overflow-hidden bg-muted shrink-0">
          <Image
            src={images[0]}
            alt={property.address}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
          <p className="text-[15px] font-semibold text-foreground tracking-tight truncate">
            {displayPrice}
          </p>
          <p className="text-[13px] font-medium text-foreground truncate">
            {property.address}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {property.city}
            {specs.length > 0 ? ` · ${specs.join(" · ")}` : ""}
          </p>
        </div>
      </Link>
    )
  }

  // ── Full Card for Grid View ──────────────────────────
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden border border-border/70 bg-card transition-colors duration-200 hover:border-primary/50"
      onMouseEnter={() => {
        setIsHovered(true)
        onHover?.(property.id)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onHover?.(null)
      }}
    >
      {/* ─ Photograph ─────────────────────────────────── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted select-none">
        <Link href={href} className="block w-full h-full">
          <Image
            src={images[imgIndex]}
            alt={`${property.address}, ${property.city}`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </Link>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={toggleSave}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/35 hover:bg-black/60 text-white transition-all active:scale-90 shadow-xs"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors ${
              saved ? "fill-rose-500 text-rose-500" : "text-white"
            }`}
          />
        </button>

        {/* Photo count indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium backdrop-blur-md bg-black/60 text-white shadow-xs">
              <Camera className="h-2.5 w-2.5" />
              {imgIndex + 1}/{images.length}
            </span>
          </div>
        )}

        {/* Gallery Carousel Arrows on hover */}
        {images.length > 1 && isHovered && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/95 text-neutral-800 hover:bg-white hover:scale-105 shadow-md transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/95 text-neutral-800 hover:bg-white hover:scale-105 shadow-md transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {/* ─ Card Body ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Price */}
        <p className="text-xl font-semibold tracking-tight text-foreground sm:text-[22px]">
          {displayPrice}
        </p>

        {/* Clean Typographic Specs Line */}
        <p className="mt-1 text-xs font-medium tracking-normal text-muted-foreground">
          {specs.length > 0
            ? specs.join("  ·  ")
            : `${formattedType}  ·  ${property.locality || property.city}`}
        </p>

        {/* Property Address / Project Name */}
        <Link href={href} className="block mt-2 group/title">
          <h3 className="line-clamp-1 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover/title:text-primary">
            {property.address}
          </h3>
        </Link>

        {/* Locality & City */}
        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 text-muted-foreground/75 shrink-0" />
          <span className="truncate">
            {property.locality ? `${property.locality}, ` : ""}{property.city}
          </span>
        </div>

        {/* Refined Footer Action */}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3.5">
          <Link
            href={href}
            className="inline-flex whitespace-nowrap items-center gap-1 text-[11px] sm:text-xs font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={openWhatsApp}
            title="Chat on WhatsApp"
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors py-1 px-2 rounded-md"
          >
            <WhatsAppIcon className="h-3 w-3 fill-[#25D366] shrink-0" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </article>
  )
}
