import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText, FolderOpen, Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shortDate, dueState } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { DocumentCategory, DocumentItem } from "@/lib/data/types";

export const Route = createFileRoute("/admin/documents")({
  head: () => ({ meta: [{ title: "Documentos — Panel NEXUS SPORTS" }] }),
  component: DocumentsModule,
});

const CATEGORIES: DocumentCategory[] = [
  "Contratos",
  "Pasaportes",
  "Autorizaciones",
  "Informes",
  "Presentaciones",
  "Videos",
  "Administrativa",
];

function EventFormDialog({ doc, trigger }: { doc?: DocumentItem; trigger: React.ReactNode }) {
  const { players, clubs } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: doc?.name ?? "",
    category: doc?.category ?? "Contratos",
    playerId: doc?.playerId ?? "",
    clubId: doc?.clubId ?? "",
    date: doc?.date ?? "",
    expiry: doc?.expiry ?? "",
    status: doc?.status ?? "Vigente",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const wrap = (v: string) => (v === "__none__" ? undefined : v);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre del documento es obligatorio.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      category: form.category as DocumentCategory,
      playerId: wrap(form.playerId),
      clubId: wrap(form.clubId),
      date: form.date || new Date().toISOString().slice(0, 10),
      expiry: form.expiry || undefined,
      status: form.status as DocumentItem["status"],
    } as DocumentItem;
    if (doc) {
      actions.update("documents", doc.id, payload);
      actions.logActivity(`Documento actualizado: ${payload.name}`, "documento");
      toast.success("Documento actualizado");
    } else {
      actions.add("documents", { ...payload, id: "" });
      actions.logActivity(`Documento cargado: ${payload.name}`, "documento");
      toast.success("Documento cargado");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {doc ? "Editar documento" : "Cargar documento"}
          </DialogTitle>
          <DialogDescription>
            Contratos, pasaportes, autorizaciones e informes de la agencia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Nombre *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Contrato de representación — …"
            />
          </div>
          <div className="grid gap-2">
            <Label>Categoría</Label>
            <Select value={form.category} onValueChange={set("category")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={set("status")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Vigente", "Por vencer", "Vencido"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Jugador</Label>
            <Select value={form.playerId} onValueChange={set("playerId")}>
              <SelectTrigger>
                <SelectValue placeholder="Sin jugador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin jugador</SelectItem>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Club</Label>
            <Select value={form.clubId} onValueChange={set("clubId")}>
              <SelectTrigger>
                <SelectValue placeholder="Sin club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin club</SelectItem>
                {clubs.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Fecha</Label>
            <Input type="date" value={form.date} onChange={(e) => set("date")(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Vencimiento</Label>
            <Input
              type="date"
              value={form.expiry}
              onChange={(e) => set("expiry")(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {doc ? "Guardar cambios" : "Cargar documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DocumentsModule() {
  const { documents, players, clubs } = useStore();
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");

  const rows = useMemo(
    () =>
      documents.filter(
        (d) =>
          (category === "Todas" || d.category === category) &&
          (status === "Todos" || d.status === status),
      ),
    [documents, category, status],
  );

  const columns: DataColumn<DocumentItem>[] = [
    {
      header: "Documento",
      cell: (d) => {
        const el = (name: string) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium leading-snug">{name}</p>
              <p className="text-xs text-muted-foreground">{d.category}</p>
            </div>
          </div>
        );
        return el(d.name);
      },
      className: "max-w-[360px]",
    },
    {
      header: "Vinculado a",
      cell: (d) => {
        const p = players.find((x) => x.id === d.playerId)?.name ?? "—";
        const c = clubs.find((x) => x.id === d.clubId)?.name;
        return <span className="text-xs text-muted-foreground">{c ? `${p} · ${c}` : p}</span>;
      },
    },
    {
      header: "Fecha",
      cell: (d) => <span className="text-xs text-muted-foreground">{shortDate(d.date)}</span>,
    },
    {
      header: "Vencimiento",
      cell: (d) => {
        const due = dueState(d.expiry ?? d.date);
        return (
          <span className={`text-xs ${d.expiry ? due.className : "text-muted-foreground/50"}`}>
            {d.expiry ? due.label : "—"}
          </span>
        );
      },
    },
    { header: "Estado", cell: (d) => <StatusBadge value={d.status} /> },
    {
      header: "Acciones",
      cell: (d) => (
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            aria-label="Descargar (mock)"
          >
            <Download className="h-4 w-4" />
          </Button>
          <EventFormDialog
            doc={d}
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
              actions.remove("documents", d.id);
              toast.success("Documento eliminado");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Documentos"
        description="Centro documental con alertas de vencimiento por categoría."
        action={
          <EventFormDialog
            trigger={
              <Button size="sm">
                <FolderOpen className="mr-1.5 h-4 w-4" /> Cargar documento
              </Button>
            }
          />
        }
      />
      <div className="flex flex-wrap items-center gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas las categorías</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los estados</SelectItem>
            {["Vigente", "Por vencer", "Vencido"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{rows.length} documentos</span>
      </div>
      <DataTable columns={columns} rows={rows} keyField={(d) => d.id} />
    </div>
  );
}
