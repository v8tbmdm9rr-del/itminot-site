import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/menu", "/booking", "/delivery", "/contacts", "/checkout"];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
