# Portfolio — Guillermo Galvan

Minimal bilingual (EN/ES) portfolio built with Next.js 16 as a fully static site.

## Edit content

All text lives in [`src/content.ts`](src/content.ts) — experience, skills, certifications, links and both translations.
Styles are in [`src/app/globals.css`](src/app/globals.css).

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static output in ./out
npm start       # serve ./out locally
npm run lint
```

Requires Node 20.9+ (Netlify uses Node 22, set in `netlify.toml`).

## SEO & AI discoverability

Generated at build time from `src/content.ts`, so they never go stale:

- `/sitemap.xml`, `/robots.txt` (search engines and AI crawlers explicitly allowed)
- `/llms.txt` and `/llms-full.txt` ([llmstxt.org](https://llmstxt.org)) for AI agents
- JSON-LD `Person` + `ProfilePage` structured data, canonical + hreflang (en/es/x-default)
- Open Graph / Twitter cards with a generated preview image (`/en/opengraph-image`)

Absolute URLs use Netlify's `$URL` (your primary domain). Set `SITE_URL` in Netlify env vars to override.

## Deploy (Netlify)

`netlify.toml` already configures everything: build command `npm run build`, publish directory `out`.
No Netlify Next.js plugin is needed. Visitors hitting `/` are redirected to `/es/` or `/en/` based on their browser language.
