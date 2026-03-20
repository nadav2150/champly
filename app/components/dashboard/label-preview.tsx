import { useLayoutEffect, useRef } from 'react';
import { renderLabel } from '../../lib/label-renderer';
import type { TemplateLayout } from '../../lib/template-layout';

export type LabelPreviewProps = {
  layout: TemplateLayout;
  data: Record<string, string>;
  scale?: number;
  className?: string;
  fillWidth?: boolean;
  'aria-label'?: string;
};

export function LabelPreview({
  layout,
  data,
  scale = 1,
  className = '',
  fillWidth = false,
  'aria-label': ariaLabel,
}: LabelPreviewProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    renderLabel(canvas, layout, data, { scale });
  }, [layout, data, scale]);

  const styleWidth = layout.width * scale;
  const styleHeight = layout.height * scale;

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        width: fillWidth ? '100%' : `${styleWidth}px`,
        height: fillWidth ? 'auto' : `${styleHeight}px`,
        aspectRatio: fillWidth ? `${layout.width} / ${layout.height}` : undefined,
        display: 'block',
      }}
      aria-label={ariaLabel}
      role="img"
    />
  );
}
