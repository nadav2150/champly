# Champty

ESL / electronic shelf label dashboard: React Router 7 on **Cloudflare Workers**, **D1** (SQLite) with **Drizzle ORM**, and **Supabase** for authentication only.

## Setup

### Install

```bash
npm install
```

### Environment (local)

Copy [`.dev.vars.example`](.dev.vars.example) to `.dev.vars` and set:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Local dev loads these via Wrangler (same as production secrets pattern).

### Database (D1)

Migrations live in [`drizzle/migrations/`](drizzle/migrations/). Seed data: [`drizzle/seed.sql`](drizzle/seed.sql).

**Local**

```bash
npx wrangler d1 migrations apply champty-db --local
npm run db:seed:local
```

**Remote** (after `wrangler d1 create` / binding `database_id` in [`wrangler.json`](wrangler.json))

```bash
npx wrangler d1 migrations apply champty-db --remote
npm run db:seed:remote
```

### Schema changes (Drizzle)

Edit [`app/db/schema.server.ts`](app/db/schema.server.ts), then:

```bash
npm run db:generate
```

Review generated SQL, then add/apply migrations with Wrangler as above.

## Development

```bash
npm run dev
```

Runs the app in the Workers runtime via the Cloudflare Vite plugin (D1 binding available as `context.cloudflare.env.DB`).

## Production build & deploy

```bash
npm run build
npm run deploy
```

Configure Supabase keys for production with:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
```

## Project notes

- **Auth**: Supabase session cookies; guarded by [`app/routes/dashboard-layout.tsx`](app/routes/dashboard-layout.tsx).
- **Data**: D1 via repositories under [`app/db/*.server.ts`](app/db/).
- **Product ↔ tag link**: `tags.linked_product_id` only (no `tag_id` on `products`).

---

Built with React Router and Tailwind CSS.
