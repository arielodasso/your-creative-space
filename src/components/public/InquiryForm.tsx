import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { actions, useStore } from "@/lib/store";

export function InquiryForm({ defaultPlayerId }: { defaultPlayerId?: string }) {
  const { players } = useStore();
  const [form, setForm] = useState({
    name: "", organization: "", role: "", email: "", phone: "",
    playerId: defaultPlayerId ?? "", message: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Completá al menos nombre y email.");
      return;
    }
    actions.addInquiry(form);
    actions.logActivity(`Nueva solicitud de información de ${form.name}${form.organization ? ` (${form.organization})` : ""}`, "contacto");
    toast.success("Solicitud enviada", { description: "El equipo de la agencia la verá en el panel de gestión." });
    setForm({ name: "", organization: "", role: "", email: "", phone: "", playerId: defaultPlayerId ?? "", message: "" });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input id="name" value={form.name} onChange={set("name")} placeholder="Nombre y apellido" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="org">Organización</Label>
        <Input id="org" value={form.organization} onChange={set("organization")} placeholder="Club o institución" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Cargo</Label>
        <Input id="role" value={form.role} onChange={set("role")} placeholder="Director deportivo, scout…" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="nombre@club.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="+54 9 11 0000 0000" />
      </div>
      <div className="grid gap-2">
        <Label>Jugador de interés</Label>
        <Select value={form.playerId} onValueChange={(v) => setForm({ ...form, playerId: v })}>
          <SelectTrigger><SelectValue placeholder="Seleccionar jugador" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Consulta general</SelectItem>
            {players.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea id="message" rows={5} value={form.message} onChange={set("message")} placeholder="Contanos qué necesitás…" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">Enviar solicitud</Button>
      </div>
    </form>
  );
}
