import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/",                priority: 1.0,  changeFrequency: "monthly" as const },
    { path: "/projects",        priority: 0.9,  changeFrequency: "monthly" as const },
    { path: "/about",           priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/contact",         priority: 0.7,  changeFrequency: "yearly"  as const },
    { path: "/build-notes",     priority: 0.6,  changeFrequency: "monthly" as const },
    { path: "/references",      priority: 0.5,  changeFrequency: "yearly"  as const },
    { path: "/resume",          priority: 0.5,  changeFrequency: "monthly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
