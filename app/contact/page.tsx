"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Phone, Mail, MapPin, Check, Copy, ExternalLink, Send, AlertCircle, Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { saveInquiry, nextInquiryId } from "@/lib/admin-store"
import { OFFICIAL_GOOGLE_MAPS_URL } from "@/lib/constants"

const enquiryCategories = [
  { id: "residential", label: "Buy Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "disposition", label: "Sell Property" },
  { id: "tenancy", label: "Rent / Lease" },
  { id: "mortgage", label: "Home Loan" },
  { id: "inspection", label: "Site Visit" },
]

const INDIAN_MOBILE_REGEX = /^[6-9][0-9]{9}$/

function ContactForm() {
  const searchParams = useSearchParams()
  const initialProp = searchParams.get("property") || searchParams.get("ref") || ""
  const initialType = searchParams.get("type") || ""

  const [category, setCategory] = useState("residential")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [specifications, setSpecifications] = useState("")
  const [honeypot, setHoneypot] = useState("")

  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState("")
  const [submittedPhone, setSubmittedPhone] = useState("")
  const [copiedAddress, setCopiedAddress] = useState(false)

  useEffect(() => {
    if (initialType) {
      const match = enquiryCategories.find(
        (c) =>
          c.label.toLowerCase().includes(initialType.toLowerCase()) ||
          c.id === initialType.toLowerCase()
      )
      if (match) setCategory(match.id)
    }
    if (initialProp) {
      setSpecifications(`Enquiry regarding property: ${initialProp}`)
    }
  }, [initialProp, initialType])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      "Shop No. 6, Vallabh Building, Avdhoot Residency, Near Sarvodaya Nagar, Chikhloli, Ambernath (West), Maharashtra 421505"
    )
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2500)
  }

  // Real-time mobile number sanitization
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip all non-digit characters
    let cleaned = e.target.value.replace(/\D/g, "")

    // If pasted with country code e.g. 919876543210 (12 digits)
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      cleaned = cleaned.slice(2)
    }

    // Limit to max 10 digits
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10)
    }

    setPhone(cleaned)

    if (phoneError) {
      validatePhone(cleaned)
    }
  }

  const validatePhone = (val: string): boolean => {
    const trimmed = val.trim()
    if (!trimmed) {
      setPhoneError("Mobile number is required.")
      return false
    }
    if (trimmed.length < 10) {
      setPhoneError(`Mobile number must be exactly 10 digits (${trimmed.length}/10 entered).`)
      return false
    }
    if (!/^[6-9]/.test(trimmed)) {
      setPhoneError("Indian mobile number must start with 6, 7, 8, or 9.")
      return false
    }
    if (!INDIAN_MOBILE_REGEX.test(trimmed)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.")
      return false
    }
    setPhoneError(null)
    return true
  }

  const validateName = (val: string): boolean => {
    const trimmed = val.trim()
    if (!trimmed) {
      setNameError("Your name is required.")
      return false
    }
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters.")
      return false
    }
    setNameError(null)
    return true
  }

  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim()
    if (!trimmed) {
      setEmailError(null)
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address.")
      return false
    }
    setEmailError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent, viaWhatsApp = false) => {
    e.preventDefault()

    // Prevent double submission
    if (isSubmitting) return

    const isNameValid = validateName(name)
    const isPhoneValid = validatePhone(phone)
    const isEmailValid = validateEmail(email)

    if (!isNameValid || !isPhoneValid || !isEmailValid) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const selectedCategory =
      enquiryCategories.find((c) => c.id === category)?.label || "General Enquiry"
    const cleanedPhone = phone.trim()
    const cleanedName = name.trim()
    const cleanedEmail = email.trim()
    const cleanedMessage = specifications.trim() || "General enquiry."

    try {
      // 1. Submit to Next.js server endpoint
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanedName,
          phone: cleanedPhone,
          email: cleanedEmail || undefined,
          interest: selectedCategory,
          message: cleanedMessage,
          source: viaWhatsApp ? "Contact Us (WhatsApp)" : "Contact Us",
          hp: honeypot || undefined,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to submit enquiry. Please try again.")
      }

      // 2. Also record in local store for backwards-compatible admin view
      saveInquiry({
        id: data.id || nextInquiryId(),
        name: cleanedName,
        phone: cleanedPhone,
        email: cleanedEmail,
        interest: selectedCategory,
        message: cleanedMessage,
        status: "new",
        date: new Date().toISOString(),
        source: viaWhatsApp ? "Contact Us (WhatsApp)" : "Contact Us",
        notificationStatus: data.notificationStatus,
      })

      // 3. If user clicked WhatsApp button, open WhatsApp chat in new window
      if (viaWhatsApp) {
        const text = encodeURIComponent(
          `Hi Shree Balaji Enterprises,\n\nName: ${cleanedName}\nPhone: +91 ${cleanedPhone}${cleanedEmail ? `\nEmail: ${cleanedEmail}` : ""}\nInterest: ${selectedCategory}\nMessage: ${cleanedMessage}`
        )
        window.open(`https://wa.me/917767805544?text=${text}`, "_blank")
      }

      setSubmittedName(cleanedName)
      setSubmittedPhone(cleanedPhone)
      setIsSubmitted(true)
    } catch (err: any) {
      console.error("[Contact Page] Submission error:", err)
      setSubmitError(
        err.message || "Unable to send your enquiry right now. Please call us directly or use WhatsApp."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setName("")
    setPhone("")
    setEmail("")
    setSpecifications("")
    setPhoneError(null)
    setNameError(null)
    setEmailError(null)
    setSubmitError(null)
    setIsSubmitted(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Compact Introduction ─────────────────────────────────── */}
        <div className="mb-6 sm:mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Contact Us
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Have questions or need assistance? Reach out to our team in Ambernath or send us an enquiry below.
          </p>
        </div>

        {/* ── Clean Two-Column Layout ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Contact Details (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-foreground">Get in Touch</h2>

            {/* Contact Details List */}
            <div className="space-y-4 text-sm">
              {/* Phone Numbers */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <a href="tel:+917767805544" className="font-semibold text-foreground hover:text-primary transition-colors block">
                    +91 7767805544
                  </a>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <a
                    href="mailto:shreebalajienterprisesamb@gmail.com"
                    className="block break-all text-[13px] font-semibold leading-relaxed text-foreground transition-colors hover:text-primary sm:text-sm"
                  >
                    shreebalajienterprisesamb@gmail.com
                  </a>
                </div>
              </div>

              {/* Full Office Address */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-foreground leading-relaxed">
                    Shop No. 6, Vallabh Building, Avdhoot Residency, Near Sarvodaya Nagar, Chikhloli, Ambernath (West), Maharashtra &ndash; 421505
                  </p>
                  
                  {/* Copy Address & Directions Actions */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted font-medium text-foreground inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>
                    <a
                      href={OFFICIAL_GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted font-medium text-foreground inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Directions</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Action */}
            <a
              href="https://wa.me/917767805544?text=Hi%20Shree%20Balaji%20Enterprises%2C%20I%20would%20like%20to%20enquire%20about%20properties."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Interactive Map Card */}
            <a
              href={OFFICIAL_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Shree Balaji Enterprises official location on Google Maps"
              className="group relative block h-36 rounded-xl border border-border bg-gradient-to-br from-slate-100 via-sky-50/40 to-slate-100 dark:from-slate-900 dark:via-sky-950/20 dark:to-slate-900 p-4 overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer"
            >
              {/* Decorative map grid lines */}
              <svg
                className="absolute inset-0 h-full w-full stroke-foreground/5 dark:stroke-white/5 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="contact-map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#contact-map-grid)" />
                <path d="M-20 40 Q 80 80, 160 20 T 360 90" fill="none" strokeWidth="2.5" className="stroke-primary/15" />
                <path d="M30 140 Q 120 70, 240 100 T 400 40" fill="none" strokeWidth="2" className="stroke-foreground/10" />
              </svg>

              {/* Pin indicator */}
              <div className="relative z-10 flex items-start gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                  <span className="absolute -inset-1 rounded-xl bg-primary/20 animate-ping opacity-75" />
                  <MapPin className="h-5 w-5 relative z-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground truncate">Shree Balaji Enterprises</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    Chikhloli, Ambernath (West) &bull; Maharashtra
                  </p>
                </div>
              </div>

              {/* Bottom CTA Pill */}
              <div className="absolute bottom-3 right-3 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/95 px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-xs border border-border/80 backdrop-blur-sm group-hover:border-primary group-hover:text-primary transition-colors">
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>

            {/* Discreet MahaRERA notice */}
            <p className="text-xs text-muted-foreground pt-0.5">
              MahaRERA Reg: <span className="font-semibold text-foreground font-mono">A51700023633</span>
            </p>
          </div>

          {/* Right Column: Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-foreground">Send an Enquiry</h2>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Thank You, {submittedName}!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  Your enquiry has been received and logged. Our team will contact you shortly on{" "}
                  <strong className="text-foreground">+91 {submittedPhone}</strong>.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="h-8 px-3 border border-border rounded-lg hover:bg-muted font-medium text-foreground transition-colors cursor-pointer"
                  >
                    Send Another Enquiry
                  </button>
                  <Link
                    href="/buy"
                    className="h-8 px-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium inline-flex items-center transition-colors"
                  >
                    Browse Properties &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4" noValidate>
                {/* Honeypot field for anti-spam */}
                <input
                  type="text"
                  name="website_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only"
                  aria-hidden="true"
                />

                {/* Submission Error Banner */}
                {submitError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Submission failed</p>
                      <p className="mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}
                
                {/* Interest Selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    I am interested in
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {enquiryCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`h-9 px-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer flex items-center justify-center ${
                          category === c.id
                            ? "border-primary bg-primary text-primary-foreground shadow-xs"
                            : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="contact-name" className="text-xs font-medium text-foreground block mb-1">
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (nameError) validateName(e.target.value)
                      }}
                      onBlur={() => name && validateName(name)}
                      placeholder="e.g. Ramesh Sharma"
                      className={`h-10 w-full px-3 border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                        nameError
                          ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                          : "border-border focus:ring-primary/20 focus:border-primary"
                      }`}
                    />
                    {nameError && (
                      <p className="mt-1 text-xs text-destructive font-medium">{nameError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="text-xs font-medium text-foreground block mb-1">
                      Mobile Number <span className="text-destructive">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-semibold text-muted-foreground pointer-events-none select-none">
                        +91
                      </span>
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        autoComplete="tel-national"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => phone && validatePhone(phone)}
                        placeholder="9876543210"
                        className={`h-10 w-full pl-11 pr-3 border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all font-mono ${
                          phoneError
                            ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                            : "border-border focus:ring-primary/20 focus:border-primary"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-xs text-destructive font-medium">{phoneError}</p>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="contact-email" className="text-xs font-medium text-foreground block mb-1">
                    Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) validateEmail(e.target.value)
                    }}
                    onBlur={() => email && validateEmail(email)}
                    placeholder="you@example.com"
                    className={`h-10 w-full px-3 border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                      emailError
                        ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                        : "border-border focus:ring-primary/20 focus:border-primary"
                    }`}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-destructive font-medium">{emailError}</p>
                  )}
                </div>

                {/* Message / Requirements */}
                <div>
                  <label htmlFor="contact-message" className="text-xs font-medium text-foreground block mb-1">
                    Message / Requirements <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder="Tell us what you're looking for (e.g., 2 BHK in Ambernath-East, budget ₹45 Lakhs)..."
                    className="w-full p-3 border border-border rounded-lg bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[80px]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={(e) => handleSubmit(e, true)}
                    className="h-10 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading contact page...
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  )
}
