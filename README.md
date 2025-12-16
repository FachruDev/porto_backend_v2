# Porto CMS Backend

Portfolio CMS API built with Bun, Express 5, Prisma, and Cloudflare R2 storage.

## Quick start

```bash
bun install            # install deps
bunx prisma generate   # generate Prisma client
bunx prisma db push    # create/update tables from schema
bunx prisma db seed    # seed default user + singleton defaults
bun run dev            # start API on http://localhost:4000
```

## Environment

- `DB` - Postgres connection string.
- `S3` - R2 endpoint (e.g. `https://<account>.r2.cloudflarestorage.com/<bucket>`).
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` - API keys for R2.
- `R2_BUCKET` - Bucket name (optional if embedded in `S3`).
- `R2_PUBLIC_BASE_URL` - Public CDN/base URL for generated file links (optional).
- `AUTH_JWT_SECRET` - long random string for signing JWTs.
- `AUTH_JWT_EXPIRES_IN` - JWT expiry (e.g. `7d`).
- `PORT` - API port (defaults to 4000).

> Update `.env` with the keys above before running `prisma db push`. A default seed user (`fachru2006@gmail.com` / password `password123`) is created via `prisma db seed`.

## API surface (prefix: `/api`)

- `GET /health` - DB health probe.
- `/auth/login`, `/auth/register`, `/auth/logout` - auth endpoints (JWT issued on login/register).
- `/users` - CRUD users (author data now lives here, includes `bio` and `profile` fields). Protected.
- `/cms/config/web` - GET/PUT single web config.
- `/cms/heroes` - CRUD hero (singleton) with translations (EN/ID).
- `/cms/about` - GET/PUT about me (singleton) with translations.
- `/cms/experiences` - CRUD experiences (supports `order`).
- `/cms/skills` - CRUD skills (enum level).
- `/cms/certificates` - CRUD certificates with translations.
- `/cms/projects` - CRUD projects with translations; `/cms/projects/:id/images` to manage images.
- `/cms/socials` - CRUD social media links.
- `/cms/contact/forms` - Submit contact form entries (public POST). Listing requires auth.
- `/cms/contact/info` - GET/PUT contact information.
- `/cms/blog/categories` - CRUD blog categories with translations.
- `/cms/blog/posts` - CRUD blog posts with translations (status, SEO fields, published date handling) linked to `users` as authors.

## Project layout

- `src/index.ts` - server bootstrap.
- `src/app.ts` - Express app + middleware wiring.
- `src/config/*` - env loader, Prisma client, R2 storage helper.
- `src/routes` - API routes (`index.ts` + `cms.ts` aggregator) and resource routers in `src/routes/cms`.
- `src/controller/cms` - controllers per CMS resource; `src/controller/auth|user.ts` for auth/user flows.
- `src/schemas/cms` - Zod validations per resource; `src/schemas/auth.ts` and `src/schemas/user.ts` for auth/user.
- `src/middleware/errorHandler.ts` - centralized error responses.
- `src/middleware/requireAuth.ts` - JWT guard (applied to non-GET CMS routes and all user routes).

## Storage notes

`src/config/storage.ts` wires an S3-compatible client for Cloudflare R2. Upload/delete helpers throw if credentials are missing. Populate the R2 env vars and use the helper inside controllers when you add file upload flows.

## I18n model (EN/ID)

- Option C implemented: translation tables per entity (`*_translation`) with `locale` enum (`EN`, `ID`).
- Payload shape uses `translations: [{ locale: "EN", ... }, { locale: "ID", ... }]` for hero, about, experience, certificate, project, blog category, blog post. Slugs stay single-language (English suggested).
- GET returns all translations; you can pick locale client-side. Publishing/slug generation falls back to the EN translation (or first entry) if `slug` omitted.
