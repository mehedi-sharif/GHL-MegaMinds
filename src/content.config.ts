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

// ---------- homepage & contact (singletons, edited in Sitepins) ----------
const link = z.object({ label: z.string(), link: z.string() });
const heading = { title: z.string(), title_highlight: z.string().default('') };
const section = { eyebrow: z.string().default(''), ...heading, content: z.string().default('') };
const textCard = { kicker: z.string(), title: z.string(), body: z.string() };

const homepage = defineCollection({
  loader: md('homepage'),
  schema: z.object({
    ...pageFields,
    hero: z.object({
      ...section,
      primary_button: link,
      secondary_button: link,
      stats: z.array(z.object({ stat: z.string(), text: z.string() })),
      console: z.object({
        kicker: z.string(),
        title: z.string(),
        status: z.string(),
        checklist: z.array(z.object({ label: z.string(), tag: z.string(), done: z.boolean() })),
        progress_label: z.string(),
        progress_target: z.string(),
        progress_percent: z.number().min(0).max(100),
        note: z.string(),
      }),
    }),
    stack: z.object({ title: z.string(), tools: z.array(z.string()) }),
    problem: z.object({
      ...section,
      options_label: z.string(),
      options: z.array(z.object({ title: z.string(), flag: z.string(), body: z.string() })),
      us_label: z.string(),
      us_title: z.string(),
      advantages: z.array(z.string()),
      link,
    }),
    solution: z.object({
      ...section,
      primary_button: link,
      secondary_button: link,
      engineering: z.object({ ...textCard, workflow_label: z.string(), workflow_status: z.string(), workflow: z.array(z.string()) }),
      pricing: z.object({ ...textCard, price_suffix: z.string() }),
      partnership: z.object({ ...textCard, message_channel: z.string(), message_time: z.string(), message: z.string() }),
    }),
    proof: z.object({
      installs_label: z.string(),
      apps_label: z.string(),
      shipped_label: z.string(),
      experience_label: z.string(), // "{certified}" is replaced with the number of certified admins
    }),
    team: z.object({
      ...section,
      members: z.array(z.object({
        name: z.string(), role: z.string(), years: z.string(), certified: z.boolean(), photo: z.string(), alt: z.string(),
      })),
    }),
    offers: z.object({
      badge: z.string(),
      ...heading,
      content: z.string(),
      button_label: z.string(),
      plans: z.array(z.object({
        kicker: z.string(), title: z.string(), featured: z.string().default(''), desc: z.string(),
        price: z.string(), regular: z.string(), terms: z.string(), features: z.array(z.string()),
      })),
      guarantee: z.object({ title: z.string(), content: z.string() }),
    }),
    testimonial: z.object({
      ...section,
      quote: z.string(), name: z.string(), role: z.string(), photo: z.string().default(''), alt: z.string().default(''),
    }),
    how_it_works: z.object({
      ...section,
      steps: z.array(z.object({ n: z.string(), title: z.string(), tag: z.string(), body: z.string() })),
      button: link,
    }),
    projects: z.object({
      ...section,
      initial_count: z.number().default(6),
      load_more_label: z.string(),
      items: z.array(z.object({
        title: z.string(),
        type: z.string(),
        body: z.string(),
        // illustration used when there is no screenshot
        preview: z.enum(['middleware', 'pricing', 'llms', 'telegram', 'payments', 'astro', 'portal']),
        image: z.string().default(''),
        downloads: z.number().default(0), // Marketplace installs; 0 = not a Marketplace app
        cta_label: z.string().default(''),
        cta_link: z.string().default(''),
        coming_soon: z.boolean().default(false),
      })),
    }),
    final_cta: z.object({ ...section, button: link }),
  }),
});

const contact = defineCollection({
  loader: md('contact'),
  schema: z.object({
    ...pageFields,
    eyebrow: z.string(),
    heading: z.string(),
    heading_highlight: z.string().default(''),
    content: z.string(),
    form_label: z.string(),
    fallback_text: z.string(),
    fallback_button: z.string(),
    calendar_title: z.string(),
  }),
});

export const collections = { blog, authors, pages, about, 'case-studies': caseStudies, homepage, contact };
