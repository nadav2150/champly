function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  hivemq: {
    url: required('HIVEMQ_URL'),
    username: required('HIVEMQ_USERNAME'),
    password: required('HIVEMQ_PASSWORD'),
  },
  gateway: {
    mac: required('GATEWAY_MAC'),
    get statusTopic() {
      return `/gw/${config.gateway.mac}/status`;
    },
    get actionTopic() {
      return `/gw/${config.gateway.mac}/action`;
    },
    get responseTopic() {
      return `/gw/${config.gateway.mac}/response`;
    },
  },
  cloudflare: {
    apiToken: required('CF_API_TOKEN'),
    accountId: required('CF_ACCOUNT_ID'),
    databaseId: required('D1_DATABASE_ID'),
  },
  bridge: {
    port: parseInt(process.env.BRIDGE_PORT ?? '3001', 10),
    apiKey: required('BRIDGE_API_KEY'),
  },
} as const;
