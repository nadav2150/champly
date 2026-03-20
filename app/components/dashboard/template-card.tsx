import { useTranslation } from 'react-i18next';
import type { TemplateRow } from '../../db/templates.server';
import { LabelPreview } from './label-preview';
import { parseLayoutJson, SAMPLE_PRODUCT_DATA } from '../../lib/template-layout';

function IconEye({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function KindBadge({ kind }: { kind: string }) {
  const { t } = useTranslation('templates');
  const label = t(`kinds.${kind}`, kind);
  const styles: Record<string, string> = {
    price: 'bg-accent-mint/15 text-accent-mint',
    promo: 'bg-amber-400/15 text-amber-300',
    info: 'bg-sky-400/15 text-sky-300',
    showcase: 'bg-violet-400/15 text-violet-300',
  };
  const cls = styles[kind] ?? 'bg-white/10 text-white/60';
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export function previewDataForKind(kind: string): Record<string, string> {
  if (kind === 'promo') {
    return { ...SAMPLE_PRODUCT_DATA, category: 'SALE', discount: 'Rabais de 20%' };
  }
  if (kind === 'showcase') {
    return {
      ...SAMPLE_PRODUCT_DATA,
      name: 'Watch Series 10',
      price: '€355',
      discount: 'Rabais de 20%',
      detail1: 'Communication: Bluetooth',
      detail2: 'Étanchéité: 50 mètres',
      detail3: 'Oxygénation: manuelle',
    };
  }
  return { ...SAMPLE_PRODUCT_DATA };
}

type TemplateCardProps = {
  template: TemplateRow;
  onPreview?: (template: TemplateRow) => void;
};

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const { t } = useTranslation('templates');

  const layout =
    template.firstVariant?.layoutJson != null
      ? parseLayoutJson(template.firstVariant.layoutJson)
      : null;

  const previewData = previewDataForKind(template.kind);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] transition hover:border-white/15 hover:bg-white/[0.05]">
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        {layout ? (
          <LabelPreview
            layout={layout}
            data={previewData}
            fillWidth
            aria-label={t('gallery.samplePreview')}
          />
        ) : (
          <div className="flex aspect-[296/128] w-full items-center justify-center bg-white/[0.02] text-[11px] text-white/25">
            {t('gallery.noLayout')}
          </div>
        )}

        {onPreview ? (
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100"
            aria-label={t('gallery.preview')}
          >
            <span className="flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
              <IconEye className="size-3.5" />
              {t('gallery.preview')}
            </span>
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-[13px] font-semibold text-white">
              {template.name}
            </h2>
            <KindBadge kind={template.kind} />
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/35">
            {template.firstVariant ? (
              <span>{template.firstVariant.tagModel} · {template.firstVariant.width}×{template.firstVariant.height}</span>
            ) : null}
            <span>·</span>
            <span>{template.variantCount} {t('variants').toLowerCase()}</span>
            {template.linkedProductCount > 0 ? (
              <>
                <span>·</span>
                <span>{template.linkedProductCount} {t('linkedProducts').toLowerCase()}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
