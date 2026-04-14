import mqtt from 'mqtt';
import { config } from './config.js';

let client: mqtt.MqttClient | null = null;

export function getMqttClient(): mqtt.MqttClient {
  if (!client) throw new Error('MQTT client not initialized');
  return client;
}

export function isMqttConnected(): boolean {
  return client?.connected ?? false;
}

export function connectMqtt(): Promise<mqtt.MqttClient> {
  return new Promise((resolve, reject) => {
    console.log(`[mqtt] Connecting to ${config.hivemq.url}...`);

    client = mqtt.connect(config.hivemq.url, {
      username: config.hivemq.username,
      password: config.hivemq.password,
      protocolVersion: 5,
      clean: true,
      connectTimeout: 10_000,
      reconnectPeriod: 5_000,
    });

    client.on('connect', () => {
      console.log('[mqtt] Connected to HiveMQ Cloud');

      client!.subscribe(
        [config.gateway.statusTopic, config.gateway.responseTopic],
        { qos: 1 },
        (err) => {
          if (err) {
            console.error('[mqtt] Subscribe error:', err);
            reject(err);
          } else {
            console.log(`[mqtt] Subscribed to ${config.gateway.statusTopic}`);
            console.log(`[mqtt] Subscribed to ${config.gateway.responseTopic}`);
            resolve(client!);
          }
        },
      );
    });

    client.on('error', (err) => {
      console.error('[mqtt] Connection error:', err.message);
    });

    client.on('reconnect', () => {
      console.log('[mqtt] Reconnecting...');
    });

    client.on('close', () => {
      console.log('[mqtt] Connection closed');
    });

    client.on('offline', () => {
      console.log('[mqtt] Client offline');
    });

    setTimeout(() => {
      if (!client?.connected) {
        reject(new Error('MQTT connection timeout'));
      }
    }, 15_000);
  });
}

export function disconnectMqtt(): Promise<void> {
  return new Promise((resolve) => {
    if (!client?.connected) {
      resolve();
      return;
    }
    client.end(false, () => {
      console.log('[mqtt] Disconnected');
      resolve();
    });
  });
}

export function publishAction(payload: object): Promise<void> {
  const client = getMqttClient();
  const message = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    client.publish(config.gateway.actionTopic, message, { qos: 1 }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
