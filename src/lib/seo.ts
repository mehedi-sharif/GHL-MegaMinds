import config from "@/config/config.json";
import social from "@/config/social.json";

/**
 * Central SEO helpers.
 *
 * Everything that needs an absolute URL, a canonical, or a piece of
 * schema.org JSON-LD goes through here so the site speaks with one voice to
 * search engines and to AI answer engines (which lean heavily on JSON-LD and
 * on clean, self-referencing canonicals).
 */

export const SITE = {
  url: config.site.base_url.replace(/\/+$/, ""),
  name: "GHL Megaminds",
  legalName: "GHL Megaminds",
  title: config.site.title,
  description: config.metadata.meta_description,
  image: config.metadata.meta_image,
  imageWidth: 1200,
  imageHeight: 630,
  locale: "en_US",
  lang: "en",
} as const;

/** Turn "/about" or "images/x.png" into an absolute URL. Passes through absolutes. */
export function absoluteUrl(path: string | undefined | null = "/"): string {
  if (!path) return `${SITE.url}/`;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}/${String(path).replace(/^\/+/, "")}`;
}

/** Self-referencing canonical: no trailing slash (matches astro trailingSlash: "never"). */
export function canonicalUrl(pathname: string): string {
  const clean = String(pathname || "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  return clean === "" ? `${SITE.url}/` : `${SITE.url}/${clean}`;
}

/** Real profile links only — the config still holds "#" placeholders. */
export const socialProfiles: string[] = (social.main || [])
  .map((s: { link?: string }) => s.link || "")
  .filter((link: string) => /^https?:\/\//i.test(link));

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function organizationSchema() {
  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    description: SITE.description,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE.url}/#logo`,
      // Google wants a square logo of at least 112x112 for Organization.
      url: absoluteUrl("/images/logo-mark.png"),
      contentUrl: absoluteUrl("/images/logo-mark.png"),
      width: 512,
      height: 512,
      caption: SITE.name,
    },
    image: { "@id": `${SITE.url}/#logo` },
    knowsAbout: [
      "GoHighLevel",
      "HighLevel SaaS Mode",
      "CRM implementation",
      "Marketing automation",
      "White label client onboarding",
      "Sales funnels",
      "Workflow automation",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        url: `${SITE.url}/contact`,
        availableLanguage: ["English"],
      },
    ],
  };
  if (socialProfiles.length) org.sameAs = socialProfiles;
  return org;
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { "@id": ORG_ID },
  };
}

const BREADCRUMB_LABELS: Record<string, string> = {
  "business-owners": "For Business Owners",
  resellers: "For Resellers",
  "case-studies": "Case Studies",
  blog: "Blog",
  authors: "Authors",
  tools: "Things We Built",
  about: "About",
  contact: "Contact",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  categories: "Categories",
  tags: "Tags",
  page: "Page",
};

function labelFor(segment: string): string {
  if (BREADCRUMB_LABELS[segment]) return BREADCRUMB_LABELS[segment];
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * BreadcrumbList built from the URL path. Gives search results the
 * "Home › Blog › Post" trail instead of a bare URL.
 */
export function breadcrumbSchema(pathname: string, currentTitle?: string) {
  const segments = String(pathname || "/")
    .split("/")
    .filter(Boolean);
  if (!segments.length) return null;

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE.url}/`,
    },
  ];

  segments.forEach((segment, i) => {
    const isLast = i === segments.length - 1;
    const path = segments.slice(0, i + 1).join("/");
    items.push({
      "@type": "ListItem",
      position: i + 2,
      name: isLast && currentTitle ? currentTitle : labelFor(segment),
      item: `${SITE.url}/${path}`,
    });
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl(pathname)}#breadcrumb`,
    itemListElement: items,
  };
}

/** Wrap one or more nodes in a single @graph document. */
export function jsonLdGraph(nodes: unknown[]) {
  return JSON.stringify(
    { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) },
    null,
    0,
  );
}
