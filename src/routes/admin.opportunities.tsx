import { createFileRoute, Link } from "@tanstack/react-router";
import { GripVertical, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { OpportunityFormDialog } from "@/components/admin/OpportunityFormDialog";
import { PageHeader } from "@/components/admin/PageHeader";
import { ClubBadge } from "@/components/ClubBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_ORDER } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { Opportunity } from "@/lib/data/types";

export const Route = createFileRoute("/admin/opportunities")({
  head: () => ({ meta: [{ title: "Oportunidades — Panel NEXUS SPORTS" }] }),
  component: OpportunitiesModule,
});

function OpportunitiesModule() {
  const { opportunities, players, clubs, contacts } = useStore();

  function changeStage(id: string, stage: Opportunity["stage"]) {
    actions.moveOpportunity(id, stage);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Oportunidades"
        description="Pipeline visual (Kanban). Mové una oportunidad cambiando su etapa desde cada tarjeta."
        action={
          <OpportunityFormDialog
            trigger={
              <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110">
                <Plus className="mr-1.5 h-4 w-4" /> Nueva oportunidad
              </button>
            }
          />
        }
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max items-start gap-4">
          {STAGE_ORDER.map((stage) => {
            const items = opportunities.filter((o) => o.stage === stage);
            const total = items.reduce((s, o) => {
              const v = parseFloat(o.estimatedValue.replace(/[^0-9.]/g, ""));
              return s + (Number.isFinite(v) ? v : 0);
            }, 0);
            return (
              <div key={stage} className="w-[280px] shrink-0">
                <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-secondary/70 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${["Cerrada"].includes(stage) ? "bg-success" : ["Perdida"].includes(stage) ? "bg-destructive" : ["Negociación", "Propuesta"].includes(stage) ? "bg-gold" : "bg-primary"}`}
                    />
                    <p className="text-xs font-bold uppercase tracking-wide">{stage}</p>
                    <span className="rounded-sm bg-card px-1.5 text-xs font-semibold text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  {total > 0 && (
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      ${total.toFixed(1)}M
                    </span>
                  )}
                </div>

                <div className="min-h-[280px] rounded-b-lg border border-t-0 bg-muted/30 p-2.5">
                  <div className="grid gap-2.5">
                    {items.map((o) => {
                      const player = players.find((p) => p.id === o.playerId);
                      const club = clubs.find((c) => c.id === o.clubId);
                      const contact = contacts.find((c) => c.id === o.contactId);
                      return (
                        <div
                          key={o.id}
                          className="card-hover rounded-md border bg-card p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to="/players/$playerId"
                              params={{ playerId: o.playerId }}
                              className="text-sm font-bold leading-tight hover:text-primary"
                            >
                              {player?.name ?? "Jugador"}
                            </Link>
                            <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {club && <ClubBadge club={club} size={18} />}
                            <span className="text-xs text-muted-foreground">
                              {club?.name ?? "—"}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <StatusBadge value={o.type} className="bg-secondary" />
                            <span className="text-xs font-semibold">{o.estimatedValue}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${o.probability >= 70 ? "bg-success" : o.probability >= 40 ? "bg-gold" : "bg-primary"}`}
                                style={{ width: `${o.probability}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              {o.probability}%
                            </span>
                          </div>
                          {o.nextAction ? (
                            <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground">
                              ↳ {o.nextAction}
                            </p>
                          ) : null}
                          <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2">
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <User className="h-3 w-3" /> {o.owner}
                              {contact ? ` · ${contact.name.split(" ")[0]}` : ""}
                            </span>
                            <Select
                              value={o.stage}
                              onValueChange={(v) => changeStage(o.id, v as Opportunity["stage"])}
                            >
                              <SelectTrigger className="h-7 w-32 border-dashed text-[11px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STAGE_ORDER.filter((s) => s !== o.stage).map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                    {items.length === 0 && (
                      <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                        Sin oportunidades
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        Sugerencia: usá la etapa desde cada tarjeta para mover oportunidades y verificá que se
        registre la actividad en el dashboard.
      </div>
    </div>
  );
}
