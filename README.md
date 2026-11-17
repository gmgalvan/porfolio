# Portfolio — Guillermo Galvan

Minimal bilingual (EN/ES) CV site built with Next.js 16 as a fully static site.

## Content

The CV lives in [`data/`](data/) as static JSON (`profile.json`, `projects.json`, `skills.json`),
read at build time. The site never calls an API.

The JSON is a **cleaned snapshot** of the private career-vault API, made with
[`scripts/snapshot.mjs`](scripts/snapshot.mjs). Because this repo is public, the snapshot:

- replaces the real names of confidential employers and customers with their alias,
- drops the phone number and any field the site does not use,
- refuses to write anything if a confidential name still appears in the text.

Refresh it from WSL with AWS credentials that can call the API:

```bash
CV_API_URL=https://... npm run snapshot   # writes data/*.json
git diff data/                            # review before committing
```

Content is English only for now: `/es/` shows Spanish labels with English content.

## Develop

```bash
npm install
npm run dev                # http://localhost:3000, real data from data/
npm run dev:fixtures       # fake data from fixtures/
npm test                   # display rules (src/lib/cv)
npm run lint
npm run build              # static output in ./out
npm start                  # serve ./out locally
```

Requires Node 20.9+ (Netlify uses Node 22, set in `netlify.toml`).

## Where things are

- `src/lib/api/client.ts` — reads `data/` (or `fixtures/` with `CV_DATA=fixtures`)
- `src/lib/cv/build-cv.ts` — data → view model: grouping, sorting, confidential masking, skill groups
- `src/lib/cv/config.ts` — summary focus, filter chips, category order
- `src/i18n/ui.ts` — UI labels in English and Spanish
- `src/app/globals.css` — styles

## SEO & AI discoverability

Generated at build time from `data/`:

- `/sitemap.xml`, `/robots.txt` (search engines and AI crawlers explicitly allowed)
- `/llms.txt` and `/llms-full.txt` ([llmstxt.org](https://llmstxt.org)) for AI agents
- JSON-LD `Person` + `ProfilePage` structured data, canonical + hreflang (en/es/x-default)
- Open Graph / Twitter cards with a generated preview image (`/en/opengraph-image`)

Absolute URLs use Netlify's `$URL` (your primary domain). Set `SITE_URL` in Netlify env vars to override.

## Deploy (Netlify)

`netlify.toml` already configures everything: build command `npm run build`, publish directory `out`.
No Netlify Next.js plugin and no secrets are needed. Visitors hitting `/` are redirected to `/es/` or `/en/` based on their browser language.
