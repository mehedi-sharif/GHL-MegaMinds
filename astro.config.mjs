import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";

const isVercel = !!process.env.VERCEL;


// Helper to parse font string format: "FontName:wght@400;500;600;700"
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400]; // default weight

  if (weightPart) {
    // Extract weights from wght@400;500;600 format
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) {
      weights = weightMatch[1].split(";").map((w) => parseInt(w, 10));
    }
  }

  // remove + from font name and add space
  const cleanName = name.replace(/\+/g, " ");
  return { name: cleanName, weights };
}

// Build fonts configuration from theme.json
const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type")) // Filter out type entries
  .map(([key, fontStr]) => {
    const { name, weights } = parseFontString(fontStr);
    const typeKey = `${key}_type`;
    const fallback = theme.fonts.font_family[typeKey] || "sans-serif";

    return {
      name,
      cssVariable: `--font-${key}`,
      provider: fontProviders.google(),
      weights,
      display: "swap",
      fallbacks: [fallback],
    };
  });

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: true },
  },
  fonts: fontsConfig,

  // Only use Sharp locally — Vercel uses its own image service above
  ...(isVercel ? {} : { image: { service: sharp() } }),
  adapter: isVercel
    ? vercel({
        edgeMiddleware: false,
        imageService: true,
        devImageService: "sharp",
      })
    : node({ mode: "standalone" }),

  integrations: [
    react(),
    sitemap({
      // 404 and paginated duplicates add no value in a sitemap.
      filter: (page) =>
        !/\/404\/?$/.test(page) && !/\/blog\/page\/\d+\/?$/.test(page),
      changefreq: "weekly",
      lastmod: new Date(),
      serialize(item) {
        const path = item.url.replace(config.site.base_url, "").replace(/\/$/, "");
        // Money pages first, then the rest of the marketing site, then archives.
        if (path === "") {
          item.priority = 1.0;
          item.changefreq = "weekly";
        } else if (["/business-owners", "/resellers", "/contact"].includes(path)) {
          item.priority = 0.9;
        } else if (path.startsWith("/case-studies") || path === "/about" || path === "/tools") {
          item.priority = 0.8;
        } else if (path.startsWith("/blog/")) {
          item.priority = 0.7;
          item.changefreq = "monthly";
        } else if (path === "/blog" || path === "/authors") {
          item.priority = 0.6;
        } else if (path.startsWith("/categories") || path.startsWith("/tags") || path.startsWith("/authors/")) {
          item.priority = 0.4;
          item.changefreq = "monthly";
        } else if (path === "/privacy" || path === "/terms") {
          item.priority = 0.2;
          item.changefreq = "yearly";
        } else {
          item.priority = 0.5;
        }
        return item;
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],

  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
    }),
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
