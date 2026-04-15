import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { IoFilterOutline } from 'react-icons/io5';
import { TAG_SCREEN_MAP, resolveScreen } from '../../lib/tag-screen-map';
import type { Tag } from './tag-product';
function Spinner({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

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

function BatteryBar({ percent, size = 'md' }: { percent: number; size?: 'sm' | 'md' }) {
  const safe = Math.min(100, Math.max(0, percent));
  const filled = safe > 87 ? 4 : safe > 62 ? 3 : safe > 37 ? 2 : safe > 12 ? 1 : 0;
  const fill =
    safe > 50 ? 'bg-churn-low' : safe > 25 ? 'bg-churn-med' : 'bg-churn-high';
  const sm = size === 'sm';
  return (
    <div className="flex items-center" title={`${safe}%`}>
      <div className="flex items-center">
        <div className={`flex items-center text-black/${sm ? '40' : '50'} ${sm ? 'h-[9px] w-[17px] gap-[1.5px] rounded-[2px] border-[1.2px] p-[1.5px]' : 'h-[14px] w-[26px] gap-[2px] rounded-[3px] border-[1.5px] p-[2px]'} border-current`}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-full flex-1 ${sm ? 'rounded-[0.5px]' : 'rounded-[1px]'} ${i <= filled ? fill : 'bg-black/8'}`}
            />
          ))}
        </div>
        <div className={`rounded-e-[${sm ? '0.5px' : '1px'}] bg-current text-black/${sm ? '40' : '50'} ${sm ? 'h-[4px] w-[1.5px]' : 'h-[6px] w-[2px]'}`} />
      </div>
    </div>
  );
}

type TagFilterKey = 'all' | 'assigned' | 'unassigned' | 'low_battery';

const FILTER_PILLS: { key: TagFilterKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'tags:allTags' },
  { key: 'assigned', labelKey: 'tags:assigned' },
  { key: 'unassigned', labelKey: 'tags:unassigned' },
  { key: 'low_battery', labelKey: 'tags:lowBattery' },
];

function MobileFilterButton({ filter, onFilterChange }: { filter: TagFilterKey; onFilterChange: (k: TagFilterKey) => void }) {
  const { t } = useTranslation('tags');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = filter !== 'all';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative lg:hidden" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex size-9 items-center justify-center rounded-lg border shadow-sm transition ${
          active
            ? 'border-dashboard-card bg-dashboard-card text-white'
            : 'border-[#ddd] bg-white text-black/50'
        }`}
        aria-label={t('tags:filter')}
      >
        <IoFilterOutline size={18} />
      </button>
      {open && (
        <div className="absolute inset-e-0 z-30 mt-1 w-40 rounded-lg border border-content-border bg-white py-1 shadow-lg">
          {FILTER_PILLS.map(({ key, labelKey }) => (
            <button
              key={key}
              type="button"
              onClick={() => { onFilterChange(key); setOpen(false); }}
              className={`w-full px-3 py-2 text-start text-sm font-medium transition ${
                filter === key
                  ? 'bg-surface-subtle text-[#18171c]'
                  : 'text-black/60 hover:bg-surface-subtle/60'
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const { t } = useTranslation(['tags', 'common']);
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);
  const screen = resolveScreen(model);
  const isKnown = !!screen;
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; error?: string };
    if (res.ok) {
      toast.success(t('common:toast.modelUpdated'));
      setEditing(false);
    } else {
      toast.error(res.error ?? t('common:toast.modelUpdateFailed'));
    }
  }, [fetcher.state, fetcher.data, t]);

  const selectLabel = (m: string) => {
    const s = TAG_SCREEN_MAP[m];
    return s ? `${m}  ${s.size} ${s.w}×${s.h} ${colorLabel(s.colors)}` : m;
  };

  if (isKnown && !editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-start"
        title={t('tags:changeModel')}
      >
        <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">
          {model}
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

function RssiIndicator({ rssi, size = 'md' }: { rssi: number | null; size?: 'sm' | 'md' }) {
  if (rssi === null) return <span className="text-xs text-black/30">--</span>;
  const bars = rssi > -50 ? 3 : rssi > -70 ? 2 : 1;
  const color = bars === 3 ? 'bg-churn-low' : bars === 2 ? 'bg-churn-med' : 'bg-churn-high';
  const label = bars === 3 ? 'Strong' : bars === 2 ? 'Medium' : 'Weak';
  const sm = size === 'sm';
  return (
    <div className={`flex items-end ${sm ? 'gap-[2px]' : 'gap-[3px]'}`} title={`${rssi} dBm`} aria-label={label}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${sm ? 'w-[3px] rounded-[0.5px]' : 'w-[5px] rounded-sm'} ${i <= bars ? color : 'bg-black/10'}`}
          style={{ height: sm ? `${4 + (i - 1) * 3}px` : `${8 + (i - 1) * 5}px` }}
        />
      ))}
    </div>
  );
}

function GatewayStatusBar({ gateways, bridgeHealth }: { gateways?: GatewayInfo[]; bridgeHealth?: BridgeHealth }) {
  const { t } = useTranslation(['tags']);
  const mqttConnected = bridgeHealth?.mqtt === 'connected';

  return (
    <div className="hidden flex-wrap items-center gap-3 rounded-lg border border-content-border bg-surface-subtle/50 px-4 py-2 lg:flex">
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
  { intent: 'send-buzzer', labelKey: 'tags:commands.buzzer', color: 'text-orange-600' },
  { intent: 'send-reboot', labelKey: 'tags:commands.reboot', color: 'text-red-500' },
  { intent: 'send-shutdown', labelKey: 'tags:commands.shutdown', color: 'text-red-700' },
];

function TagCommandDropdown({ mac }: { mac: string }) {
  const { t } = useTranslation(['tags', 'common']);
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; commandResult?: { status: string }; error?: string };
    if (res.ok) {
      toast.success(res.commandResult?.status ?? t('common:toast.commandSuccess'));
    } else {
      toast.error(res.error ?? t('common:toast.commandFailed'));
    }
  }, [fetcher.state, fetcher.data, t]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const allItems: CommandItem[] = COMMAND_ITEMS;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={busy}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/50 shadow-sm transition hover:bg-surface-subtle disabled:opacity-40"
        aria-label={t('tags:commandMenu')}
      >
        {busy ? (
          <Spinner className="size-3.5" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-e-0 z-30 mt-1 w-44 rounded-lg border border-content-border bg-white py-1 shadow-lg">
          {allItems.map(({ intent, labelKey, color }) => (
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
    </div>
  );
}

function LocateTagButton({ mac, fullWidth }: { mac: string; fullWidth?: boolean }) {
  const { t } = useTranslation(['tags', 'common']);
  const fetcher = useFetcher();
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; error?: string };
    if (res.ok) {
      toast.success(t('common:toast.locateSuccess'));
    } else {
      toast.error(res.error ?? t('common:toast.locateFailed'));
    }
  }, [fetcher.state, fetcher.data, t]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="send-locate" />
      <input type="hidden" name="mac" value={mac} />
      <button
        type="submit"
        disabled={busy}
        className={`inline-flex items-center justify-center gap-1 rounded-[10px] border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-sm disabled:opacity-40 ${fullWidth ? 'w-full' : ''}`}
      >
        {busy ? <Spinner className="size-3.5 text-blue-600" /> : <IconLocate className="shrink-0" />}
        <span className={busy ? 'sr-only' : ''}>{t('common:actions.locate')}</span>
      </button>
    </fetcher.Form>
  );
}

function LocateIconCell({ mac }: { mac: string | null }) {
  const { t } = useTranslation(['common']);
  const fetcher = useFetcher();
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; error?: string };
    if (res.ok) {
      toast.success(t('common:toast.locateSuccess'));
    } else {
      toast.error(res.error ?? t('common:toast.locateFailed'));
    }
  }, [fetcher.state, fetcher.data, t]);

  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      {mac ? (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="send-locate" />
          <input type="hidden" name="mac" value={mac} />
          <button
            type="submit"
            disabled={busy}
            className="text-blue-500 active:text-blue-700 disabled:opacity-40"
            aria-label={t('common:actions.locate')}
          >
            {busy ? <Spinner className="size-4 text-blue-500" /> : <IconLocate className="size-4" />}
          </button>
        </fetcher.Form>
      ) : (
        <span className="text-[10px] text-black/30">—</span>
      )}
      <span className="text-[9px] font-medium uppercase tracking-wide text-black/25">{t('common:actions.locate')}</span>
    </div>
  );
}

type TagsTableProps = {
  initialTags: Tag[];
  gateways?: GatewayInfo[];
  bridgeHealth?: BridgeHealth;
};

export function TagsTable({ initialTags, gateways, bridgeHealth }: TagsTableProps) {
  const { t } = useTranslation(['common', 'tags', 'products']);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [filter, setFilter] = useState<TagFilterKey>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'assigned': return tags.filter((x) => !!x.linkedProductId);
      case 'unassigned': return tags.filter((x) => !x.linkedProductId);
      case 'low_battery': return tags.filter((x) => x.battery <= 25);
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

  useEffect(() => {
    if (bulkLocateFetcher.state !== 'idle' || !bulkLocateFetcher.data) return;
    const res = bulkLocateResult;
    if (res?.ok && res.bulkLocate) {
      toast.success(
        t('common:toast.bulkLocateSuccess', {
          succeeded: res.bulkLocate.succeeded,
          total: res.bulkLocate.total,
        }),
      );
    } else {
      toast.error(res?.error ?? t('common:toast.bulkLocateFailed'));
    }
  }, [bulkLocateFetcher.state, bulkLocateFetcher.data, bulkLocateResult, t]);

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
              <div>
                <div className="flex items-center gap-3 text-base font-medium">
                  <span className="text-black">{t('tags:tagInventory')}</span>
                  <span className="text-sm text-black/30">{tags.length}</span>
                </div>
                <p className="mt-0.5 text-xs text-black/40 lg:hidden">{t('tags:subheading')}</p>
              </div>
              <span className="hidden h-[26px] w-px bg-black/10 sm:block" aria-hidden />
              <div className="flex items-center gap-2">
                <div className="flex w-full max-w-[270px] items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 ps-2 pe-3 sm:w-[270px]">
                  <IconSearch className="text-black/40" />
                  <span className="text-sm text-black/40">{t('common:table.searchTagId')}</span>
                </div>
                <MobileFilterButton filter={filter} onFilterChange={setFilter} />
              </div>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <bulkLocateFetcher.Form method="post">
                <input type="hidden" name="intent" value="bulk-locate" />
                <input type="hidden" name="macs" value={getSelectedMacs().join(',')} />
                <button
                  type="submit"
                  disabled={selectedIds.size === 0 || getSelectedMacs().length === 0 || bulkLocateBusy}
                  className="rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="flex items-center gap-1.5">
                    {bulkLocateBusy ? <Spinner className="size-4 text-blue-600" /> : <IconLocate />}
                    {bulkLocateBusy ? t('tags:sending') : t('tags:bulkLocate')}
                  </span>
                </button>
              </bulkLocateFetcher.Form>
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
          <div className="hidden flex-wrap gap-2 lg:flex">
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
        </div>

        {/* Desktop table */}
        <div className="hidden min-h-0 flex-1 overflow-auto p-3 lg:flex lg:flex-col">
          <div className="flex-1 overflow-x-auto rounded-lg border border-content-border bg-white shadow-sm">
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
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('tags:tagModel')}</HeaderCell></th>
                  <th className="p-3" scope="col"><HeaderCell>{t('common:table.linkedProduct')}</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>{t('common:table.battery')}</HeaderCell></th>
                  <th className="w-20 p-3" scope="col"><HeaderCell>{t('common:table.signal')}</HeaderCell></th>
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
                        <div className="flex flex-wrap items-center gap-1.5">
                          {tag.mac && <TagCommandDropdown mac={tag.mac} />}
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
              const linkedLabel = translateLinkedName(t, tag.linkedProductName);
              const signalBars = tag.rssi !== null ? (tag.rssi > -50 ? 3 : tag.rssi > -70 ? 2 : 1) : 0;
              const signalLabel = signalBars === 3 ? t('tags:strong') : signalBars === 2 ? t('tags:medium') : t('tags:weak');
              return (
                <article
                  key={tag.id}
                  className="rounded-xl border border-content-border bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium uppercase tracking-wide text-black/30">{t('tags:tagModel')}</span>
                        <TagModelBadge model={tag.tagModel} tagInternalId={tag.id} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-medium uppercase tracking-wide text-black/30">{t('common:table.tagId')}</span>
                        <span className="rounded bg-[#f0f4f5] px-1.5 py-px font-mono text-[10px] font-medium text-[#18171c]">{tag.tagId}</span>
                        {linkedLabel && (
                          <>
                            <span className="text-black/15">·</span>
                            <span className="truncate text-[11px] text-black/45">{linkedLabel}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {tag.mac && <TagCommandDropdown mac={tag.mac} />}
                  </div>
                  <div className="mt-3 flex items-start border-t border-black/5 pt-3">
                    <div className="flex flex-1 flex-col items-center gap-1">
                      <BatteryBar percent={tag.battery} size="sm" />
                      <span className="text-[10px] text-black/40">{tag.battery}%</span>
                      <span className="text-[9px] font-medium uppercase tracking-wide text-black/25">{t('common:table.battery')}</span>
                    </div>
                    <span className="mt-1 h-6 w-px bg-black/6" aria-hidden />
                    <div className="flex flex-1 flex-col items-center gap-1">
                      <RssiIndicator rssi={tag.rssi ?? null} size="sm" />
                      <span className="text-[10px] text-black/40">{signalLabel}</span>
                      <span className="text-[9px] font-medium uppercase tracking-wide text-black/25">{t('common:table.signal')}</span>
                    </div>
                    <span className="mt-1 h-6 w-px bg-black/6" aria-hidden />
                    <LocateIconCell mac={tag.mac} />
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
