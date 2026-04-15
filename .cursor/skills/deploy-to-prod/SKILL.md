---
name: deploy-to-prod
description: Deploy the Champty app to Cloudflare Workers production. Use when the user says "deploy", "deploy to prod", "push to production", "ship it", or asks to publish the app.
---

# Deploy to Production

## Prerequisites

- Wrangler must be authenticated (`wrangler login` already completed)
- The workspace root is the project directory

## Deploy Command

Run from the project root:

```bash
npm run deploy
```

This executes `npm run build && wrangler deploy`, which:
1. Builds the React Router / Remix app (client + SSR server bundle)
2. Uploads static assets to Cloudflare
3. Deploys the Worker to Cloudflare Workers

## Production URLs

After a successful deploy, the app is live at:
- **https://champty.com** (custom domain)
- **https://www.champty.com** (custom domain)
- **https://champty.nadav2150.workers.dev** (workers.dev fallback)

## Verify Success

A successful deploy prints:
- `Uploaded champty` with timing
- `Deployed champty triggers` with the URLs above
- A `Current Version ID`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check for TypeScript errors: `npx tsc --noEmit` |
| Wrangler auth error | Re-authenticate: `wrangler login` |
| Asset upload timeout | Retry the deploy command |
| D1 migration needed | Run `npx wrangler d1 migrations apply champty-db --remote` before deploying |
