export { MqttBridgeDO } from './durable-object.js';

export interface Env {
  MQTT_BRIDGE: DurableObjectNamespace;
  HIVEMQ_URL: string;
  HIVEMQ_USERNAME: string;
  HIVEMQ_PASSWORD: string;
  GATEWAY_MAC: string;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
  D1_DATABASE_ID: string;
  BRIDGE_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.MQTT_BRIDGE.idFromName('singleton');
    const stub = env.MQTT_BRIDGE.get(id);
    return stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;
