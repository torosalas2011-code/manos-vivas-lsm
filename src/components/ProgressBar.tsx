export function ProgressBar({
  valor,
  total,
  etiqueta,
}: {
  valor: number;
  total: number;
  etiqueta?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((valor / total) * 100)) : 0;
  return (
    <div>
      {etiqueta ? (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="truncate">{etiqueta}</span>
          <span className="shrink-0">
            {valor}/{total}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={etiqueta ?? "Progreso"}
        className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
