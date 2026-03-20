import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TemplateRow } from '../../db/templates.server';
import type { TemplateLayout } from '../../lib/template-layout';
import { LabelPreview } from './label-preview';

type TemplatePreviewModalProps = {
  open: boolean;
  template: TemplateRow | null;
  layout: TemplateLayout | null;
  previewData: Record<string, string>;
  onClose: () => void;
};

export function TemplatePreviewModal({
  open,
  template,
  layout,
  previewData,
  onClose,
}: TemplatePreviewModalProps) {
  const { t } = useTranslation('templates');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => onClose();
    dialog.addEventListener('close', handler);
    return () => dialog.removeEventListener('close', handler);
  }, [onClose]);

  if (!template) return null;

  const createdDate = (() => {
    try {
      return new Date(template.createdAt).toLocaleDateString();
    } catch {
      return template.createdAt;
    }
  })();

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto max-h-[90dvh] w-[95vw] max-w-xl overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1a1d] p-0 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">
            {template.name}
          </h2>
          {template.description ? (
            <p className="mt-0.5 truncate text-[11px] text-white/40">
              {template.description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-md text-white/30 transition hover:bg-white/10 hover:text-white"
          aria-label={t('gallery.closePreview')}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="overflow-auto p-5">
        <div className="overflow-hidden rounded-lg border border-white/[0.06]">
          {layout ? (
            <LabelPreview
              layout={layout}
              data={previewData}
              scale={1.8}
              aria-label={t('gallery.samplePreview')}
              className="w-full"
            />
          ) : (
            <div className="flex aspect-[296/128] w-full items-center justify-center bg-white/[0.02] text-xs text-white/25">
              {t('gallery.noLayout')}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <InfoCell
            label={t('gallery.tagModel')}
            value={template.firstVariant?.tagModel ?? '—'}
          />
          <InfoCell
            label="Size"
            value={`${template.firstVariant?.width ?? 0}×${template.firstVariant?.height ?? 0}`}
          />
          <InfoCell
            label={t('variants')}
            value={String(template.variantCount)}
          />
          <InfoCell
            label={t('createdAt')}
            value={createdDate}
          />
        </div>

        {layout ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {elementSummary(layout).map((item) => (
              <span
                key={item.type}
                className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-2 py-1 text-[10px] text-white/50"
              >
                <span className="font-mono text-accent-mint">{item.count}×</span>
                <span>{item.type}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.03] px-2.5 py-2">
      <p className="text-[9px] font-medium uppercase tracking-wider text-white/25">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-white/80">{value}</p>
    </div>
  );
}

function elementSummary(layout: TemplateLayout): { type: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const el of layout.elements) {
    counts.set(el.type, (counts.get(el.type) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([type, count]) => ({ type, count }));
}
