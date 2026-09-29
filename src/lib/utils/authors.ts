import { slugify } from "@/lib/utils/textConverter";

type WithAuthors = {
  data: { author?: string; authors?: string[] };
};

/**
 * A post may declare `authors: [...]` (preferred) or a single legacy
 * `author: "..."`. Always read through this helper so both shapes work.
 */
export function postAuthors(post: WithAuthors): string[] {
  const { authors, author } = post.data;
  if (authors && authors.length) return authors;
  if (author) return [author];
  return [];
}

/** True when `post` was written (or co-written) by the given author name. */
export function isByAuthor(post: WithAuthors, authorName: string): boolean {
  const target = slugify(authorName);
  return postAuthors(post).some((a) => slugify(a) === target);
}
