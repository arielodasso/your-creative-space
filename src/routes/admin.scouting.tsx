import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Binoculars, Pencil, Plus, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { actions, useStore } from "@/lib/store";
import type { ScoutingReport, ScoutingStatus } from "@/lib/data/types";

export const Route = createFileRoute("/admin/scouting")({
  head: () => ({ meta: [{ title: "Scouting — Panel NEXUS SPORTS" }] }),
  component: ScoutingModule,
});

const STATUSES: ScoutingStatus[] = [
  "Detectado",
  "En evaluación",
  "Observado",
  "Contactado",
  "Reunión",
  "Incorporado",
  "Descartado",
];
const SCOUTS = ["Camila Duarte", "Rodrigo Paiva", "Martín Solari", "Lucía Menéndez"];

function ScoutFormDialog({
  report,
  trigger,
}: {
  report?: ScoutingReport;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: report?.name ?? "",
    age: report?.age?.toString() ?? "18",
    position: report?.position ?? "",
    club: report?.club ?? "",
    country: report?.country ?? "",
    potential: report?.potential?.toString() ?? "7",
    rating: report?.rating?.toString() ?? "6",
    status: report?.status ?? "Detectado",
    scout: report?.scout ?? "Camila Duarte",
    notes: report?.notes ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const clamp = (v: string) => Math.min(10, Math.max(1, Number(v) || 1));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      age: Number(form.age) || 18,
      position: form.position.trim() || "Mediocampista",
      club: form.club.trim() || "Club",
      country: form.country.trim() || "Argentina",
      potential: clamp(form.potential),
      rating: clamp(form.rating),
      status: form.status as ScoutingStatus,
      scout: form.scout,
      notes: form.notes.trim(),
    } as ScoutingReport;
    if (report) {
      actions.update("scouting", report.id, payload);
      actions.logActivity(`Informe de scouting actualizado: ${payload.name}`, "portfolio");
      toast.success("Informe actualizado");
    } else {
      actions.add("scouting", { ...payload, id: "" });
      actions.logActivity(`Nuevo talento detectado: ${payload.name}`, "portfolio");
      toast.success("Talent detected");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {report ? "Editar informe" : "Nuevo informe de scouting"}
          </DialogTitle>
          <DialogDescription>
            Registro de talentos observados fuera del plantel representado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Nombre *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Nombre apellido"
            />
          </div>
          <div className="grid gap-2">
            <Label>Edad</Label>
            <Input type="number" value={form.age} onChange={(e) => set("age")(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Posición</Label>
            <Input
              value={form.position}
              onChange={(e) => set("position")(e.target.value)}
              placeholder="Extremo izquierdo"
            />
          </div>
          <div className="grid gap-2">
            <Label>Club / Institución</Label>
            <Input
              value={form.club}
              onChange={(e) => set("club")(e.target.value)}
              placeholder="Juveniles de Bahía"
            />
          </div>
          <div className="grid gap-2">
            <Label>País</Label>
            <Input
              value={form.country}
              onChange={(e) => set("country")(e.target.value)}
              placeholder="Argentina"
            />
          </div>
          <div className="grid gap-2">
            <Label>Proyecto (1–10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.potential}
              onChange={(e) => set("potential")(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Nivel actual (1–10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.rating}
              onChange={(e) => set("rating")(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={set("status")}>
              <SelectTrigger>
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
          </div>
          <div className="grid gap-2">
            <Label>Scout</Label>
            <Select value={form.scout} onValueChange={set("scout")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOUTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Notas</Label>
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Observaciones del talento…"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {report ? "Guardar cambios" : "Crear informe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ScoutingModule() {
  const { scouting } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return scouting.filter((s) =>
      `${s.name} ${s.position} ${s.club} ${s.country} ${s.scout} ${s.status}`
        .toLowerCase()
        .includes(term),
    );
  }, [scouting, q]);

  const columns: DataColumn<ScoutingReport>[] = [
    {
      header: "Talento",
      cell: (s) => (
        <div>
          <p className="font-semibold">{s.name}</p>
          <p className="text-xs text-muted-foreground">
            {s.age} años · {s.position}
          </p>
        </div>
      ),
    },
    {
      header: "Procede",
      cell: (s) => (
        <span className="text-sm">
          {s.club}, {s.country}
        </span>
      ),
    },
    {
      header: "Nivel actual",
      cell: (s) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${s.rating * 10}%` }}
            />
          </div>
          <span className="text-xs font-semibold">{s.rating}/10</span>
        </div>
      ),
    },
    {
      header: "Proyección",
      cell: (s) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${s.potential * 10}%` }}
            />
          </div>
          <span className="text-xs font-semibold">{s.potential}/10</span>
        </div>
      ),
    },
    { header: "Estado", cell: (s) => <StatusBadge value={s.status} /> },
    { header: "Scout", cell: (s) => <span className="text-sm">{s.scout}</span> },
    {
      header: "Notas",
      cell: (s) => (
        <span className="max-w-[220px] text-xs text-muted-foreground line-clamp-2">{s.notes}</span>
      ),
    },
    {
      header: "Acciones",
      cell: (s) => (
        <div className="flex items-center gap-0.5">
          <ScoutFormDialog
            report={s}
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
              actions.remove("scouting", s.id);
              toast.success("Informe eliminado");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Scouting"
        description="Talento detectado fuera del plantel, con nivel actual y proyección."
        action={
          <ScoutFormDialog
            trigger={
              <Button size="sm">
                <Binoculars className="mr-1.5 h-4 w-4" /> Nuevo informe
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
          placeholder="Buscar talento…"
          className="pl-9"
        />
      </div>
      <DataTable columns={columns} rows={rows} keyField={(s) => s.id} />
    </div>
  );
}
