import { Metadata } from "next"
import { HomeHero } from "@/components/home-hero"

export const metadata: Metadata = {
  title: "Shree Balaji Enterprises — Real Estate in Mumbai & MMR",
  description:
    "RERA-registered real estate agency (Established 2016, MahaRERA: A51700023633). Assisting clients with residential, commercial, and industrial property advisory across Mumbai & MMR.",
  alternates: {
    canonical: "https://shreebalajienterprises.live",
  },
}

export default function Home() {
  return <HomeHero />
}
