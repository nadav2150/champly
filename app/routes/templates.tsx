import type { Route } from './+types/templates';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { data, useLoaderData } from 'react-router';
import { TemplateCard, previewDataForKind } from '../components/dashboard/template-card';
import { TemplatePreviewModal } from '../components/dashboard/template-preview-modal';
import { getDb } from '../db/client.server';
import { listTemplatesWithVariants } from '../db/templates.server';
import type { TemplateRow } from '../db/templates.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';
import { parseLayoutJson } from '../lib/template-layout';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { headers } = await requireUser(request, env);
  const db = getDb(context);
  const templates = await listTemplatesWithVariants(db);
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
      </section>

      {templates.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-dashboard-border bg-dashboard-card">
            <span className="text-3xl">📐</span>
          </div>
          <h2 className="text-xl font-medium text-white">{t('empty.title')}</h2>
          <p className="max-w-sm text-sm text-white/50">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((tmpl) => (
            <TemplateCard key={tmpl.id} template={tmpl} onPreview={handlePreview} />
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
