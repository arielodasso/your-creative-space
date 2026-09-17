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
import type { Contact, ContactType } from "@/lib/data/types";

const TYPES: ContactType[] = [
  "Director deportivo",
  "Scouting",
  "Entrenador",
  "Presidente",
  "Representante",
  "Abogado",
  "Preparador físico",
  "Periodista",
  "Otro",
];

export function ContactFormDialog({
  contact,
  trigger,
}: {
  contact?: Contact;
  trigger: React.ReactNode;
}) {
  const { clubs } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: contact?.name ?? "",
    role: contact?.role ?? "",
    type: contact?.type ?? "Otro",
    clubId: contact?.clubId ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    country: contact?.country ?? "",
    lastContact: contact?.lastContact ?? "",
    nextAction: contact?.nextAction ?? "",
    notes: contact?.notes ?? "",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre del contacto es obligatorio.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || form.type,
      type: form.type as ContactType,
      clubId: form.clubId || undefined,
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country.trim() || "Argentina",
      lastContact: form.lastContact || new Date().toISOString().slice(0, 10),
      nextAction: form.nextAction.trim(),
      notes: form.notes.trim(),
    } as Contact;

    if (contact) {
      actions.update("contacts", contact.id, payload);
      actions.logActivity(`Contacto actualizado: ${payload.name}`, "contacto");
      toast.success("Contacto actualizado");
    } else {
      actions.add("contacts", { ...payload, id: "" });
      actions.logActivity(`Nuevo contacto en la red: ${payload.name}`, "contacto");
      toast.success("Contacto agregado");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {contact ? "Editar contacto" : "Nuevo contacto"}
          </DialogTitle>
          <DialogDescription>
            Alta o edición de un contacto institucional de la red.
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
            <Label>Cargo</Label>
            <Input
              value={form.role}
              onChange={(e) => set("role")(e.target.value)}
              placeholder="Director deportivo"
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
            <Label>País</Label>
            <Input
              value={form.country}
              onChange={(e) => set("country")(e.target.value)}
              placeholder="Argentina"
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              placeholder="nombre@club.demo"
            />
          </div>
          <div className="grid gap-2">
            <Label>Teléfono</Label>
            <Input
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              placeholder="+54 9 11 5555 0000"
            />
          </div>
          <div className="grid gap-2">
            <Label>Último contacto</Label>
            <Input
              value={form.lastContact}
              onChange={(e) => set("lastContact")(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Próxima acción</Label>
            <Input
              value={form.nextAction}
              onChange={(e) => set("nextAction")(e.target.value)}
              placeholder="Siguiente paso…"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label>Notas</Label>
            <Textarea rows={3} value={form.notes} onChange={(e) => set("notes")(e.target.value)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {contact ? "Guardar cambios" : "Agregar contacto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
