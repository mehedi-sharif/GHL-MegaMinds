import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, absoluteUrl } from "@/lib/seo";
import { postAuthors } from "@/lib/utils/authors";

/**
 * Hand-rolled RSS 2.0 feed for the blog. Feed readers, newsletter tools and
 * several AI crawlers use this as a cheap change-detection channel.
 */

const escapeXml = (unsafe: string) =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async () => {
  const buildDrafts = process.argv.includes("--buildDrafts");

  const posts = (
    await getCollection(
      "blog",
      ({ data, id }) => !id.startsWith("-") && (buildDrafts || !data.draft),
    )
  ).sort(
    (a, b) =>
      new Date(b.data.date ?? 0).getTime() -
      new Date(a.data.date ?? 0).getTime(),
  );

  const items = posts
    .map((post) => {
      const url = `${SITE.url}/blog/${post.id}`;
      const pubDate = post.data.date
        ? new Date(post.data.date).toUTCString()
        : new Date().toUTCString();
      const categories = [
        ...(post.data.categories ?? []),
        ...(post.data.tags ?? []),
      ];

      return [
        "    <item>",
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        post.data.description
          ? `      <description>${escapeXml(post.data.description)}</description>`
          : "",
        ...postAuthors(post).map(
          (a) => `      <dc:creator>${escapeXml(a)}</dc:creator>`,
        ),
        ...[...new Set(categories)].map(
          (c) => `      <category>${escapeXml(c)}</category>`,
        ),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)} — Blog</title>
    <link>${SITE.url}/blog</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${absoluteUrl(SITE.image)}</url>
      <title>${escapeXml(SITE.name)} — Blog</title>
      <link>${SITE.url}/blog</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
