import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortDate } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { Negotiation, NegotiationStep } from "@/lib/data/types";

export const Route = createFileRoute("/admin/negotiations")({
  head: () => ({ meta: [{ title: "Negociaciones — Panel NEXUS SPORTS" }] }),
  component: NegotiationsModule,
});

const STEPS: NegotiationStep[] = [
  "Contacto inicial",
  "Reunión",
  "Propuesta",
  "Contraoferta",
  "Documentación",
  "Revisión",
  "Firma",
  "Cerrada",
];
const STATUSES = ["Activa", "Pausada", "Cerrada", "Caída"] as const;

function NegotiationsModule() {
  const { negotiations, players, clubs } = useStore();
  const activeValue = negotiations
    .filter((n) => n.status === "Activa")
    .reduce((s, n) => s + (parseFloat(n.value.replace(/[^0-9.]/g, "")) || 0), 0);

  const columns: DataColumn<Negotiation>[] = [
    {
      header: "Jugador",
      cell: (n) => {
        const p = players.find((x) => x.id === n.playerId);
        return (
          <div className="flex items-center gap-2">
            <Link
              to="/players/$playerId"
              params={{ playerId: n.playerId }}
              className="flex items-center gap-1 font-semibold hover:text-primary"
              target="_blank"
            >
              {p?.name ?? "Jugador"} <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
        );
      },
    },
    {
      header: "Club",
      cell: (n) => clubs.find((c) => c.id === n.clubId)?.name ?? "—",
    },
    { header: "Tipo", cell: (n) => <StatusBadge value={n.type} className="bg-secondary" /> },
    {
      header: "Paso",
      cell: (n) => (
        <Select
          value={n.step}
          onValueChange={(v) => {
            actions.update("negotiations", n.id, { step: v as NegotiationStep });
            toast.success(`Paso actualizado a "${v}"`);
          }}
        >
          <SelectTrigger className="h-8 min-w-[150px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STEPS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Estado",
      cell: (n) => (
        <Select
          value={n.status}
          onValueChange={(v) => {
            actions.update("negotiations", n.id, { status: v as Negotiation["status"] });
            toast.success("Estado actualizado");
          }}
        >
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    { header: "Valor", cell: (n) => <span className="font-semibold">{n.value}</span> },
    {
      header: "Comisión",
      cell: (n) => <span className="text-sm text-muted-foreground">{n.commission}</span>,
    },
    { header: "Owner", cell: (n) => <span className="text-sm">{n.owner}</span> },
    {
      header: "Próxima acción",
      cell: (n) => (
        <span className="max-w-[200px] text-xs text-muted-foreground line-clamp-2">
          {n.nextAction || "—"}
        </span>
      ),
    },
    {
      header: "Actualizado",
      cell: (n) => <span className="text-xs text-muted-foreground">{shortDate(n.lastUpdate)}</span>,
    },
    {
      header: "Acciones",
      cell: (n) => (
        <ConfirmDelete
          onConfirm={() => {
            actions.remove("negotiations", n.id);
            toast.success("Negociación eliminada");
          }}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Negociaciones"
        description="Seguimiento de cada operación en curso: paso, estado, valor y comisión."
      />
      <div className="flex flex-wrap gap-4 rounded-lg border bg-card p-4 text-sm">
        <span>
          <span className="text-muted-foreground">Activas:</span>{" "}
          <span className="font-bold">
            {negotiations.filter((n) => n.status === "Activa").length}
          </span>
        </span>
        <span>
          <span className="text-muted-foreground">Cerradas:</span>{" "}
          <span className="font-bold">
            {negotiations.filter((n) => n.status === "Cerrada").length}
          </span>
        </span>
        <span>
          <span className="text-muted-foreground">Valor en juego (activas):</span>{" "}
          <span className="font-bold text-gold-foreground">USD {activeValue.toFixed(1)}M</span>
        </span>
      </div>
      <DataTable columns={columns} rows={negotiations} keyField={(n) => n.id} />
    </div>
  );
}
