"use client"

import { motion } from "motion/react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"

export function WhatsAppButton() {
  return (
    <>
      <motion.a
        href="https://wa.me/917767805544?text=Hello%20Shree%20Balaji%20Enterprises%2C%20I%20wish%20to%20inquire%20regarding%20property%20advisory."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="whatsapp-floating-cta fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 transition-all duration-200 hover:bg-[#20bd5a] hover:shadow-xl group sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:justify-start sm:gap-2.5 sm:px-4 sm:py-2.5"
        aria-label="Direct Client Advisory on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="relative hidden h-2 w-2 shrink-0 sm:flex">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <WhatsAppIcon className="h-5 w-5 shrink-0 fill-current transition-transform group-hover:scale-110" />
        <span className="hidden whitespace-nowrap text-xs font-bold tracking-wide sm:inline">
          Chat on WhatsApp
        </span>
      </motion.a>
      <style jsx global>{`
        @media (max-width: 1799px) {
          .whatsapp-floating-cta {
            right: 16px;
            width: 40px;
            height: 40px;
            justify-content: center;
            gap: 0;
            padding: 0;
          }
          .whatsapp-floating-cta > span {
            display: none;
          }
        }
        @media (max-height: 700px) {
          .whatsapp-floating-cta {
            top: 72px;
            bottom: auto;
          }
        }
      `}</style>
    </>
  )
}
