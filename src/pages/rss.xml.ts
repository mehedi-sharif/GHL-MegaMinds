import type { APIRoute } from 'astro';
import { postAuthors, published, sortByDate } from '../lib/content';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const base = site!.origin;
  const posts = sortByDate(await published('blog'));
  const items = posts.map((post) => {
    const url = `${base}/blog/${post.id}`;
    return [
      '    <item>',
      `      <title>${esc(post.data.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      post.data.date && `      <pubDate>${post.data.date.toUTCString()}</pubDate>`,
      post.data.description && `      <description>${esc(post.data.description)}</description>`,
      ...postAuthors(post).map((a) => `      <dc:creator>${esc(a)}</dc:creator>`),
      ...[...new Set([...post.data.categories, ...post.data.tags])].map((c) => `      <category>${esc(c)}</category>`),
      '    </item>',
    ].filter(Boolean).join('\n');
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GHL Megaminds Blog</title>
    <link>${base}/blog</link>
    <description>Short reads on making GoHighLevel work.</description>
    <language>en-us</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
