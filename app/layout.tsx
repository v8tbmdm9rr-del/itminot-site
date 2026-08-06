import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG, SITE_URL } from "@/config/site";
import { RESTAURANT } from "@/config/restaurant";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.title,
    template: "%s — ITMINOT",
  },
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630 }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
  width: "device-width",
  initialScale: 1,
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: RESTAURANT.name,
  servesCuisine: "Italian",
  priceRange: "₽₽",
  image: `${SITE_URL}${SITE_CONFIG.ogImage}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: RESTAURANT.address,
    addressLocality: RESTAURANT.city,
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: RESTAURANT.coordinates.lat,
    longitude: RESTAURANT.coordinates.lng,
  },
  telephone: RESTAURANT.phoneDisplay,
  url: SITE_URL,
  sameAs: [RESTAURANT.instagram],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "00:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${manrope.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-charcoal font-body text-cream antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
