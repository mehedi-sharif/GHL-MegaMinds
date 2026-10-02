import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const pageFields = {
  title: z.string(),
  description: z.string().optional(),
  meta_title: z.string().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
};

const md = (base: string) => glob({ pattern: '**/*.{md,mdx}', base: `src/content/${base}` });

// Blog posts. A post can be written by one or several people; `author` is kept
// for backwards compatibility.
const blog = defineCollection({
  loader: md('blog'),
  schema: z.object({
    ...pageFields,
    date: z.coerce.date().optional(),
    author: z.string().optional(),
    authors: z.array(z.string()).optional(),
    categories: z.array(z.string()).default(() => ['others']),
    tags: z.array(z.string()).default(() => ['others']),
  }),
});

const authors = defineCollection({
  loader: md('authors'),
  schema: z.object({
    ...pageFields,
    role: z.string().optional(),
    order: z.number().default(99),
    social: z
      .array(z.object({ name: z.string().optional(), icon: z.string().optional(), link: z.string().optional() }).optional())
      .optional(),
  }),
});

// Regular pages (business-owners, resellers, tools, privacy, terms)
const pages = defineCollection({ loader: md('pages'), schema: z.object(pageFields) });

const about = defineCollection({ loader: md('about'), schema: z.object(pageFields) });

const caseStudies = defineCollection({
  loader: md('case-studies'),
  schema: z.object({
    ...pageFields,
    order: z.number().default(99),
    num: z.string(), // "CS/01"
    kind: z.string(), // "Home services / Business owner"
    summary: z.string(), // card text on the index
    panel_label: z.string(),
    panel_bg: z.string(),
    panel_ink: z.string(),
    wide: z.boolean().default(false),
    results: z.array(z.object({ value: z.string(), label: z.string() })).default(() => []),
  }),
});

export const collections = { blog, authors, pages, about, 'case-studies': caseStudies };
