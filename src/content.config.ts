import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const pageFields = {
  title: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
};

// Blog post collection
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    // a post can be written by one or several people; `author` is kept for
    // backwards compatibility with existing posts
    author: z.string().optional(),
    authors: z.array(z.string()).optional(),
    categories: z.array(z.string()).default(() => ["others"]),
    tags: z.array(z.string()).default(() => ["others"]),
    draft: z.boolean().optional(),
  }),
});

// Author collection
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/authors" }),
  schema: z.object({
    ...pageFields,
    role: z.string().optional(),
    order: z.number().default(99),
    social: z
      .array(
        z
          .object({
            name: z.string().optional(),
            icon: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
  }),
});

// Regular pages (business-owners, resellers, case-studies, tools, privacy, terms)
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({ ...pageFields }),
});

// Homepage
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({ ...pageFields }),
});

// About
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({ ...pageFields }),
});

// Contact
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({ ...pageFields }),
});

// Case studies
const caseStudiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/case-studies" }),
  schema: z.object({
    ...pageFields,
    order: z.number().default(99),
    num: z.string(), // "CS/01"
    kind: z.string(), // "Home services / Business owner"
    summary: z.string(), // card text on the index
    // index tile artwork
    panel_label: z.string(),
    panel_bg: z.string(),
    panel_ink: z.string(),
    wide: z.boolean().default(false),
    // headline figures, shown as pills on the index and as a strip on the detail page
    results: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default(() => []),
  }),
});

export const collections = {
  homepage: homepageCollection,
  about: aboutCollection,
  contact: contactCollection,
  pages: pagesCollection,
  blog: blogCollection,
  authors: authorsCollection,
  "case-studies": caseStudiesCollection,
};
