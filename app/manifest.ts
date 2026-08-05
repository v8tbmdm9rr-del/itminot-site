import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.title,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0c0b",
    theme_color: "#0d0c0b",
    lang: "ru",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
