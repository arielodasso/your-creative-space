import type { OpportunityStage } from "@/lib/data/types";

export const STAGE_ORDER: OpportunityStage[] = [
  "Nueva",
  "Contactado",
  "Interés",
  "Negociación",
  "Propuesta",
  "Cerrada",
  "Perdida",
];

export const ACTIVE_STAGES: OpportunityStage[] = [
  "Nueva",
  "Contactado",
  "Interés",
  "Negociación",
  "Propuesta",
];

export function shortDate(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export type DueState = { label: string; className: string };

export function dueState(date?: string): DueState {
  if (!date) return { label: "—", className: "text-muted-foreground" };
  const diff = Math.ceil(
    (new Date(date + "T00:00:00").getTime() - new Date(todayISO() + "T00:00:00").getTime()) /
      86400000,
  );
  if (diff < 0) return { label: `Vencida (${-diff}d)`, className: "font-medium text-destructive" };
  if (diff === 0) return { label: "Hoy", className: "font-medium text-warning-foreground" };
  if (diff <= 3) return { label: `En ${diff}d`, className: "font-medium text-warning-foreground" };
  return { label: shortDate(date), className: "text-muted-foreground" };
}
