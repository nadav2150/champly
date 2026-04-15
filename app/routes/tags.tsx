import type { Route } from './+types/tags';
import { data, useLoaderData, useOutletContext } from 'react-router';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { getDb, withRetry } from '../db/client.server';
import { listOwnedProductIds } from '../db/products.server';
import { getTagHeaderStats, listZoneIdsForUser } from '../db/stats.server';
import {
  getGatewayStatus,
  linkTagToProduct,
  listAllTags,
  listTagsForTable,
  registerTag,
  setTagModel,
  updateTagKey,
} from '../db/tags.server';
import { isSupportedLanguage } from '../i18n/config';
import {
  getBridgeHealth,
  sendBuzzer,
  sendLedViaBle,
  sendLedViaRadio,
  sendReboot,
  sendShutdown,
  sendTagCommand,
  sendVersion,
  sendWakeQuery,
} from '../lib/mqtt-bridge.server';
import { requireUser } from '../lib/require-user.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';

const emptyTagStats = {
  online: 0,
  lowBattery: 0,
  offline: 0,
  total: 0,
} as const;

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);

  let tags: Awaited<ReturnType<typeof listTagsForTable>> = [];
  let tagStats: Awaited<ReturnType<typeof getTagHeaderStats>> = {
    ...emptyTagStats,
  };
  let gatewayList: Awaited<ReturnType<typeof getGatewayStatus>> = [];
  let bridgeHealth: Awaited<ReturnType<typeof getBridgeHealth>> = null;

  try {
    const [zoneIds, productIds] = await Promise.all([
      withRetry(() => listZoneIdsForUser(db, user.id)),
      withRetry(() => listOwnedProductIds(db, user.id)),
    ]);
    const visibility = { zoneIds, productIds };

    const allTags = await withRetry(() => listAllTags(db));
    const hasVisibleTags =
      zoneIds.length > 0 || productIds.length > 0 || allTags.length > 0;

    if (hasVisibleTags) {
      tags = allTags.length > 0 ? allTags : await withRetry(() => listTagsForTable(db, user.id, visibility));
    }

    [tagStats, gatewayList, bridgeHealth] = await Promise.all([
      withRetry(() => getTagHeaderStats(db, user.id, visibility)),
      withRetry(() => getGatewayStatus(db)),
      getBridgeHealth(env),
    ]);
  } catch (err) {
    console.error('Failed to load tags data:', err);
  }

  const mqttDown = !bridgeHealth || bridgeHealth.mqtt !== 'connected';
  if (mqttDown) {
    gatewayList = gatewayList.map((gw) => ({ ...gw, status: 'offline' as const }));
  }

  return data(
    { tags, tagStats, gateways: gatewayList, bridgeHealth },
    { headers },
  );
}

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const db = getDb(context);

  // ---- Link product to tag ----
  if (intent === 'link-product') {
    const tagInternalId = String(formData.get('tagInternalId') ?? '');
    const productIdRaw = formData.get('productId');
    const productId =
      productIdRaw && String(productIdRaw).length > 0
        ? String(productIdRaw)
        : null;
    const linked = await linkTagToProduct(db, user.id, tagInternalId, productId);
    if (!linked) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
    }
    return data({ ok: true as const }, { headers });
  }

  const DEFAULT_LOCATE_LED = { color: 4, cycles: 20, light_on: 300, light_off: 300, brightness: 50 };

  // ---- Bulk locate ----
  if (intent === 'bulk-locate') {
    const macs = String(formData.get('macs') ?? '')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    if (macs.length === 0) {
      return data({ ok: false as const, error: 'No MACs provided' }, { headers });
    }
    const results = await Promise.allSettled(
      macs.map((m) => sendLedViaBle(env, m, DEFAULT_LOCATE_LED)),
    );
    const succeeded = results.filter((r) => r.status === 'fulfilled' && r.value.status === 'success').length;
    return data({ ok: true as const, bulkLocate: { total: macs.length, succeeded } }, { headers });
  }

  // ---- Named command intents ----
  const mac = String(formData.get('mac') ?? '');
  if (!mac && intent.startsWith('send-')) {
    return data({ ok: false as const, error: 'Missing MAC address' }, { headers });
  }

  try {
    let commandResult: Awaited<ReturnType<typeof sendVersion>> | undefined;

    switch (intent) {
      case 'send-version':
        commandResult = await sendVersion(env, mac);
        break;

      case 'send-wake':
        commandResult = await sendWakeQuery(env, mac);
        break;

      case 'send-led-radio':
        commandResult = await sendLedViaRadio(env, mac, {
          color: parseInt(String(formData.get('color') ?? '3'), 10),
          cycles: parseInt(String(formData.get('cycles') ?? '20'), 10),
          light_on: parseInt(String(formData.get('light_on') ?? '300'), 10),
          light_off: parseInt(String(formData.get('light_off') ?? '300'), 10),
          brightness: parseInt(String(formData.get('brightness') ?? '50'), 10),
        });
        break;

      case 'send-led-ble':
        commandResult = await sendLedViaBle(env, mac, {
          color: parseInt(String(formData.get('color') ?? '3'), 10),
          cycles: parseInt(String(formData.get('cycles') ?? '20'), 10),
          light_on: parseInt(String(formData.get('light_on') ?? '300'), 10),
          light_off: parseInt(String(formData.get('light_off') ?? '300'), 10),
          brightness: parseInt(String(formData.get('brightness') ?? '50'), 10),
        });
        break;

      case 'send-locate':
        commandResult = await sendLedViaBle(env, mac, DEFAULT_LOCATE_LED);
        break;

      case 'send-buzzer':
        commandResult = await sendBuzzer(env, mac, {
          cycles: parseInt(String(formData.get('cycles') ?? '3'), 10),
          on_time: parseInt(String(formData.get('on_time') ?? '500'), 10),
          off_time: parseInt(String(formData.get('off_time') ?? '500'), 10),
        });
        break;

      case 'send-shutdown':
        commandResult = await sendShutdown(env, mac);
        break;

      case 'send-reboot':
        commandResult = await sendReboot(env, mac);
        break;

      // Backward compat: raw action + method
      case 'send-command': {
        const actionNum = parseInt(String(formData.get('action') ?? '74'), 10);
        const method = String(formData.get('method') ?? 'get_req');
        commandResult = await sendTagCommand(env, mac, actionNum, method);
        break;
      }

      default:
        break;
    }

    if (commandResult) {
      return data({ ok: true as const, commandResult }, { headers });
    }
  } catch (err) {
    return data(
      {
        ok: false as const,
        error: err instanceof Error ? err.message : 'Command failed',
      },
      { headers },
    );
  }

  // ---- Set tag model ----
  if (intent === 'set-model') {
    const tagInternalId = String(formData.get('tagInternalId') ?? '');
    const tagModel = String(formData.get('tagModel') ?? '');
    if (!tagInternalId || !tagModel) {
      return data({ ok: false as const, error: 'Tag ID and model required' }, { headers });
    }
    try {
      await setTagModel(db, tagInternalId, tagModel);
      return data({ ok: true as const }, { headers });
    } catch (err) {
      return data(
        {
          ok: false as const,
          error: err instanceof Error ? err.message : 'Update failed',
        },
        { headers },
      );
    }
  }

  // ---- Register tag ----
  if (intent === 'register-tag') {
    const regMac = String(formData.get('mac') ?? '').toLowerCase();
    const bleKey = String(formData.get('bleKey') ?? '');
    const gatewayId = String(formData.get('gatewayId') ?? 'gw-minew-01');
    if (!regMac || !bleKey) {
      return data({ ok: false as const, error: 'MAC and BLE key required' }, { headers });
    }
    try {
      const id = `tag-${Date.now()}`;
      await registerTag(db, id, regMac, bleKey, gatewayId);
      return data({ ok: true as const }, { headers });
    } catch (err) {
      return data(
        {
          ok: false as const,
          error: err instanceof Error ? err.message : 'Registration failed',
        },
        { headers },
      );
    }
  }

  // ---- Update tag BLE key ----
  if (intent === 'update-tag-key') {
    const tagInternalId = String(formData.get('tagInternalId') ?? '');
    const bleKey = String(formData.get('bleKey') ?? '');
    if (!tagInternalId || !bleKey) {
      return data({ ok: false as const, error: 'Tag ID and BLE key required' }, { headers });
    }
    try {
      await updateTagKey(db, tagInternalId, bleKey);
      return data({ ok: true as const }, { headers });
    } catch (err) {
      return data(
        {
          ok: false as const,
          error: err instanceof Error ? err.message : 'Update failed',
        },
        { headers },
      );
    }
  }

  return data({ ok: false as const }, { headers });
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'תגיות — ניטור חומרה' : 'Tags — Hardware Monitor' },
    {
      name: 'description',
      content: isHebrew
        ? 'ניטור ושליטה בתגיות מדף פיזיות: סוללה, קליטה, קישוריות ושיוך.'
        : 'Monitor and control physical shelf tags: battery levels, signal strength, connectivity, and pairing.',
    },
  ];
}

export default function TagsPage() {
  const { tags, tagStats, gateways, bridgeHealth } =
    useLoaderData<typeof loader>();
  const { categories, zones } = useOutletContext<DashboardOutletContext>();

  return (
    <TagControlScreen
      variant="tags"
      categories={categories}
      zones={zones}
      tags={tags}
      tagStats={tagStats}
      gateways={gateways}
      bridgeHealth={bridgeHealth}
    />
  );
}
