import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fastdev.tools";
  const currentDate = new Date();

  // Root and tool routes structure
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools/case-converter`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Future tool pages will be registered here as they are built:
    // e.g.:
    // {
    //   url: `${baseUrl}/tools/image-to-text`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/tools/freelance-word-checker`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];

  return routes;
}
