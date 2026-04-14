import type { Route } from './+types/templates';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { data, useLoaderData } from 'react-router';
import { TemplateCard, previewDataForKind } from '../components/dashboard/template-card';
import { TemplatePreviewModal } from '../components/dashboard/template-preview-modal';
import { getDb, withRetry } from '../db/client.server';
import { listTemplatesWithVariants } from '../db/templates.server';
import type { TemplateRow } from '../db/templates.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';
import { parseLayoutJson } from '../lib/template-layout';

const SCREEN_SIZES = [
  { key: 'all',   label: 'All Sizes',  w: 0,   h: 0 },
  { key: '154',   label: '1.54"',       w: 152, h: 152 },
  { key: '213',   label: '2.13"',       w: 250, h: 122 },
  { key: '266',   label: '2.66"',       w: 296, h: 152 },
  { key: '267',   label: '2.67"',       w: 384, h: 200 },
  { key: '290',   label: '2.9"',        w: 296, h: 128 },
  { key: '350',   label: '3.5"',        w: 384, h: 184 },
  { key: '420',   label: '4.2"',        w: 400, h: 300 },
  { key: '430',   label: '4.3"',        w: 522, h: 152 },
  { key: '583',   label: '5.83"',       w: 648, h: 480 },
  { key: '750',   label: '7.5"',        w: 800, h: 480 },
  { key: '116',   label: '11.6"',       w: 960, h: 640 },
] as const;

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { headers } = await requireUser(request, env);
  const db = getDb(context);

  let templates: Awaited<ReturnType<typeof listTemplatesWithVariants>> = [];
  try {
    templates = await withRetry(() => listTemplatesWithVariants(db), 2);
  } catch (err) {
    console.error('Failed to load templates:', err);
  }

  return data({ templates }, { headers });
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'תבניות — תצוגות מדף' : 'Templates — Display Layouts' },
    {
      name: 'description',
      content: isHebrew
        ? 'תבניות מוכנות מראש לתגיות מדף אלקטרוניות.'
        : 'Pre-built display templates for electronic shelf labels.',
    },
  ];
}

export default function TemplatesPage() {
  const { t } = useTranslation('templates');
  const { templates } = useLoaderData<typeof loader>();
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRow | null>(null);
  const [sizeFilter, setSizeFilter] = useState('290');

  const selectedSize = SCREEN_SIZES.find((s) => s.key === sizeFilter) ?? SCREEN_SIZES[0];

  const templatesWithMatchingVariant = useMemo(() => {
    if (sizeFilter === 'all') return templates;
    return templates.filter((tmpl) =>
      tmpl.variants.some((v) => v.width === selectedSize.w && v.height === selectedSize.h),
    );
  }, [templates, sizeFilter, selectedSize]);

  const getVariantForSize = useCallback(
    (tmpl: TemplateRow) => {
      if (sizeFilter === 'all') return tmpl.firstVariant;
      return (
        tmpl.variants.find((v) => v.width === selectedSize.w && v.height === selectedSize.h) ??
        tmpl.firstVariant
      );
    },
    [sizeFilter, selectedSize],
  );

  const previewLayout = useMemo(() => {
    const raw = previewTemplate?.firstVariant?.layoutJson;
    if (!raw) return null;
    return parseLayoutJson(raw);
  }, [previewTemplate]);

  const previewData = useMemo(
    () => previewDataForKind(previewTemplate?.kind ?? 'price'),
    [previewTemplate?.kind],
  );

  const handlePreview = useCallback((tmpl: TemplateRow) => {
    setPreviewTemplate(tmpl);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewTemplate(null);
  }, []);

  const sizeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of SCREEN_SIZES) {
      if (s.key === 'all') {
        counts[s.key] = templates.length;
      } else {
        counts[s.key] = templates.filter((tmpl) =>
          tmpl.variants.some((v) => v.width === s.w && v.height === s.h),
        ).length;
      }
    }
    return counts;
  }, [templates]);

  return (
    <div className="flex w-full flex-1 flex-col overflow-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <section
        className="w-full max-w-none rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]"
        aria-labelledby="templates-heading"
      >
        <div>
          <h1
            id="templates-heading"
            className="text-3xl font-medium text-white md:text-4xl"
          >
            {t('heading')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/50">
            {t('description')}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SCREEN_SIZES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSizeFilter(key)}
              disabled={sizeCounts[key] === 0}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                sizeFilter === key
                  ? 'bg-white text-[#0d171a] shadow-sm'
                  : 'bg-white/10 text-white/70 hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30'
              }`}
            >
              {label}
              <span className="ms-1 text-[10px] opacity-60">{sizeCounts[key]}</span>
            </button>
          ))}
        </div>
      </section>

      {templatesWithMatchingVariant.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-dashboard-border bg-dashboard-card">
            <span className="text-3xl">📐</span>
          </div>
          <h2 className="text-xl font-medium text-white">{t('empty.title')}</h2>
          <p className="max-w-sm text-sm text-white/50">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {templatesWithMatchingVariant.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              activeVariant={getVariantForSize(tmpl)}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}

      <TemplatePreviewModal
        open={previewTemplate !== null}
        template={previewTemplate}
        layout={previewLayout}
        previewData={previewData}
        onClose={handleClosePreview}
      />
    </div>
  );
}
