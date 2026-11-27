import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { BrandIdentity } from "@/components/brand-logo"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { OFFICIAL_GOOGLE_MAPS_URL } from "@/lib/constants"

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Browse Properties", href: "/buy" },
      { label: "Rent Properties", href: "/rent" },
      { label: "Sell Your Property", href: "/sell" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Home Loans", href: "/home-loans" },
      { label: "Areas We Serve", href: "/locations" },
      { label: "Research Paper", href: "/research-paper" },
      { label: "RERA Information", href: "/about" },
    ],
  },
  {
    title: "Locations",
    links: [
      { label: "Ambernath (HQ)", href: "/locations#ambernath" },
      { label: "Badlapur", href: "/locations#badlapur" },
      { label: "Ulhasnagar", href: "/locations#ulhasnagar" },
      { label: "Kalyan & Dombivli", href: "/locations#kalyan" },
      { label: "Thane & Mumbai", href: "/locations#thane" },
      { label: "All Serviced Areas", href: "/locations" },
    ],
  },
]

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/srinivasajan/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    href: "https://x.com/sriwanders",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Substack",
    href: "https://substack.com/@sriwanders",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  {
    name: "Medium",
    href: "https://medium.com/@sriwanders",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@srinivasjan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/srinivasaj/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/srinivasjangiti",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#f5f4f0] text-foreground">
      <div className="mx-auto max-w-[1440px] px-4 py-9 pb-8 sm:px-8 md:py-11 md:pb-8">
        {/* Footer links grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 md:gap-x-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-foreground/75 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Contact</h3>
            <div className="flex flex-col">
              {[
                { href: "tel:7767805544", icon: Phone, label: "+91 7767805544", iconColor: "text-primary" },
                { href: "mailto:shreebalajienterprisesamb@gmail.com", icon: Mail, label: "Email Us", iconColor: "text-primary" },
                { href: "https://wa.me/917767805544", icon: WhatsAppIcon, label: "WhatsApp", external: true, iconColor: "text-[#25D366]" },
                { href: OFFICIAL_GOOGLE_MAPS_URL, icon: MapPin, label: "Get Directions", external: true, iconColor: "text-primary" },
              ].map(({ href, icon: Icon, label, external, iconColor }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-2.5 py-1.5 text-[13px] text-foreground/75 transition-colors hover:text-primary group"
                >
                  <Icon className={`h-3.5 w-3.5 ${iconColor || "text-primary"} shrink-0`} />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-border pt-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Logo & Brand Wordmark */}
            <Link href="/" className="inline-flex items-center shrink-0" aria-label="Shree Balaji Enterprises">
              <BrandIdentity />
            </Link>

            {/* Legal links & bottom contact button */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <span className="text-foreground/30" aria-hidden="true">&bull;</span>
                <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">
                  Terms &amp; Conditions
                </Link>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 border border-border px-3 py-1 text-foreground font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                <Phone className="h-3 w-3 text-primary" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-4 max-w-4xl text-xs leading-relaxed text-foreground/65">
            Shree Balaji Enterprises is a MahaRERA-registered real estate agency based in Ambernath, Maharashtra. Property buying, selling and rental assistance across the Mumbai Metropolitan Region. Registration No. A51700023633.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-foreground/55">
            Office: {" "}
            <a
              href={OFFICIAL_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 transition-colors hover:text-primary hover:underline"
            >
              Shop No. 6, Vallabh Bldg, Avdhoot Residency, Chikhloli, Ambernath-West, 421505
            </a>
          </p>
          {/* ── Creator Card ── */}
          <div className="mt-6 mb-6">
            <div className="rounded-xl bg-gradient-to-br from-stone-800 via-stone-800 to-stone-900 border border-stone-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Left: identity */}
              <div className="flex items-center gap-4">
                {/* Avatar photo */}
                <Image
                  src="/srinivas-jangiti.png"
                  alt="Srinivas Jangiti"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover object-top flex-shrink-0 ring-2 ring-stone-600"
                />
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-0.5">
                    Built by
                  </p>
                  <p className="text-base font-semibold text-white leading-tight">
                    Srinivas Jangiti
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <a
                      href="mailto:srinivasajan.work@gmail.com"
                      className="text-xs text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3 h-3"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      srinivasajan.work@gmail.com
                    </a>
                    <span className="text-stone-700 hidden sm:inline">·</span>
                    <a
                      href="tel:+918767505121"
                      className="text-xs text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3 h-3"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      +91 87675 05121
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: social icons */}
              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-amber-500 text-stone-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-foreground/55">
            <span>© 2026 Shree Balaji Enterprises. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  )
}
