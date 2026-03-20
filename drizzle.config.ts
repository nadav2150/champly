import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './app/db/schema.server.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
});
