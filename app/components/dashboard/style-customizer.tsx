import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  EslColor,
  HorizontalAlign,
  RoleStyleOverride,
  SizePreset,
  StyleRole,
  TemplateLayout,
  TemplateStyle,
} from '../../lib/template-layout';
import { getStyleableRoles, ROLE_RULES } from '../../lib/template-layout';

type StyleCustomizerProps = {
  layout: TemplateLayout;
  style: TemplateStyle;
  onChange: (style: TemplateStyle) => void;
};

const ESL_COLOR_HEX: Record<EslColor, string> = {
  white: '#ffffff',
  black: '#000000',
  red: '#b91c1c',
  yellow: '#ca8a04',
};

const SIZE_LABELS: Record<SizePreset, string> = {
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
  '2xl': '2XL',
  '3xl': '3XL',
};

const ALIGN_ICONS: Record<HorizontalAlign, string> = {
  left: '\u2190',
  center: '\u2194',
  right: '\u2192',
};

function SegmentedButtons<T extends string>({
  options,
  labels,
  value,
  onChange,
}: {
  options: T[];
  labels: Record<T, string>;
  value: T | undefined;
  onChange: (val: T) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded px-1.5 py-1 text-[11px] font-medium transition-colors ${
            value === opt
              ? 'border border-accent-mint bg-accent-mint/20 text-accent-mint'
              : 'border border-white/15 text-white/60 hover:bg-white/10'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function ColorDots({
  options,
  value,
  onChange,
}: {
  options: EslColor[];
  value: EslColor | undefined;
  onChange: (val: EslColor) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={color}
          className={`h-6 w-6 rounded-full border-2 transition-shadow ${
            value === color
              ? 'ring-2 ring-accent-mint ring-offset-1 ring-offset-dashboard-card'
              : 'border-white/20'
          }`}
          style={{ backgroundColor: ESL_COLOR_HEX[color] }}
        />
      ))}
    </div>
  );
}

function RoleEditor({
  role,
  override,
  onChange,
  onReset,
}: {
  role: StyleRole;
  override: RoleStyleOverride | undefined;
  onChange: (ovr: RoleStyleOverride) => void;
  onReset: () => void;
}) {
  const { t } = useTranslation(['common']);
  const rule = ROLE_RULES[role];
  if (!rule) return null;

  const ovr = override ?? {};
  const hasChanges =
    ovr.size !== undefined || ovr.color !== undefined ||
    ovr.bold !== undefined || ovr.align !== undefined;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/15 bg-black/20 p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/70" dir="auto">
          {t(rule.labelKey)}
        </span>
        {hasChanges && (
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-white/40 hover:text-white/60"
          >
            {t('common:actions.reset')}
          </button>
        )}
      </div>

      <div>
        <p className="mb-0.5 text-[10px] text-white/40">
          {t('common:style.size')}
        </p>
        <SegmentedButtons
          options={rule.sizePresets}
          labels={SIZE_LABELS}
          value={ovr.size ?? 'm'}
          onChange={(val) => onChange({ ...ovr, size: val === 'm' ? undefined : val })}
        />
      </div>

      {rule.allowedColors.length > 1 && (
        <div>
          <p className="mb-0.5 text-[10px] text-white/40">
            {t('common:style.color')}
          </p>
          <ColorDots
            options={rule.allowedColors}
            value={ovr.color ?? rule.allowedColors[0]}
            onChange={(val) => onChange({ ...ovr, color: val === rule.allowedColors[0] ? undefined : val })}
          />
        </div>
      )}

      {rule.allowedAligns && rule.allowedAligns.length > 1 && (
        <div>
          <p className="mb-0.5 text-[10px] text-white/40">
            {t('common:style.align')}
          </p>
          <SegmentedButtons
            options={rule.allowedAligns}
            labels={ALIGN_ICONS}
            value={ovr.align ?? 'left'}
            onChange={(val) => onChange({ ...ovr, align: val === 'left' ? undefined : val })}
          />
        </div>
      )}

      {rule.allowBoldToggle && (
        <label className="flex cursor-pointer items-center gap-2 rounded border border-white/15 px-2 py-1.5">
          <input
            type="checkbox"
            checked={ovr.bold ?? false}
            onChange={(e) => onChange({ ...ovr, bold: e.target.checked || undefined })}
            className="h-3.5 w-3.5 accent-accent-mint"
          />
          <span className="text-[11px] text-white/60">
            {t('common:style.bold')}
          </span>
        </label>
      )}
    </div>
  );
}

export function StyleCustomizer({
  layout,
  style,
  onChange,
}: StyleCustomizerProps) {
  const { t } = useTranslation(['common']);
  const [expanded, setExpanded] = useState(false);
  const roles = getStyleableRoles(layout);

  if (roles.length === 0) return null;

  const hasAnyOverride = Object.keys(style).length > 0;
  const currentBg = style.background ?? layout.background;

  return (
    <div className="rounded-lg border border-white/15">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2.5"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          {t('common:style.customizeTitle')}
        </span>
        <span className="text-xs text-white/40">
          {expanded ? '\u25B2' : '\u25BC'}
        </span>
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 px-2.5 pb-2.5">
          <div className="flex flex-col gap-1.5 rounded-lg border border-white/15 bg-black/20 p-2.5">
            <span className="text-[11px] font-semibold text-white/70" dir="auto">
              {t('common:style.background')}
            </span>
            <div className="flex gap-1.5">
              {(['white', 'black', 'red', 'yellow'] as const).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => {
                    const next = { ...style };
                    if (bg === layout.background) {
                      delete next.background;
                    } else {
                      next.background = bg;
                    }
                    onChange(next);
                  }}
                  aria-label={bg}
                  className={`h-6 w-6 rounded-full border-2 transition-shadow ${
                    currentBg === bg
                      ? 'ring-2 ring-accent-mint ring-offset-1 ring-offset-dashboard-card'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: ESL_COLOR_HEX[bg] }}
                />
              ))}
            </div>
          </div>

          {roles.map((role) => (
            <RoleEditor
              key={role}
              role={role}
              override={style[role]}
              onChange={(ovr) => {
                const cleaned = { ...ovr };
                if (cleaned.size === undefined) delete cleaned.size;
                if (cleaned.color === undefined) delete cleaned.color;
                if (cleaned.bold === undefined) delete cleaned.bold;
                if (cleaned.align === undefined) delete cleaned.align;

                const next = { ...style };
                if (Object.keys(cleaned).length > 0) {
                  next[role] = cleaned;
                } else {
                  delete next[role];
                }
                onChange(next);
              }}
              onReset={() => {
                const next = { ...style };
                delete next[role];
                onChange(next);
              }}
            />
          ))}

          {hasAnyOverride && (
            <button
              type="button"
              onClick={() => onChange({})}
              className="self-center rounded-md border border-white/20 px-4 py-2 text-xs text-white/50 hover:bg-white/10"
            >
              {t('common:style.resetAll')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
