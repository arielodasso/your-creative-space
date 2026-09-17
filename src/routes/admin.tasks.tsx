import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Pencil, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { TaskFormDialog } from "@/components/admin/TaskFormDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { dueState } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { Task } from "@/lib/data/types";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tareas — Panel NEXUS SPORTS" }] }),
  component: TasksModule,
});

function TasksModule() {
  const { tasks, players, clubs } = useStore();
  const [filter, setFilter] = useState("Todas");

  const rows = useMemo(
    () => tasks.filter((t) => filter === "Todas" || t.status === filter),
    [tasks, filter],
  );

  const columns: DataColumn<Task>[] = [
    {
      header: "Tarea",
      cell: (t) => (
        <div className="flex items-start gap-2.5">
          <button
            onClick={() => actions.toggleTask(t.id)}
            className={cn(
              "mt-0.5 shrink-0 transition-colors",
              t.status === "Completada"
                ? "text-success"
                : "text-muted-foreground hover:text-primary",
            )}
            aria-label={t.status === "Completada" ? "Reabrir tarea" : "Completar tarea"}
          >
            {t.status === "Completada" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div>
            <p
              className={cn(
                "font-medium leading-snug",
                t.status === "Completada" && "text-muted-foreground line-through",
              )}
            >
              {t.title}
            </p>
            {t.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
            )}
          </div>
        </div>
      ),
      className: "max-w-[420px]",
    },
    {
      header: "Contexto",
      cell: (t) => {
        const p = t.playerId ? players.find((x) => x.id === t.playerId)?.name : null;
        const c = t.clubId ? clubs.find((x) => x.id === t.clubId)?.name : null;
        return (
          <span className="text-xs text-muted-foreground">
            {[p, c].filter(Boolean).join(" · ") || "—"}
          </span>
        );
      },
    },
    { header: "Responsable", cell: (t) => <span className="text-sm">{t.owner}</span> },
    { header: "Prioridad", cell: (t) => <StatusBadge value={t.priority} /> },
    {
      header: "Vence",
      cell: (t) => {
        const due = dueState(t.dueDate);
        return (
          <span
            className={cn(
              "text-xs",
              t.status === "Completada" && "text-muted-foreground",
              due.className,
            )}
          >
            {due.label}
          </span>
        );
      },
    },
    {
      header: "Estado",
      cell: (t) => (
        <Select
          value={t.status}
          onValueChange={(v) => actions.update("tasks", t.id, { status: v as Task["status"] })}
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Pendiente", "En progreso", "Bloqueada", "Completada"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "Acciones",
      cell: (t) => (
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => actions.toggleTask(t.id)}
            aria-label="Alternar estado"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <TaskFormDialog
            task={t}
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
              actions.remove("tasks", t.id);
              toast.success("Tarea eliminada");
            }}
          />
        </div>
      ),
    },
  ];

  const counts = ["Pendiente", "En progreso", "Completada"].map((s) => ({
    status: s,
    count: tasks.filter((t) => t.status === s).length,
  }));

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Tareas"
        description="Seguimiento del plan operativo de la agencia."
        action={
          <TaskFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Nueva tarea
              </Button>
            }
          />
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Todas", "Pendiente", "En progreso", "Bloqueada", "Completada"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2">
          {counts.map((c) => (
            <span key={c.status} className="rounded-md border bg-card px-3 py-1.5 text-xs">
              <span className="text-muted-foreground">{c.status}: </span>
              <span className="font-bold">{c.count}</span>
            </span>
          ))}
        </div>
      </div>

      <DataTable columns={columns} rows={rows} keyField={(t) => t.id} />
    </div>
  );
}
