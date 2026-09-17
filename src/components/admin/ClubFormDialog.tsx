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
import { actions } from "@/lib/store";
import type { Club } from "@/lib/data/types";

const RELATIONS = ["Prospecto", "Contactado", "Relación activa", "Cliente", "Inactivo"] as const;

export function ClubFormDialog({ club, trigger }: { club?: Club; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: club?.name ?? "",
    country: club?.country ?? "",
    city: club?.city ?? "",
    league: club?.league ?? "",
    relation: club?.relation ?? "Contactado",
    interestLevel: club?.interestLevel?.toString() ?? "3",
    initials: club?.initials ?? "",
    notes: club?.notes ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre del club es obligatorio.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      country: form.country.trim() || "Argentina",
      city: form.city.trim() || "Ciudad",
      league: form.league.trim() || "Liga",
      relation: form.relation as Club["relation"],
      interestLevel: Math.min(
        5,
        Math.max(1, Number(form.interestLevel) || 3),
      ) as Club["interestLevel"],
      initials:
        form.initials.trim().toUpperCase().slice(0, 3) ||
        form.name
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      colors: club?.colors ?? ["#3b1170", "#6d28d9"],
      notes: form.notes.trim(),
    } as Club;

    if (club) {
      actions.update("clubs", club.id, payload);
      actions.logActivity(`Club actualizado: ${payload.name}`, "club");
      toast.success("Club actualizado");
    } else {
      actions.add("clubs", { ...payload, id: "" });
      actions.logActivity(`Nuevo club en la red: ${payload.name}`, "club");
      toast.success("Club agregado");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {club ? "Editar club" : "Nuevo club"}
          </DialogTitle>
          <DialogDescription>
            Alta o edición de un club de la red de contactos de la agencia.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Nombre *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Atlético del Plata"
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
            <Label>Ciudad</Label>
            <Input
              value={form.city}
              onChange={(e) => set("city")(e.target.value)}
              placeholder="Puerto Mayor"
            />
          </div>
          <div className="grid gap-2">
            <Label>Liga</Label>
            <Input
              value={form.league}
              onChange={(e) => set("league")(e.target.value)}
              placeholder="Liga Meridional"
            />
          </div>
          <div className="grid gap-2">
            <Label>Sigla</Label>
            <Input
              value={form.initials}
              onChange={(e) => set("initials")(e.target.value)}
              placeholder="AP"
            />
          </div>
          <div className="grid gap-2">
            <Label>Relación</Label>
            <Select value={form.relation} onValueChange={set("relation")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RELATIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Interés (1–5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.interestLevel}
              onChange={(e) => set("interestLevel")(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Notas</Label>
            <Textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder="Contexto de la relación con el club…"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {club ? "Guardar cambios" : "Agregar club"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
