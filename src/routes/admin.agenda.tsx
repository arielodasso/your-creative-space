import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRightLeft, CalendarDays, Plus, Shield, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
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
import { StatusBadge } from "@/components/StatusBadge";
import { todayISO } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { AgencyEvent, EventType } from "@/lib/data/types";

export const Route = createFileRoute("/admin/agenda")({
  head: () => ({ meta: [{ title: "Agenda — Panel NEXUS SPORTS" }] }),
  component: AgendaModule,
});

const TYPES: EventType[] = [
  "Reunión",
  "Llamada",
  "Videollamada",
  "Partido",
  "Scouting",
  "Seguimiento",
  "Firma",
  "Renovación",
  "Deadline",
];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function dateLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const today = todayISO();
  if (iso === today) return "Hoy";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (iso === tomorrow.toISOString().slice(0, 10)) return "Mañana";
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

function EventFormDialog({ event, trigger }: { event?: AgencyEvent; trigger: React.ReactNode }) {
  const { players, clubs, contacts } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: event?.title ?? "",
    type: event?.type ?? "Reunión",
    date: event?.date ?? todayISO(),
    time: event?.time ?? "10:00",
    playerId: event?.playerId ?? "",
    clubId: event?.clubId ?? "",
    notes: event?.notes ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("El título del evento es obligatorio.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      type: form.type as EventType,
      date: form.date,
      time: form.time,
      playerId: form.playerId || undefined,
      clubId: form.clubId || undefined,
      contactId: event?.contactId,
      notes: form.notes.trim(),
    } as AgencyEvent;
    if (event) {
      actions.update("events", event.id, payload);
      toast.success("Evento actualizado");
    } else {
      actions.add("events", { ...payload, id: "" });
      actions.logActivity(`Evento programado: ${payload.title}`, "reunion");
      toast.success("Evento creado");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {event ? "Editar evento" : "Nuevo evento"}
          </DialogTitle>
          <DialogDescription>
            Programá reuniones, partidos, firmas y deadlines en la agenda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Título *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              placeholder="Reunión con…"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select value={form.type} onValueChange={set("type")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
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
            <Label>Hora</Label>
            <Input type="time" value={form.time} onChange={(e) => set("time")(e.target.value)} />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Notas</Label>
            <Input
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Detalle del evento…"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {event ? "Guardar cambios" : "Crear evento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AgendaModule() {
  const { events, players, clubs, contacts } = useStore();
  const [typeFilter, setTypeFilter] = useState("Todos");

  const sorted = useMemo(
    () =>
      [...events]
        .filter((e) => typeFilter === "Todos" || e.type === typeFilter)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [events, typeFilter],
  );

  const byDate = useMemo(() => {
    const map = new Map<string, AgencyEvent[]>();
    for (const e of sorted) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return [...map.entries()];
  }, [sorted]);

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Agenda"
        description="Reuniones, partidos, scouting y deadlines del equipo."
        action={
          <EventFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Nuevo evento
              </Button>
            }
          />
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los tipos</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{sorted.length} eventos</span>
      </div>

      <div className="grid gap-5">
        {byDate.length === 0 ? (
          <div className="rounded-lg border border-dashed p-16 text-center text-sm text-muted-foreground">
            Sin eventos para el filtro seleccionado.
          </div>
        ) : (
          byDate.map(([date, items]) => (
            <section key={date} className="overflow-hidden rounded-lg border bg-card">
              <header className="surface-navy flex items-center gap-2.5 px-4 py-3">
                <CalendarDays className="h-4 w-4 text-gold" />
                <p className="font-display text-sm font-bold uppercase tracking-wide">
                  {dateLabel(date)}
                </p>
                <span className="ml-auto text-xs text-navy-foreground/60">{date}</span>
              </header>
              <ul className="divide-y">
                {items.map((e) => {
                  const p = e.playerId ? players.find((x) => x.id === e.playerId)?.name : null;
                  const c = e.clubId ? clubs.find((x) => x.id === e.clubId)?.name : null;
                  const ct = e.contactId ? contacts.find((x) => x.id === e.contactId)?.name : null;
                  return (
                    <li key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                      <span className="w-14 shrink-0 font-display font-bold text-primary">
                        {e.time}
                      </span>
                      <StatusBadge value={e.type} />
                      <span className="min-w-0 flex-1 font-medium">{e.title}</span>
                      {p && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" /> {p}
                        </span>
                      )}
                      {c && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Shield className="h-3 w-3" /> {c}
                        </span>
                      )}
                      {ct && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ArrowRightLeft className="h-3 w-3" /> {ct}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <EventFormDialog
                          event={e}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              aria-label="Editar"
                            >
                              <span className="text-xs font-semibold underline underline-offset-2">
                                Editar
                              </span>
                            </Button>
                          }
                        />
                        <button
                          onClick={() => {
                            actions.remove("events", e.id);
                            toast.success("Evento eliminado");
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
