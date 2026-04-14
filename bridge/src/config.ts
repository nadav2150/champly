export interface BridgeConfig {
  hivemq: {
    url: string;
    username: string;
    password: string;
  };
  gateway: {
    mac: string;
    statusTopic: string;
    actionTopic: string;
    responseTopic: string;
  };
  cloudflare: {
    apiToken: string;
    accountId: string;
    databaseId: string;
  };
  bridge: {
    port: number;
    apiKey: string;
  };
}

export function buildConfig(env: Record<string, string | undefined>): BridgeConfig {
  function required(name: string): string {
    const value = env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
  }

  const mac = required('GATEWAY_MAC');

  return {
    hivemq: {
      url: required('HIVEMQ_URL'),
      username: required('HIVEMQ_USERNAME'),
      password: required('HIVEMQ_PASSWORD'),
    },
    gateway: {
      mac,
      statusTopic: `/gw/${mac}/status`,
      actionTopic: `/gw/${mac}/action`,
      responseTopic: `/gw/${mac}/response`,
    },
    cloudflare: {
      apiToken: required('CF_API_TOKEN'),
      accountId: required('CF_ACCOUNT_ID'),
      databaseId: required('D1_DATABASE_ID'),
    },
    bridge: {
      port: parseInt(env.BRIDGE_PORT ?? '3001', 10),
      apiKey: required('BRIDGE_API_KEY'),
    },
  };
}

// Backward-compatible global singleton for local dev (index.ts)
// Only built when process.env is available (Node.js runtime)
let _config: BridgeConfig | null = null;

export function getConfig(): BridgeConfig {
  if (!_config) {
    _config = buildConfig(process.env as Record<string, string | undefined>);
  }
  return _config;
}
