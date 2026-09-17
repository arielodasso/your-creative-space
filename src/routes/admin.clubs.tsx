import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ClubFormDialog } from "@/components/admin/ClubFormDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { ClubBadge } from "@/components/ClubBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { actions, useStore } from "@/lib/store";
import type { Club } from "@/lib/data/types";

export const Route = createFileRoute("/admin/clubs")({
  head: () => ({ meta: [{ title: "Clubes — Panel NEXUS SPORTS" }] }),
  component: ClubsModule,
});

function ClubsModule() {
  const { clubs, players } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return clubs.filter((c) =>
      `${c.name} ${c.country} ${c.city} ${c.league}`.toLowerCase().includes(term),
    );
  }, [clubs, q]);

  const columns: DataColumn<Club>[] = [
    {
      header: "Club",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <ClubBadge club={c} size={34} />
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">
              {c.city}, {c.country}
            </p>
          </div>
        </div>
      ),
    },
    { header: "Liga", cell: (c) => <span className="text-sm">{c.league}</span> },
    {
      header: "Representados",
      cell: (c) => {
        const count = players.filter((p) => p.clubId === c.id).length;
        return <span className="text-sm">{count}</span>;
      },
    },
    {
      header: "Interés",
      cell: (c) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i < c.interestLevel ? "bg-gold" : "bg-muted"}`}
            />
          ))}
        </div>
      ),
    },
    { header: "Relación", cell: (c) => <StatusBadge value={c.relation} /> },
    {
      header: "Acciones",
      cell: (c) => (
        <div className="flex items-center gap-0.5">
          <ClubFormDialog
            club={c}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <ConfirmDelete
            onConfirm={() => {
              actions.remove("clubs", c.id);
              toast.success("Club eliminado");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Clubes"
        description="Red de clubes vinculados con su nivel de interés y relación."
        action={
          <ClubFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Nuevo club
              </Button>
            }
          />
        }
      />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar club por nombre, país, liga…"
          className="pl-9"
        />
      </div>
      <DataTable columns={columns} rows={rows} keyField={(c) => c.id} />
    </div>
  );
}
