import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Tag } from './tag-product';
import { HwStatus } from './tag-status';

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconSort({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 4.5L6 1.5 9 4.5M3 7.5L6 10.5 9 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLocate({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function IconSwap({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 2v12M4 2L1 5M4 2l3 3M12 14V2M12 14l-3-3M12 14l3-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6.5 9.5a3 3 0 004.24 0l2-2a3 3 0 00-4.24-4.24L7.5 4.26" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 6.5a3 3 0 00-4.24 0l-2 2a3 3 0 004.24 4.24l1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 4.5L6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium text-[#18171c]">
      {children}
      <IconSort className="text-black/40" />
    </div>
  );
}

function BatteryBar({ percent }: { percent: number }) {
  const safe = Math.min(100, Math.max(0, percent));
  const color =
    safe > 50 ? 'bg-churn-low' : safe > 25 ? 'bg-churn-med' : 'bg-churn-high';
  const isLow = safe <= 25;
  return (
    <div className="flex min-w-[90px] items-center gap-2">
      <div className="h-2.5 w-16 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${safe}%` }}
        />
      </div>
      <span className={`w-9 text-xs font-medium tabular-nums ${isLow ? 'text-churn-high' : 'text-[#18171c]'}`}>
        {safe}%
      </span>
    </div>
  );
}

type TagFilterKey = 'all' | 'online' | 'offline' | 'low_battery' | 'unassigned';

const FILTER_PILLS: { key: TagFilterKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'tags:allTags' },
  { key: 'online', labelKey: 'tags:online' },
  { key: 'offline', labelKey: 'tags:offline' },
  { key: 'low_battery', labelKey: 'tags:lowBattery' },
  { key: 'unassigned', labelKey: 'tags:unassigned' },
];

const productKeyByName: Record<string, string> = {
  Tomato: 'products:items.tomato',
  Banana: 'products:items.banana',
  Apple: 'products:items.apple',
  'Milk 1L': 'products:items.milk1l',
  'Cottage Cheese': 'products:items.cottageCheese',
  'Orange Juice': 'products:items.orangeJuice',
  'White Bread': 'products:items.whiteBread',
  'Chocolate Bar': 'products:items.chocolateBar',
  'Water 1.5L': 'products:items.water15l',
  'Potato Chips': 'products:items.potatoChips',
  Cucumber: 'products:items.cucumber',
  'Greek Yogurt': 'products:items.greekYogurt',
};

function translateLinkedName(
  t: (key: string) => string,
  name: string | null,
) {
  if (!name) return null;
  const key = productKeyByName[name];
  return key ? t(key) : name;
}

type PairTagFormProps = {
  tagInternalId: string;
  productOptions: Array<{ id: string; name: string }>;
};

function PairTagForm({ tagInternalId, productOptions }: PairTagFormProps) {
  const { t } = useTranslation(['common', 'tags']);
  const fetcher = useFetcher();
  const [productId, setProductId] = useState('');

  return (
    <fetcher.Form method="post" className="flex flex-wrap items-center gap-1">
      <input type="hidden" name="intent" value="link-product" />
      <input type="hidden" name="tagInternalId" value={tagInternalId} />
      <select
        name="productId"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="max-w-[140px] rounded-md border border-content-border bg-white px-2 py-1 text-xs text-[#18171c]"
        aria-label={t('tags:pairSelectProduct')}
      >
        <option value="">{t('tags:pairSelectProduct')}</option>
        {productOptions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!productId || fetcher.state !== 'idle'}
        className="inline-flex items-center gap-1 rounded-[10px] border border-accent-mint/30 bg-accent-mint/10 px-2 py-1 text-xs font-medium text-churn-low shadow-sm disabled:opacity-40"
      >
        <IconLink className="shrink-0" />
        {t('common:actions.pair')}
      </button>
    </fetcher.Form>
  );
}

type GatewayInfo = {
  id: string;
  apId: string;
  alias: string | null;
  mac: string | null;
  status: 'online' | 'offline';
  lastSeen: string | null;
};

type BridgeHealth = {
  status: string;
  mqtt: 'connected' | 'disconnected';
  gateway: string;
  uptime: number;
} | null;

const TAG_SCREEN_MAP: Record<string, { size: string; w: number; h: number; colors: number }> = {
  // DS Series
  DS021Q:   { size: '2.13"',  w: 250,  h: 122,  colors: 4 },
  DS026F:   { size: '2.66"',  w: 296,  h: 152,  colors: 2 },
  DS027Q:   { size: '2.67"',  w: 384,  h: 200,  colors: 4 },
  DS029Q:   { size: '2.9"',   w: 296,  h: 128,  colors: 4 },
  DS035Q:   { size: '3.5"',   w: 384,  h: 184,  colors: 4 },
  DS035B:   { size: '3.5"',   w: 384,  h: 184,  colors: 2 },
  DS042Q:   { size: '4.2"',   w: 400,  h: 300,  colors: 4 },
  DS042F:   { size: '4.2"',   w: 400,  h: 300,  colors: 2 },
  DS042B:   { size: '4.2"',   w: 400,  h: 300,  colors: 2 },
  DS043Q:   { size: '4.3"',   w: 522,  h: 152,  colors: 4 },
  DS073:    { size: '7.3"',   w: 800,  h: 480,  colors: 3 },
  DS075:    { size: '7.5"',   w: 800,  h: 480,  colors: 3 },
  DS116:    { size: '11.6"',  w: 960,  h: 640,  colors: 3 },
  // STag Series
  STAG21F:  { size: '2.13"',  w: 250,  h: 122,  colors: 2 },
  STAG21:   { size: '2.13"',  w: 250,  h: 122,  colors: 3 },
  STAG21Q:  { size: '2.13"',  w: 250,  h: 122,  colors: 4 },
  STAG26:   { size: '2.66"',  w: 296,  h: 152,  colors: 3 },
  STAG26Q:  { size: '2.66"',  w: 296,  h: 152,  colors: 4 },
  STAG29:   { size: '2.9"',   w: 296,  h: 128,  colors: 3 },
  STAG29Q:  { size: '2.9"',   w: 296,  h: 128,  colors: 4 },
  STAG29B:  { size: '2.9"',   w: 296,  h: 128,  colors: 2 },
  STAG29A:  { size: '2.9"',   w: 296,  h: 128,  colors: 3 },
  STAG29AQ: { size: '2.9"',   w: 296,  h: 128,  colors: 4 },
  STAG29AB: { size: '2.9"',   w: 296,  h: 128,  colors: 2 },
  STAG42:   { size: '4.2"',   w: 400,  h: 300,  colors: 3 },
  STAG42Q:  { size: '4.2"',   w: 400,  h: 300,  colors: 4 },
  STAG58:   { size: '5.83"',  w: 648,  h: 480,  colors: 3 },
  STAG58Q:  { size: '5.83"',  w: 648,  h: 480,  colors: 4 },
  STAG75:   { size: '7.5"',   w: 800,  h: 480,  colors: 3 },
  STAG116:  { size: '11.6"',  w: 960,  h: 640,  colors: 3 },
  // MTag Series
  MTAG15:   { size: '1.54"',  w: 152,  h: 152,  colors: 3 },
  MTAG15Q:  { size: '1.54"',  w: 200,  h: 200,  colors: 4 },
  MTAG21:   { size: '2.13"',  w: 250,  h: 122,  colors: 3 },
  MTAG21Q:  { size: '2.13"',  w: 250,  h: 122,  colors: 4 },
  MTAG29:   { size: '2.9"',   w: 296,  h: 128,  colors: 3 },
  MTAG29Q:  { size: '2.9"',   w: 296,  h: 128,  colors: 4 },
  MTAG29B:  { size: '2.9"',   w: 296,  h: 128,  colors: 2 },
  MTAG42:   { size: '4.2"',   w: 400,  h: 300,  colors: 3 },
  MTAG42Q:  { size: '4.2"',   w: 400,  h: 300,  colors: 4 },
  MTAG58:   { size: '5.83"',  w: 648,  h: 480,  colors: 3 },
  MTAG58Q:  { size: '5.83"',  w: 648,  h: 480,  colors: 4 },
  MTAG75:   { size: '7.5"',   w: 800,  h: 480,  colors: 3 },
  MTAG75Q:  { size: '7.5"',   w: 800,  h: 480,  colors: 4 },
  // RS Series (6-color)
  RS075:    { size: '7.3"',   w: 800,  h: 480,  colors: 6 },
  RS133:    { size: '13.3"',  w: 1600, h: 1200, colors: 6 },
  RS253:    { size: '25.3"',  w: 3200, h: 1800, colors: 6 },
  RS315:    { size: '31.5"',  w: 2560, h: 1440, colors: 6 },
  // Conference
  RS075V:   { size: '7.3"',   w: 800,  h: 480,  colors: 6 },
  WS075:    { size: '7.5"',   w: 800,  h: 480,  colors: 3 },
  // MZ / WT
  MZ5021:   { size: '2.13"',  w: 250,  h: 122,  colors: 4 },
  WT029A:   { size: '2.9"',   w: 296,  h: 128,  colors: 2 },
};

function resolveScreen(model: string | null) {
  if (!model) return undefined;
  const upper = model.toUpperCase();
  if (TAG_SCREEN_MAP[upper]) return TAG_SCREEN_MAP[upper];
  for (const [code, info] of Object.entries(TAG_SCREEN_MAP)) {
    if (upper.includes(code)) return info;
  }
  return undefined;
}

function colorLabel(c: number) {
  if (c === 6) return '6c';
  if (c === 4) return 'BWRY';
  if (c === 3) return 'BWR';
  return 'BW';
}

const MODEL_OPTIONS = [
  { group: 'DS', models: ['DS021Q','DS026F','DS027Q','DS029Q','DS035Q','DS035B','DS042Q','DS042F','DS043Q','DS116'] },
  { group: 'STag', models: ['STAG21','STAG21Q','STAG26','STAG26Q','STAG29','STAG29Q','STAG29B','STAG42','STAG42Q','STAG58','STAG58Q','STAG116'] },
  { group: 'MTag', models: ['MTAG15','MTAG15Q','MTAG21','MTAG21Q','MTAG29','MTAG29Q','MTAG29B','MTAG42','MTAG42Q','MTAG58','MTAG58Q','MTAG75','MTAG75Q'] },
  { group: 'RS', models: ['RS075','RS133'] },
];

function TagModelBadge({ model, tagInternalId }: { model: string | null; tagInternalId: string }) {
  const { t } = useTranslation(['tags']);
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);
  const screen = resolveScreen(model);
  const isKnown = !!screen;
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) setEditing(false);
  }, [fetcher.state, fetcher.data]);

  const selectLabel = (m: string) => {
    const s = TAG_SCREEN_MAP[m];
    return s ? `${m}  ${s.size} ${s.w}×${s.h} ${colorLabel(s.colors)}` : m;
  };

  if (isKnown && !editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex flex-col gap-0.5 text-start"
        title={t('tags:changeModel')}
      >
        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">
          {model}
        </span>
        <span className="text-[10px] leading-tight text-black/50">
          {screen.size} · {screen.w}×{screen.h} · {colorLabel(screen.colors)}
        </span>
      </button>
    );
  }

  return (
    <fetcher.Form method="post" className="flex items-center gap-1">
      <input type="hidden" name="intent" value="set-model" />
      <input type="hidden" name="tagInternalId" value={tagInternalId} />
      <select
        name="tagModel"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) e.target.form?.requestSubmit();
        }}
        onBlur={() => { if (isKnown) setEditing(false); }}
        disabled={busy}
        className="w-28 rounded border border-indigo-200 bg-indigo-50/50 px-1 py-0.5 text-[10px] text-indigo-700 disabled:opacity-40"
        autoFocus={editing}
      >
        <option value="" disabled>
          {model && !isKnown ? model : t('tags:selectModel')}
        </option>
        {MODEL_OPTIONS.map(({ group, models }) => (
          <optgroup key={group} label={group}>
            {models.map((m) => (
              <option key={m} value={m}>
                {selectLabel(m)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {editing && (
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-[10px] text-black/40 hover:text-black/60"
        >
          ✕
        </button>
      )}
    </fetcher.Form>
  );
}

function RssiIndicator({ rssi }: { rssi: number | null }) {
  if (rssi === null) return <span className="text-xs text-black/30">--</span>;
  const strength = rssi > -50 ? 'strong' : rssi > -70 ? 'medium' : 'weak';
  const color = strength === 'strong' ? 'text-churn-low' : strength === 'medium' ? 'text-churn-med' : 'text-churn-high';
  return (
    <span className={`text-xs font-medium tabular-nums ${color}`}>
      {rssi} dBm
    </span>
  );
}

function GatewayStatusBar({ gateways, bridgeHealth }: { gateways?: GatewayInfo[]; bridgeHealth?: BridgeHealth }) {
  const { t } = useTranslation(['tags']);
  const mqttConnected = bridgeHealth?.mqtt === 'connected';

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-content-border bg-surface-subtle/50 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${mqttConnected ? 'bg-churn-low' : 'bg-black/30'}`} />
        <span className="text-xs font-medium text-[#18171c]">
          MQTT Bridge: {mqttConnected ? t('tags:online') : t('tags:offline')}
        </span>
      </div>
      {gateways?.map((gw) => (
        <div key={gw.id} className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${gw.status === 'online' ? 'bg-churn-low' : 'bg-black/30'}`} />
          <span className="text-xs font-medium text-[#18171c]">
            {gw.alias ?? gw.apId}
          </span>
          {gw.lastSeen && (
            <span className="text-[10px] text-black/40">
              {new Date(gw.lastSeen).toLocaleTimeString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Command dropdown for each tag
// ---------------------------------------------------------------------------

type CommandItem = {
  intent: string;
  labelKey: string;
  color: string;
};

const COMMAND_ITEMS: CommandItem[] = [
  { intent: 'send-version', labelKey: 'tags:commands.getVersion', color: 'text-purple-600' },
  { intent: 'send-wake', labelKey: 'tags:commands.wake', color: 'text-emerald-600' },
  { intent: 'send-led-radio', labelKey: 'tags:commands.ledRadio', color: 'text-amber-600' },
  { intent: 'send-led-ble', labelKey: 'tags:commands.ledBle', color: 'text-amber-600' },
  { intent: 'send-buzzer', labelKey: 'tags:commands.buzzer', color: 'text-orange-600' },
  { intent: 'send-reboot', labelKey: 'tags:commands.reboot', color: 'text-red-500' },
  { intent: 'send-shutdown', labelKey: 'tags:commands.shutdown', color: 'text-red-700' },
];

function TagCommandDropdown({ mac }: { mac: string }) {
  const { t } = useTranslation(['tags']);
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const busy = fetcher.state !== 'idle';

  const result = fetcher.data as
    | { ok: boolean; commandResult?: { status: string; error?: string; stage1Code?: number; stage2Code?: number }; error?: string }
    | undefined;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={busy}
        className="inline-flex items-center gap-1 rounded-[10px] border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-600 shadow-sm disabled:opacity-40"
      >
        {busy ? t('tags:sending') : t('tags:commandMenu')}
        <IconChevronDown />
      </button>

      {open && (
        <div className="absolute inset-e-0 z-30 mt-1 w-44 rounded-lg border border-content-border bg-white py-1 shadow-lg">
          {COMMAND_ITEMS.map(({ intent, labelKey, color }) => (
            <fetcher.Form key={intent} method="post" onSubmit={() => setOpen(false)}>
              <input type="hidden" name="intent" value={intent} />
              <input type="hidden" name="mac" value={mac} />
              <button
                type="submit"
                className={`w-full px-3 py-1.5 text-start text-xs font-medium hover:bg-surface-subtle ${color}`}
              >
                {t(labelKey)}
              </button>
            </fetcher.Form>
          ))}
        </div>
      )}

      {result && (
        <span className={`ms-2 text-[10px] font-medium ${result.ok ? 'text-churn-low' : 'text-churn-high'}`}>
          {result.ok
            ? result.commandResult?.status ?? t('tags:commandStatus.success')
            : result.error ?? t('tags:commandStatus.failed')}
        </span>
      )}
    </div>
  );
}

function LocateTagButton({ mac, fullWidth }: { mac: string; fullWidth?: boolean }) {
  const { t } = useTranslation(['tags', 'common']);
  const fetcher = useFetcher();
  const busy = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="send-locate" />
      <input type="hidden" name="mac" value={mac} />
      <button
        type="submit"
        disabled={busy}
        className={`inline-flex items-center justify-center gap-1 rounded-[10px] border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-sm disabled:opacity-40 ${fullWidth ? 'w-full' : ''}`}
      >
        <IconLocate className="shrink-0" />
        {busy ? t('tags:sending') : t('common:actions.locate')}
      </button>
    </fetcher.Form>
  );
}

function RegisterTagForm() {
  const { t } = useTranslation(['tags']);
  const fetcher = useFetcher();
  const [mac, setMac] = useState('');
  const [bleKey, setBleKey] = useState('');
  const busy = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post" className="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-content-border bg-surface-subtle/30 p-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium uppercase tracking-wider text-black/50">{t('tags:macAddress')}</label>
        <input
          type="text"
          name="mac"
          value={mac}
          onChange={(e) => setMac(e.target.value)}
          placeholder="e1000006638a"
          className="w-36 rounded-md border border-content-border bg-white px-2 py-1.5 font-mono text-xs"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-medium uppercase tracking-wider text-black/50">{t('tags:bleKeyLabel')}</label>
        <input
          type="text"
          name="bleKey"
          value={bleKey}
          onChange={(e) => setBleKey(e.target.value)}
          placeholder="3fa72abb4a794b15"
          className="w-40 rounded-md border border-content-border bg-white px-2 py-1.5 font-mono text-xs"
        />
      </div>
      <input type="hidden" name="intent" value="register-tag" />
      <button
        type="submit"
        disabled={busy || !mac || !bleKey}
        className="rounded-[10px] border border-accent-mint/30 bg-accent-mint/10 px-3 py-1.5 text-xs font-medium text-churn-low shadow-sm disabled:opacity-40"
      >
        {t('tags:registerTag')}
      </button>
    </fetcher.Form>
  );
}

type TagsTableProps = {
  initialTags: Tag[];
  productOptions: Array<{ id: string; name: string }>;
  gateways?: GatewayInfo[];
  bridgeHealth?: BridgeHealth;
};

export function TagsTable({ initialTags, productOptions, gateways, bridgeHealth }: TagsTableProps) {
  const { t } = useTranslation(['common', 'tags', 'products']);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [filter, setFilter] = useState<TagFilterKey>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'online': return tags.filter((x) => x.status === 'online');
      case 'offline': return tags.filter((x) => x.status === 'offline');
      case 'low_battery': return tags.filter((x) => x.battery <= 25);
      case 'unassigned': return tags.filter((x) => !x.linkedProductId);
      default: return tags;
    }
  }, [tags, filter]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((x) => x.id)));
    }
  }

  const bulkLocateFetcher = useFetcher();
  const bulkLocateBusy = bulkLocateFetcher.state !== 'idle';
  const bulkLocateResult = bulkLocateFetcher.data as
    | { ok: boolean; bulkLocate?: { total: number; succeeded: number }; error?: string }
    | undefined;

  function getSelectedMacs(): string[] {
    return filtered
      .filter((tag) => selectedIds.has(tag.id) && tag.mac)
      .map((tag) => tag.mac!);
  }

  function handleBulkSync() {
    if (selectedIds.size === 0) return;
    setTags((prev) =>
      prev.map((x) =>
        selectedIds.has(x.id)
          ? { ...x, lastSync: 'Syncing…' }
          : x,
      ),
    );
    setSelectedIds(new Set());
  }

  if (tags.length === 0) {
    return (
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-[#e2e2e4] bg-white shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)]">
        <div className="flex flex-col items-center gap-4 p-12 text-center">
          <GatewayStatusBar gateways={gateways} bridgeHealth={bridgeHealth} />
          <div className="flex size-16 items-center justify-center rounded-2xl border border-[#e2e2e4] bg-surface-subtle">
            <span className="text-3xl">🏷️</span>
          </div>
          <h2 className="text-xl font-medium text-[#18171c]">{t('tags:empty.title')}</h2>
          <p className="max-w-sm text-sm text-black/50">{t('tags:empty.description')}</p>
          <RegisterTagForm />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e2e2e4] bg-white shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)]">
      <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
        <div className="shrink-0 flex flex-col gap-3 border-b border-black/4 px-4 py-3 sm:px-6">
          <GatewayStatusBar gateways={gateways} bridgeHealth={bridgeHealth} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 text-base font-medium">
                <span className="text-black">{t('tags:tagInventory')}</span>
                <span className="text-sm text-black/30">{tags.length}</span>
              </div>
              <span className="hidden h-[26px] w-px bg-black/10 sm:block" aria-hidden />
              <div className="flex w-full max-w-[270px] items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 ps-2 pe-3 sm:w-[270px]">
                <IconSearch className="text-black/40" />
                <span className="text-sm text-black/40">{t('common:table.searchTagId')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <bulkLocateFetcher.Form method="post">
                <input type="hidden" name="intent" value="bulk-locate" />
                <input type="hidden" name="macs" value={getSelectedMacs().join(',')} />
                <button
                  type="submit"
                  disabled={selectedIds.size === 0 || getSelectedMacs().length === 0 || bulkLocateBusy}
                  className="rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex items-center gap-1.5">
                    <IconLocate />
                    {bulkLocateBusy ? t('tags:sending') : t('tags:bulkLocate')}
                  </span>
                </button>
              </bulkLocateFetcher.Form>
              {bulkLocateResult?.ok && bulkLocateResult.bulkLocate && (
                <span className="text-xs font-medium text-churn-low">
                  {bulkLocateResult.bulkLocate.succeeded}/{bulkLocateResult.bulkLocate.total}
                </span>
              )}
              <button
                type="button"
                onClick={handleBulkSync}
                disabled={selectedIds.size === 0}
                className="rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('common:actions.bulkSync')}
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
            {FILTER_PILLS.map(({ key, labelKey }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === key
                    ? 'bg-dashboard-card text-white shadow-sm'
                    : 'bg-white text-black/70 ring-1 ring-black/10 hover:bg-surface-subtle'
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
          <RegisterTagForm />
        </div>

        {/* Desktop table */}
        <div className="hidden min-h-0 flex-1 overflow-auto p-3 lg:block">
          <div className="overflow-x-auto rounded-lg border border-content-border bg-white shadow-sm">
            <table className="w-full min-w-[1040px] border-collapse text-start text-sm">
              <thead>
                <tr className="border-b border-content-border bg-surface-subtle/50">
                  <th className="w-12 p-3" scope="col">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="mx-auto flex size-5 items-center justify-center rounded border border-content-border bg-white shadow-sm"
                      aria-label={t('common:table.selectAllRows')}
                    >
                      {selectedIds.size === filtered.length && filtered.length > 0 ? (
                        <span className="text-churn-low">✓</span>
                      ) : null}
                    </button>
                  </th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('common:table.tagId')}</HeaderCell></th>
                  <th className="w-32 p-3" scope="col"><HeaderCell>MAC</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('tags:tagModel')}</HeaderCell></th>
                  <th className="p-3" scope="col"><HeaderCell>{t('common:table.linkedProduct')}</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('common:table.battery')}</HeaderCell></th>
                  <th className="w-20 p-3" scope="col"><HeaderCell>RSSI</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('common:table.syncStatus')}</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('common:table.lastSync')}</HeaderCell></th>
                  <th className="w-64 p-3" scope="col"><HeaderCell>{t('common:table.action')}</HeaderCell></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tag) => {
                  const selected = selectedIds.has(tag.id);
                  const rowBg = selected ? 'bg-surface-muted' : 'bg-white hover:bg-surface-subtle/80';
                  const linkedLabel = translateLinkedName(t, tag.linkedProductName);
                  return (
                    <tr key={tag.id} className={`border-b border-black/6 ${rowBg}`}>
                      <td className="p-3 align-middle">
                        <button
                          type="button"
                          onClick={() => toggleSelect(tag.id)}
                          className={`mx-auto flex size-5 items-center justify-center rounded border shadow-sm ${
                            selected
                              ? 'border-[#028254] bg-churn-low text-white'
                              : 'border-content-border bg-white'
                          }`}
                          aria-label={t('common:table.selectTag', { id: tag.tagId })}
                        >
                          {selected ? '✓' : ''}
                        </button>
                      </td>
                      <td className="p-3 align-middle">
                        <span className="rounded bg-[#f0f4f5] px-2 py-1 font-mono text-sm font-semibold text-[#18171c]">
                          {tag.tagId}
                        </span>
                      </td>
                      <td className="p-3 align-middle">
                        {tag.mac ? (
                          <span className="rounded bg-purple-50 px-2 py-1 font-mono text-[11px] text-purple-700">
                            {tag.mac}
                          </span>
                        ) : (
                          <span className="text-xs text-black/30">--</span>
                        )}
                      </td>
                      <td className="p-3 align-middle">
                        <TagModelBadge model={tag.tagModel} tagInternalId={tag.id} />
                      </td>
                      <td className="p-3 align-middle">
                        {linkedLabel ? (
                          <span className="text-sm text-[#18171c]">{linkedLabel}</span>
                        ) : (
                          <span className="text-xs italic text-churn-med">{t('common:table.unassigned')}</span>
                        )}
                      </td>
                      <td className="p-3 align-middle">
                        <BatteryBar percent={tag.battery} />
                      </td>
                      <td className="p-3 align-middle">
                        <RssiIndicator rssi={tag.rssi ?? null} />
                      </td>
                      <td className="p-3 align-middle">
                        <HwStatus status={tag.status} />
                      </td>
                      <td className="p-3 align-middle text-xs text-black/60">
                        {tag.lastAdvertised
                          ? new Date(tag.lastAdvertised).toLocaleString()
                          : tag.lastSync ?? '--'}
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {tag.mac && <TagCommandDropdown mac={tag.mac} />}
                          {!tag.linkedProductId ? (
                            <PairTagForm tagInternalId={tag.id} productOptions={productOptions} />
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-[10px] border border-[#ddd] bg-white px-2.5 py-1.5 text-xs font-medium text-[#18171c] shadow-sm"
                            >
                              <IconSwap className="shrink-0" />
                              {t('common:actions.replace')}
                            </button>
                          )}
                          {tag.mac && <LocateTagButton mac={tag.mac} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="min-h-0 flex-1 overflow-auto p-2 lg:hidden">
          <div className="flex flex-col gap-2">
            {filtered.map((tag) => {
              const batteryColor =
                tag.battery > 50 ? 'bg-churn-low' : tag.battery > 25 ? 'bg-churn-med' : 'bg-churn-high';
              const linkedLabel = translateLinkedName(t, tag.linkedProductName);
              return (
                <article
                  key={tag.id}
                  className="rounded-lg border border-content-border bg-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-[#f0f4f5] px-2 py-1 font-mono text-sm font-semibold text-[#18171c]">
                      {tag.tagId}
                    </span>
                    <HwStatus status={tag.status} />
                  </div>
                  {tag.mac && (
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-purple-50 px-2 py-0.5 font-mono text-[10px] text-purple-700">
                        {tag.mac}
                      </span>
                      <TagModelBadge model={tag.tagModel} tagInternalId={tag.id} />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-[#18171c]">
                    {linkedLabel ? (
                      linkedLabel
                    ) : (
                      <span className="text-xs italic text-churn-med">{t('common:table.unassigned')}</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-12 overflow-hidden rounded-full bg-black/10">
                        <div className={`h-full rounded-full ${batteryColor}`} style={{ width: `${tag.battery}%` }} />
                      </div>
                      <span className="text-[10px] font-medium tabular-nums text-black/60">{tag.battery}%</span>
                    </div>
                    <RssiIndicator rssi={tag.rssi ?? null} />
                    <span className="text-[10px] text-black/40">
                      {tag.lastAdvertised
                        ? new Date(tag.lastAdvertised).toLocaleTimeString()
                        : tag.lastSync}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    {tag.mac && <TagCommandDropdown mac={tag.mac} />}
                    {!tag.linkedProductId ? (
                      <PairTagForm tagInternalId={tag.id} productOptions={productOptions} />
                    ) : (
                      <button
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#ddd] bg-white py-2 text-xs font-medium text-[#18171c] active:bg-surface-subtle"
                      >
                        <IconSwap className="shrink-0" />
                        {t('common:actions.replace')}
                      </button>
                    )}
                    {tag.mac && <LocateTagButton mac={tag.mac} fullWidth />}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
