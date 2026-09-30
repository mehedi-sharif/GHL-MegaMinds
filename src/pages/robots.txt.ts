import type { APIRoute } from "astro";
import { SITE } from "@/lib/seo";

/**
 * robots.txt is generated (not static) so the sitemap URL always matches
 * config.site.base_url.
 *
 * AI crawlers are listed explicitly and allowed. Two different jobs are going
 * on here, and they are worth keeping straight:
 *   - Answer-engine fetchers (OAI-SearchBot, ChatGPT-User, PerplexityBot,
 *     Claude-User...) are what let this site be cited in AI answers.
 *   - Model-training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended...)
 *     only feed training corpora.
 * Both are allowed below. If you ever want the site to be citable but not
 * trainable, move the training group to `Disallow: /`.
 */

const AI_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google / Gemini
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Microsoft / Copilot
  "bingbot",
  // Apple, Meta, Amazon, Common Crawl, others
  "Applebot",
  "Applebot-Extended",
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "CCBot",
  "cohere-ai",
  "YouBot",
  "Bytespider",
  "DuckAssistBot",
  "MistralAI-User",
];

export const GET: APIRoute = () => {
  const lines: string[] = [
    "# https://www.robotstxt.org/robotstxt.html",
    "",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    "# Search and AI answer engines are explicitly welcome.",
    ...AI_AGENTS.flatMap((agent) => [`User-agent: ${agent}`]),
    "Allow: /",
    "",
    `Sitemap: ${SITE.url}/sitemap-0.xml`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
