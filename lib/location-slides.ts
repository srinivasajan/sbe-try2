export interface LocationSlide {
  id: string
  location: string
  subLabel: string
  imageSrc: string
  fallbackSrc: string
  alt: string
  objectPosition?: string
  priority?: boolean
  description: string
  active: boolean
  authenticityNote?: string
}

/**
 * Curated sequence of authentic MMR photographs from location_images/location.
 * Selected to balance core SBE markets (Ambernath, Badlapur) with wider MMR hubs
 * (Navi Mumbai, Panvel, Titwala, Vasai, Karjat, Mira Road, Khopoli).
 */
export const HOMEPAGE_LOCATION_SLIDES: LocationSlide[] = [
  {
    id: "ambernath",
    location: "Ambernath",
    subLabel: "Ambreshwar Shiva Temple (Est. 1060 CE)",
    imageSrc: "/images/location/ambernath.webp",
    fallbackSrc: "/images/location/ambernath.jpg",
    alt: "Ambreshwar Shiva Temple, historic 11th-century architectural heritage in Ambernath",
    objectPosition: "center 40%",
    priority: true,
    description: "SBE's founding headquarters and primary market, featuring rich cultural heritage and rapid modern residential growth.",
    active: true,
  },
  {
    id: "navi-mumbai",
    location: "Navi Mumbai",
    subLabel: "Vashi Commercial & Tech Hub",
    imageSrc: "/images/location/navi-mumbai.webp",
    fallbackSrc: "/images/location/navi-mumbai.jpg",
    alt: "Vashi and Navi Mumbai modern commercial skyline and tech park infrastructure at night",
    objectPosition: "center 50%",
    description: "Planned modern metropolis with premier commercial tech parks, wide arterial avenues, and high-value real estate.",
    active: true,
  },
  {
    id: "badlapur",
    location: "Badlapur",
    subLabel: "Barvi Dam & River Cascades",
    imageSrc: "/images/location/badlapur.webp",
    fallbackSrc: "/images/location/badlapur.jpg",
    alt: "Barvi river cascades and surrounding lush greenery in Badlapur",
    objectPosition: "center 32%",
    description: "Core residential sister-market to Ambernath, nestled between peaceful nature reserves and growing transit infrastructure.",
    active: true,
  },
  {
    id: "panvel",
    location: "Panvel",
    subLabel: "Integrated Residential Townships",
    imageSrc: "/images/location/panvel.webp",
    fallbackSrc: "/images/location/panvel.jpg",
    alt: "High-rise residential towers and township developments nestled near the hills in Panvel",
    objectPosition: "center 45%",
    description: "Major southern MMR growth engine, home to landmark mega-townships and the upcoming international airport corridor.",
    active: true,
  },
  {
    id: "titwala",
    location: "Titwala",
    subLabel: "Mahaganapati Temple Lake Precinct",
    imageSrc: "/images/location/titwala.webp",
    fallbackSrc: "/images/location/titwala.jpg",
    alt: "Titwala Mahaganapati temple lake surrounded by greenery and emerging residential towers",
    objectPosition: "center 50%",
    description: "Rapidly expanding residential destination on the Central Railway line, blending spiritual heritage with accessible housing.",
    active: true,
  },
  {
    id: "vasai",
    location: "Vasai",
    subLabel: "Vasai-Virar Coastal & Urban Belt",
    imageSrc: "/images/location/vasai.webp",
    fallbackSrc: "/images/location/vasai.jpg",
    alt: "Expansive aerial panorama of Vasai-Virar residential developments and coastal green belt",
    objectPosition: "center 45%",
    description: "Thriving western MMR sub-market providing expansive residential communities amidst coastal and green landscapes.",
    active: true,
  },
  {
    id: "karjat",
    location: "Karjat",
    subLabel: "Kondana Caves & Sahyadri Foothills",
    imageSrc: "/images/location/karjat.webp",
    fallbackSrc: "/images/location/karjat.jpg",
    alt: "Ancient rock-cut Buddhist Kondana Caves and monsoon waterfall in Karjat",
    objectPosition: "center 50%",
    description: "Picturesque Western Ghats residential and vacation home corridor with unmatched scenic landscapes and clean living.",
    active: true,
  },
  {
    id: "mira-road",
    location: "Mira Road",
    subLabel: "Western Corridor Residential High-Rises",
    imageSrc: "/images/location/mira-road.webp",
    fallbackSrc: "/images/location/mira-road.jpg",
    alt: "Panoramic evening view of modern residential towers across Mira Road and Mira-Bhayandar",
    objectPosition: "center 40%",
    description: "Dynamic western MMR suburb offering dense, modern high-rise living with direct connectivity into metropolitan Mumbai.",
    active: true,
  },
  {
    id: "khopoli",
    location: "Khopoli",
    subLabel: "Mumbai–Pune Expressway Gateway",
    imageSrc: "/images/location/khopoli.webp",
    fallbackSrc: "/images/location/khopoli.jpg",
    alt: "Mumbai-Pune Expressway corridor navigating through the misty Sahyadri hills near Khopoli",
    objectPosition: "center 50%",
    description: "Strategic transit gateway linking Mumbai and Pune, characterized by major industrial nodes and lush ghat topography.",
    active: true,
  },
]

/**
 * Complete catalog of all 15 location photographs supplied in location_images/location,
 * including visual assessments, authenticity checks, and quality flags.
 */
export const ALL_SUPPLIED_PHOTOGRAPHS = [
  ...HOMEPAGE_LOCATION_SLIDES,
  {
    id: "dombivli",
    location: "Dombivli (Unverified)",
    subLabel: "Alpine Valley Landscape",
    imageSrc: "/images/location/dombivli.webp",
    fallbackSrc: "/images/location/dombivli.jpg",
    alt: "Alpine valley landscape erroneously labeled as Dombivli",
    description: "Glacial alpine valley with snow-capped mountain peaks. Not representative of Dombivli, Maharashtra.",
    active: false,
    authenticityNote: "Factual concern: Depicts a European/Himalayan alpine glacial valley with snow, not the urban city of Dombivli in Thane district.",
  },
  {
    id: "kalyan",
    location: "Kalyan (Low-Res Graphic)",
    subLabel: "Promotional Skyline Graphic",
    imageSrc: "/images/location/kalyan.webp",
    fallbackSrc: "/images/location/kalyan.jpg",
    alt: "Low-resolution graphic with large KALYAN text overlay",
    description: "Low-resolution 314x161 thumbnail with 3D text 'KALYAN' overlay.",
    active: false,
    authenticityNote: "Quality concern: Extremely low resolution (314x161, 11KB) with large promotional typography baked directly into the sky.",
  },
  {
    id: "thane",
    location: "Thane (Watermarked)",
    subLabel: "Upvan Lake Sunset",
    imageSrc: "/images/location/thane.webp",
    fallbackSrc: "/images/location/thane.jpg",
    alt: "Upvan Lake skyline in Thane with large transparent text watermark",
    description: "Upvan Lake and Yeoor hills sunset in Thane with prominent 'Thane' graphic title.",
    active: false,
    authenticityNote: "Watermark concern: Authentic photo of Upvan Lake, but has a large translucent title 'Thane' baked across the sky that clashes with hero text.",
  },
  {
    id: "mumbai",
    location: "Mumbai (Low-Res)",
    subLabel: "Gateway of India",
    imageSrc: "/images/location/mumbai.webp",
    fallbackSrc: "/images/location/mumbai.jpg",
    alt: "Gateway of India thumbnail in Mumbai",
    description: "Gateway of India, Colaba, Mumbai.",
    active: false,
    authenticityNote: "Quality concern: Extremely low resolution thumbnail (300x168, 9.2KB) which pixelates severely when scaled to hero dimensions.",
  },
  {
    id: "murbad",
    location: "Murbad (Low-Res)",
    subLabel: "Gorakhgad & River",
    imageSrc: "/images/location/murbad.webp",
    fallbackSrc: "/images/location/murbad.jpg",
    alt: "Gorakhgad pinnacle and river thumbnail in Murbad",
    description: "Authentic regional landscape of Murbad near Gorakhgad.",
    active: false,
    authenticityNote: "Quality concern: Low-resolution thumbnail (275x183, 8.5KB) resulting in heavy pixelation on modern desktop displays.",
  },
  {
    id: "ulhasnagar",
    location: "Ulhasnagar (Mismatched Location)",
    subLabel: "Western Ghats Mountain Ravine",
    imageSrc: "/images/location/ulhasnagar.webp",
    fallbackSrc: "/images/location/ulhasnagar.jpg",
    alt: "Sahyadri mountain cliff viewpoint overlooking waterfall ravine",
    description: "Mountain cliff viewpoint in the Western Ghats (Matheran/Khandala range).",
    active: false,
    authenticityNote: "Authenticity concern: Labeled 'ulhasnagar.jpg', but shows a mountain cliff viewpoint overlooking waterfall valleys rather than Ulhasnagar city.",
  },
]
