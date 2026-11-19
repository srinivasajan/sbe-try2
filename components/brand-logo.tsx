import React from "react"
import Image from "next/image"

export interface BrandLogoProps {
  className?: string
  priority?: boolean
}

/**
 * Authoritative religious Balaji emblem asset.
 * Preserves the exact original artwork without modification, redraw, or distortion.
 */
export function BrandLogo({
  className = "h-[36px] sm:h-[39px] w-auto aspect-[820/528]",
  priority = false,
}: BrandLogoProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src="/images/logo.png"
        alt="Shree Balaji Religious Emblem"
        width={820}
        height={528}
        priority={priority}
        unoptimized
        className="h-full w-auto object-contain select-none pointer-events-none [image-rendering:-webkit-optimize-contrast]"
      />
    </div>
  )
}

export interface BrandWordmarkProps {
  inverted?: boolean
  size?: "default" | "sm" | "lg"
  className?: string
}

/**
 * Premium Heritage two-line wordmark.
 * Line 1: "Shree Balaji" (Refined font weight 600-700, warm saffron #D97706 + deep navy #143D75)
 * Line 2: "ENTERPRISES" (Uppercase, 10-11px, weight 500-600, tracking 0.20em, charcoal #374151)
 */
export function BrandWordmark({
  inverted = false,
  size = "default",
  className = "",
}: BrandWordmarkProps) {
  const isSm = size === "sm"
  const isLg = size === "lg"

  const titleSizeClass = isSm
    ? "text-[15px] sm:text-[16px]"
    : isLg
    ? "text-[19px] sm:text-[21px]"
    : "text-[17px] sm:text-[18.5px]"

  const subSizeClass = isSm
    ? "text-[8.5px] sm:text-[9px] tracking-[0.285em]"
    : isLg
    ? "text-[11px] sm:text-[12px] tracking-[0.308em]"
    : "text-[9.5px] sm:text-[10.5px] tracking-[0.324em] sm:tracking-[0.308em]"

  return (
    <span className={`inline-flex flex-col justify-center select-none text-left leading-none ${className}`}>
      {/* Primary Line: Shree Balaji */}
      <span className={`font-brand font-bold ${titleSizeClass} tracking-[-0.01em] leading-tight whitespace-nowrap`}>
        <span className="text-[#D97706]">Shree</span>{" "}
        <span className={inverted ? "text-sky-400 dark:text-sky-300" : "text-[#143D75] dark:text-[#38BDF8]"}>
          Balaji
        </span>
      </span>

      {/* Secondary Line: E N T E R P R I S E S */}
      <span
        className={`font-brand font-medium sm:font-semibold uppercase ${subSizeClass} mt-[1px] sm:mt-[1.5px] leading-none whitespace-nowrap ${
          inverted ? "text-slate-300/90" : "text-[#374151] dark:text-slate-300"
        }`}
      >
        Enterprises
      </span>
    </span>
  )
}

export interface BrandIdentityProps {
  priority?: boolean
  inverted?: boolean
  size?: "default" | "sm" | "lg"
  className?: string
  logoClassName?: string
}

/**
 * Complete Premium Heritage Brand Lockup:
 * Original Balaji religious emblem + two-line wordmark.
 * Optical spacing accounts for the emblem's internal transparent padding (~10.8px),
 * resulting in an exact 8-10px true visual gap on desktop.
 */
export function BrandIdentity({
  priority = false,
  inverted = false,
  size = "default",
  className = "",
  logoClassName = "",
}: BrandIdentityProps) {
  const isSm = size === "sm"
  const isLg = size === "lg"

  // Offset internal PNG transparent padding:
  // -ml aligns visible gold artwork flush with left boundary
  // -mr trims the ~10.8px internal right transparency so the visual distance to "Shree" is exactly 8.5-9.5px
  const defaultLogoClass = isSm
    ? "h-[28px] w-auto aspect-[820/528] -ml-0.5 -mr-0.5"
    : isLg
    ? "h-[44px] sm:h-[48px] w-auto aspect-[820/528] -ml-1 sm:-ml-1.5 -mr-1 sm:-mr-1.5"
    : "h-[36px] sm:h-[39px] w-auto aspect-[820/528] -ml-1 sm:-ml-1.5 -mr-0.5 sm:-mr-0.5"

  return (
    <div className={`inline-flex items-center gap-0 shrink-0 ${className}`}>
      <BrandLogo className={logoClassName || defaultLogoClass} priority={priority} />
      <BrandWordmark inverted={inverted} size={size} />
    </div>
  )
}
