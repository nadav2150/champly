import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { Tag } from './tag-product';
import { TAGS_DATA } from './tag-product';
import { HwStatus, SignalBars } from './tag-status';

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

const FILTER_PILLS: { key: TagFilterKey; label: string }[] = [
  { key: 'all', label: 'All Tags' },
  { key: 'online', label: 'Online' },
  { key: 'offline', label: 'Offline' },
  { key: 'low_battery', label: 'Low Battery' },
  { key: 'unassigned', label: 'Unassigned' },
];

export function TagsTable() {
  const [tags, setTags] = useState<Tag[]>(TAGS_DATA);
  const [filter, setFilter] = useState<TagFilterKey>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    switch (filter) {
      case 'online': return tags.filter((t) => t.status === 'online');
      case 'offline': return tags.filter((t) => t.status === 'offline');
      case 'low_battery': return tags.filter((t) => t.battery <= 25);
      case 'unassigned': return tags.filter((t) => !t.linkedProduct);
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
      setSelectedIds(new Set(filtered.map((t) => t.id)));
    }
  }

  function handleBulkSync() {
    if (selectedIds.size === 0) return;
    setTags((prev) =>
      prev.map((t) =>
        selectedIds.has(t.id)
          ? { ...t, lastSync: 'Syncing…' }
          : t,
      ),
    );
    setSelectedIds(new Set());
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e2e2e4] bg-white shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)]">
      <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
        <div className="shrink-0 flex flex-col gap-3 border-b border-black/4 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 text-base font-medium">
                <span className="text-black">Tag Inventory</span>
                <span className="text-sm text-black/30">{tags.length}</span>
              </div>
              <span className="hidden h-[26px] w-px bg-black/10 sm:block" />
              <div className="flex w-full max-w-[270px] items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 pl-2 pr-3 sm:w-[270px]">
                <IconSearch className="text-black/40" />
                <span className="text-sm text-black/40">Search by Tag ID</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBulkSync}
              disabled={selectedIds.size === 0}
              className="rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Bulk Sync
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_PILLS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === key
                    ? 'bg-dashboard-card text-white shadow-sm'
                    : 'bg-white text-black/70 ring-1 ring-black/10 hover:bg-surface-subtle'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          <div className="overflow-x-auto rounded-lg border border-content-border bg-white shadow-sm">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-content-border bg-surface-subtle/50">
                  <th className="w-12 p-3" scope="col">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="mx-auto flex size-5 items-center justify-center rounded border border-content-border bg-white shadow-sm"
                      aria-label="Select all rows"
                    >
                      {selectedIds.size === filtered.length && filtered.length > 0 ? (
                        <span className="text-churn-low">✓</span>
                      ) : null}
                    </button>
                  </th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>Tag ID</HeaderCell></th>
                  <th className="p-3" scope="col"><HeaderCell>Linked Product</HeaderCell></th>
                  <th className="w-36 p-3" scope="col"><HeaderCell>Battery</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>Signal</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>Status</HeaderCell></th>
                  <th className="w-28 p-3" scope="col"><HeaderCell>Last Sync</HeaderCell></th>
                  <th className="w-40 p-3" scope="col"><HeaderCell>Action</HeaderCell></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tag) => {
                  const selected = selectedIds.has(tag.id);
                  const rowBg = selected ? 'bg-surface-muted' : 'bg-white hover:bg-surface-subtle/80';
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
                          aria-label={`Select tag ${tag.tagId}`}
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
                        {tag.linkedProduct ? (
                          <span className="text-sm text-[#18171c]">{tag.linkedProduct}</span>
                        ) : (
                          <span className="text-xs italic text-churn-med">— Unassigned —</span>
                        )}
                      </td>
                      <td className="p-3 align-middle">
                        <BatteryBar percent={tag.battery} />
                      </td>
                      <td className="p-3 align-middle">
                        <SignalBars strength={tag.signal} />
                      </td>
                      <td className="p-3 align-middle">
                        <HwStatus status={tag.status} />
                      </td>
                      <td className="p-3 align-middle text-xs text-black/60">
                        {tag.lastSync}
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-1.5">
                          {!tag.linkedProduct ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-[10px] border border-accent-mint/30 bg-accent-mint/10 px-2.5 py-1.5 text-xs font-medium text-churn-low shadow-sm"
                            >
                              <IconLink className="shrink-0" />
                              Pair
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-[10px] border border-[#ddd] bg-white px-2.5 py-1.5 text-xs font-medium text-[#18171c] shadow-sm"
                            >
                              <IconSwap className="shrink-0" />
                              Replace
                            </button>
                          )}
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-[10px] border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-sm"
                          >
                            <IconLocate className="shrink-0" />
                            Locate
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
