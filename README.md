# GHL Megaminds — Astro + Tailwind

Landing page for ghlmegaminds.com, built with **Astro 5** and **Tailwind CSS v4**.

## Get started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site → dist/
npm run preview  # preview the build
```

## Add the photos

Copy these from your current site into `public/images/` (same paths as the live site):

```
public/images/team/mehedi-sharif.png
public/images/team/farhad-hossen.png
public/images/team/somrat-sorkar.png
public/images/shariful-islam.jpg
```

## Where things live

| What | File |
| --- | --- |
| All copy, prices, links, team, projects | `src/data/site.ts` |
| Colors & fonts (design tokens) | `src/styles/global.css` (`@theme`) |
| Page order | `src/pages/index.astro` |
| Sections | `src/components/*.astro` |
| SEO / `<head>` | `src/layouts/Layout.astro` |

The booking link is `BOOKING_URL` in `src/data/site.ts`.

## Colors (GHL Video palette)

| Token | Hex | Tailwind |
| --- | --- | --- |
| Canvas | `#08090D` | `bg-canvas` |
| Deep | `#030303` | `bg-deep` |
| Surface | `#111219` | `bg-surface` |
| Card | `#161821` | `bg-card` |
| Hairline | `#2B2F40` | `border-hair` |
| Text | `#EEF0F6` | `text-ink` |
| Muted | `#9096A8` | `text-muted` |
| Gold | `#FCC000` | `text-gold` |
| Green | `#00CC00` | `text-green` |
| Brand gradient | gold → green | `bg-brand`, `text-brand` |

## Deploy

It's a static site — works on Cloudflare Pages (build command `npm run build`, output `dist`), Vercel or Netlify with no extra config.
