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
import { ACTIVE_STAGES, STAGE_ORDER } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { Opportunity } from "@/lib/data/types";

const TYPES = ["Transferencia", "Préstamo", "Renovación", "Prueba"] as const;

export function OpportunityFormDialog({
  opp,
  trigger,
}: {
  opp?: Opportunity;
  trigger: React.ReactNode;
}) {
  const { players, clubs, contacts } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    playerId: opp?.playerId ?? "",
    clubId: opp?.clubId ?? "",
    contactId: opp?.contactId ?? "",
    type: opp?.type ?? "Transferencia",
    estimatedValue: opp?.estimatedValue ?? "",
    probability: opp?.probability?.toString() ?? "50",
    stage: opp?.stage ?? "Nueva",
    owner: opp?.owner ?? "",
    nextAction: opp?.nextAction ?? "",
    notes: opp?.notes ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.playerId || !form.clubId) {
      toast.error("Seleccioná jugador y club.");
      return;
    }
    const payload = {
      playerId: form.playerId,
      clubId: form.clubId,
      contactId: form.contactId || "c01",
      type: form.type as Opportunity["type"],
      estimatedValue: form.estimatedValue.trim() || "USD 1.0M",
      probability: Math.min(100, Math.max(0, Number(form.probability) || 50)),
      stage: form.stage as Opportunity["stage"],
      owner: form.owner || "Martín Solari",
      nextAction: form.nextAction.trim(),
      notes: form.notes.trim(),
    } as Opportunity;

    if (opp) {
      actions.update("opportunities", opp.id, payload);
      actions.logActivity(
        `Oportunidad actualizada: ${players.find((p) => p.id === payload.playerId)?.name}`,
        "oportunidad",
      );
      toast.success("Oportunidad actualizada");
    } else {
      actions.add("opportunities", {
        ...payload,
        id: "",
        date: new Date().toISOString().slice(0, 10),
      });
      actions.logActivity(
        `Nueva oportunidad creada: ${players.find((p) => p.id === payload.playerId)?.name}`,
        "oportunidad",
      );
      toast.success("Oportunidad creada");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {opp ? "Editar oportunidad" : "Nueva oportunidad"}
          </DialogTitle>
          <DialogDescription>Vincular jugador, club y contacto en el pipeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Jugador *</Label>
            <Select value={form.playerId} onValueChange={set("playerId")}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Club *</Label>
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
            <Label>Contacto</Label>
            <Select value={form.contactId} onValueChange={set("contactId")}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label>Valor estimado</Label>
            <Input
              value={form.estimatedValue}
              onChange={(e) => set("estimatedValue")(e.target.value)}
              placeholder="USD 2.8M"
            />
          </div>
          <div className="grid gap-2">
            <Label>Probabilidad (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={form.probability}
              onChange={(e) => set("probability")(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Etapa</Label>
            <Select value={form.stage} onValueChange={set("stage")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGE_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Owner</Label>
            <Input
              value={form.owner}
              onChange={(e) => set("owner")(e.target.value)}
              placeholder="Martín Solari"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Próxima acción</Label>
            <Input
              value={form.nextAction}
              onChange={(e) => set("nextAction")(e.target.value)}
              placeholder="¿Cuál es el siguiente paso?"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Notas</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => set("notes")(e.target.value)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {opp ? "Guardar cambios" : "Crear oportunidad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
