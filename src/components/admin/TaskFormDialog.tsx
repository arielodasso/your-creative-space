import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actions, useStore } from "@/lib/store";
import type { Task } from "@/lib/data/types";

const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"] as const;
const STATUSES = ["Pendiente", "En progreso", "Bloqueada", "Completada"] as const;
const OWNERS = ["Martín Solari", "Lucía Menéndez", "Rodrigo Paiva", "Camila Duarte"];

export function TaskFormDialog({ task, trigger }: { task?: Task; trigger: React.ReactNode }) {
  const { players, clubs } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    owner: task?.owner ?? "Martín Solari",
    playerId: task?.playerId ?? "",
    clubId: task?.clubId ?? "",
    priority: task?.priority ?? "Media",
    dueDate: task?.dueDate ?? "",
    status: task?.status ?? "Pendiente",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("El título de la tarea es obligatorio.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      owner: form.owner,
      playerId: form.playerId || undefined,
      clubId: form.clubId || undefined,
      priority: form.priority as Task["priority"],
      dueDate: form.dueDate || new Date().toISOString().slice(0, 10),
      status: form.status as Task["status"],
    } as Task;

    if (task) {
      actions.update("tasks", task.id, payload);
      toast.success("Tarea actualizada");
    } else {
      actions.add("tasks", { ...payload, id: "" });
      actions.logActivity(`Nueva tarea: ${payload.title}`, "tarea");
      toast.success("Tarea creada");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {task ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
          <DialogDescription>Prioridad, vencimiento y responsable de la tarea.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Título *</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              placeholder="Enviar portfolio…"
            />
          </div>
          <div className="grid gap-2">
            <Label>Responsable</Label>
            <Select value={form.owner} onValueChange={set("owner")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OWNERS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Prioridad</Label>
            <Select value={form.priority} onValueChange={set("priority")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Vencimiento</Label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate")(e.target.value)}
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
          <div className="grid gap-2 sm:col-span-2">
            <Label>Descripción</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Detalle de la tarea…"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {task ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
