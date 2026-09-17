import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
  kicker = "Panel de gestión",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  kicker?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="kicker text-primary">{kicker}</p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}
