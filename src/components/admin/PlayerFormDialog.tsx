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
import type { Player } from "@/lib/data/types";

const STATUSES = [
  "Activo",
  "En desarrollo",
  "En evaluación",
  "Lesionado",
  "Transferible",
  "Préstamo",
  "Finalizado",
] as const;
const FOOTS = ["Derecho", "Izquierdo", "Ambidiestro"] as const;

export function PlayerFormDialog({
  player,
  trigger,
  onDone,
}: {
  player?: Player;
  trigger: React.ReactNode;
  onDone?: () => void;
}) {
  const { clubs } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: player?.name ?? "",
    position: player?.position ?? "",
    positionShort: player?.positionShort ?? "",
    age: player?.age?.toString() ?? "20",
    nationality: player?.nationality ?? "",
    foot: player?.foot ?? "Derecho",
    clubId: player?.clubId ?? "",
    number: player?.number?.toString() ?? "10",
    status: player?.status ?? "Activo",
    marketValue: player?.marketValue ?? "USD ",
    contractEnd: player?.contractEnd ?? "",
    agent: player?.agent ?? "",
    bio: player?.bio ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.position.trim()) {
      toast.error("Nombre y posición son obligatorios.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      position: form.position.trim(),
      positionShort: form.positionShort.trim() || form.position.trim().slice(0, 3).toUpperCase(),
      age: Number(form.age) || 20,
      birthDate: player?.birthDate ?? "01/01/2000",
      height: player?.height ?? "1,80 m",
      nationality: form.nationality.trim() || "Argentina",
      foot: form.foot as Player["foot"],
      clubId: form.clubId || "atletico-del-plata",
      number: Number(form.number) || 10,
      status: form.status as Player["status"],
      contractEnd: form.contractEnd || "30/06/2027",
      marketValue: form.marketValue.trim() || "USD 1.0M",
      bio: form.bio.trim(),
      profile: player?.profile ?? "",
      traits: player?.traits ?? [],
      achievements: player?.achievements ?? [],
      stats: player?.stats ?? [],
      history: player?.history ?? [],
      photo: player?.photo ?? "mateo-ferrer",
      agent: form.agent.trim() || "Martín Solari",
      nextAction: player?.nextAction ?? "Definir próximo paso",
      internalNotes: player?.internalNotes ?? "",
      planning: player?.planning ?? { short: "", mid: "", long: "", actions: [] },
    } as Player;

    if (player) {
      actions.update("players", player.id, payload);
      actions.logActivity(`Jugador actualizado: ${payload.name}`, "portfolio");
      toast.success("Jugador actualizado");
    } else {
      actions.add("players", { ...payload, id: "" });
      actions.logActivity(`Nuevo jugador agregado: ${payload.name}`, "portfolio");
      toast.success("Jugador agregado");
    }
    setOpen(false);
    onDone?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {player ? "Editar jugador" : "Nuevo jugador"}
          </DialogTitle>
          <DialogDescription>
            Los campos obligatorios son nombre y posición. El resto se completa con valores por
            defecto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Nombre y apellido *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Nombre apellido"
            />
          </div>
          <div className="grid gap-2">
            <Label>Posición *</Label>
            <Input
              value={form.position}
              onChange={(e) => set("position")(e.target.value)}
              placeholder="Mediocampista ofensivo"
            />
          </div>
          <div className="grid gap-2">
            <Label>Abreviatura</Label>
            <Input
              value={form.positionShort}
              onChange={(e) => set("positionShort")(e.target.value)}
              placeholder="MCO"
            />
          </div>
          <div className="grid gap-2">
            <Label>Edad</Label>
            <Input type="number" value={form.age} onChange={(e) => set("age")(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Nacionalidad</Label>
            <Input
              value={form.nationality}
              onChange={(e) => set("nationality")(e.target.value)}
              placeholder="Argentina"
            />
          </div>
          <div className="grid gap-2">
            <Label>Club</Label>
            <Select value={form.clubId} onValueChange={set("clubId")}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {clubs.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Pie</Label>
            <Select value={form.foot} onValueChange={set("foot")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOOTS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Dorsal</Label>
            <Input
              type="number"
              value={form.number}
              onChange={(e) => set("number")(e.target.value)}
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
            <Label>Valor de mercado</Label>
            <Input
              value={form.marketValue}
              onChange={(e) => set("marketValue")(e.target.value)}
              placeholder="USD 2.8M"
            />
          </div>
          <div className="grid gap-2">
            <Label>Fin de contrato</Label>
            <Input
              value={form.contractEnd}
              onChange={(e) => set("contractEnd")(e.target.value)}
              placeholder="30/06/2027"
            />
          </div>
          <div className="grid gap-2">
            <Label>Agente</Label>
            <Input
              value={form.agent}
              onChange={(e) => set("agent")(e.target.value)}
              placeholder="Martín Solari"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Bio</Label>
            <Textarea
              rows={3}
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              placeholder="Breve descripción del jugador…"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {player ? "Guardar cambios" : "Agregar jugador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
