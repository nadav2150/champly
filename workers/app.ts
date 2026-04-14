import { createRequestHandler } from 'react-router';

export interface Env {
  DB: D1Database;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  MQTT_BRIDGE_URL: string;
  MQTT_BRIDGE_API_KEY: string;
}

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
