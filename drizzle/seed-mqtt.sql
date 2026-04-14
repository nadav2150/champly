-- Seed the Minew gateway
INSERT INTO gateways (id, ap_id, mac, alias, status, created_at, mqtt_broker_url, mqtt_status_topic, mqtt_action_topic, mqtt_response_topic)
VALUES (
  'gw-minew-01',
  'ac233fc2572e',
  'ac:23:3f:c2:57:2e',
  'Minew G1-E Main Gateway',
  'offline',
  '2026-04-14T00:00:00.000Z',
  'wss://4fcb281d6bc24198823d688cd8b9de21.s1.eu.hivemq.cloud:8884/mqtt',
  '/gw/ac233fc2572e/status',
  '/gw/ac233fc2572e/action',
  '/gw/ac233fc2572e/response'
);

-- Seed known BLE tags with their MAC and KEY
INSERT INTO tags (id, tag_id, mac, ble_key, gateway_id, status, battery, signal)
VALUES
  ('tag-01', 'e1000002c594', 'e1000002c594', '2df5bab2de1644f9', 'gw-minew-01', 'offline', 100, 'strong'),
  ('tag-02', 'e100000257fa', 'e100000257fa', '492f958316f04e31', 'gw-minew-01', 'offline', 100, 'strong'),
  ('tag-03', 'e1000005e95f', 'e1000005e95f', '398cd467f40f4be3', 'gw-minew-01', 'offline', 100, 'strong'),
  ('tag-04', 'e100000683f8', 'e100000683f8', '79d4c89ee3f24b6e', 'gw-minew-01', 'offline', 100, 'strong'),
  ('tag-05', 'e1000006048a', 'e1000006048a', '9acf447c017e42db', 'gw-minew-01', 'offline', 100, 'strong'),
  ('tag-06', 'e1000006638a', 'e1000006638a', '3fa72abb4a794b15', 'gw-minew-01', 'offline', 100, 'strong'),
  ('tag-07', 'e00000012086', 'e00000012086', 'aba380b267334f2b', 'gw-minew-01', 'offline', 100, 'strong');
