import { getCollection, type CollectionEntry } from 'astro:content';

type Name = 'blog' | 'authors' | 'pages' | 'about' | 'case-studies';

// Published entries of a collection, without the "-index" list-page entries.
export async function published<C extends Name>(name: C): Promise<CollectionEntry<C>[]> {
  const all = await getCollection(name);
  return all.filter((e) => !e.id.startsWith('-') && !e.data.draft);
}

// The "-index" entry of a collection (holds list-page title/description).
export async function indexEntry<C extends Name>(name: C): Promise<CollectionEntry<C>> {
  const all = await getCollection(name);
  const entry = all.find((e) => e.id === '-index');
  if (!entry) throw new Error(`Missing src/content/${name}/-index.md`);
  return entry;
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-');

type WithAuthors = { data: { author?: string; authors?: string[] } };

// A post may declare `authors: [...]` or a single legacy `author: "..."`.
export function postAuthors(post: WithAuthors): string[] {
  const { authors, author } = post.data;
  if (authors?.length) return authors;
  return author ? [author] : [];
}

export const isByAuthor = (post: WithAuthors, name: string) =>
  postAuthors(post).some((a) => slugify(a) === slugify(name));

export const sortByDate = <T extends { data: { date?: Date } }>(posts: T[]) =>
  [...posts].sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

export const monthYear = (d?: Date) =>
  d ? new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d) : '';

// Unique taxonomy terms (categories or tags) across published posts.
export async function taxonomy(key: 'categories' | 'tags') {
  const posts = await published('blog');
  const terms = new Map<string, { name: string; count: number }>();
  for (const p of posts) {
    for (const name of p.data[key]) {
      const slug = slugify(name);
      const t = terms.get(slug) ?? { name, count: 0 };
      t.count++;
      terms.set(slug, t);
    }
  }
  return [...terms].map(([slug, t]) => ({ slug, ...t }));
}
