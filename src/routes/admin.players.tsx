import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { PlayerFormDialog } from "@/components/admin/PlayerFormDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { playerPhotos } from "@/lib/data/photos";
import { actions, useStore } from "@/lib/store";
import type { Player } from "@/lib/data/types";

export const Route = createFileRoute("/admin/players")({
  head: () => ({ meta: [{ title: "Jugadores — Panel NEXUS SPORTS" }] }),
  component: PlayersModule,
});

function PlayersModule() {
  const { players, clubs } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return players.filter((p) => {
      const club = clubs.find((c) => c.id === p.clubId)?.name ?? "";
      return `${p.name} ${p.position} ${p.nationality} ${club}`.toLowerCase().includes(term);
    });
  }, [players, clubs, q]);

  const columns: DataColumn<Player>[] = [
    {
      header: "Jugador",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={playerPhotos[p.photo]}
            alt={p.name}
            width={40}
            height={50}
            className="h-12 w-10 rounded-sm object-cover object-top"
          />
          <div>
            <p className="font-semibold">{p.name}</p>
            <p className="text-xs text-muted-foreground">
              {p.number} · {p.position}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Club",
      cell: (p) => {
        const club = clubs.find((c) => c.id === p.clubId);
        return <span className="text-sm">{club?.name ?? "—"}</span>;
      },
    },
    { header: "Edad", cell: (p) => `${p.age} · ${p.nationality}` },
    {
      header: "Valor",
      cell: (p) => <span className="font-semibold">{p.marketValue}</span>,
    },
    {
      header: "Estado",
      cell: (p) => <StatusBadge value={p.status} />,
    },
    {
      header: "Contrato",
      cell: (p) => <span className="text-xs text-muted-foreground">{p.contractEnd}</span>,
    },
    {
      header: "Próximo paso",
      cell: (p) => (
        <span className="line-clamp-1 max-w-[220px] text-xs text-muted-foreground">
          {p.nextAction}
        </span>
      ),
    },
    {
      header: "Acciones",
      cell: (p) => (
        <div className="flex items-center gap-0.5">
          <Link
            to="/players/$playerId"
            params={{ playerId: p.id }}
            target="_blank"
            aria-label="Ver perfil público"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <PlayerFormDialog
            player={p}
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
              actions.remove("players", p.id);
              toast.success("Jugador eliminado");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Jugadores"
        description="Gestión del plantel representado. Edición completa de los datos mock."
        action={
          <PlayerFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Nuevo jugador
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
          placeholder="Buscar por nombre, posición, club…"
          className="pl-9"
        />
      </div>

      <DataTable columns={columns} rows={rows} keyField={(p) => p.id} />
    </div>
  );
}
