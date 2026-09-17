import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MessageSquare, Pencil, Phone, Plus, Search, Video } from "lucide-react";
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
import { shortDate } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { Communication, CommunicationType } from "@/lib/data/types";

export const Route = createFileRoute("/admin/communications")({
  head: () => ({ meta: [{ title: "Comunicaciones — Panel NEXUS SPORTS" }] }),
  component: CommunicationsModule,
});

const TYPES: CommunicationType[] = [
  "Email",
  "Llamada",
  "WhatsApp",
  "Reunión",
  "Nota",
  "Seguimiento",
];
const OWNERS = ["Martín Solari", "Lucía Menéndez", "Rodrigo Paiva", "Camila Duarte"];

const typeIcon: Record<CommunicationType, typeof Mail> = {
  Email: Mail,
  Llamada: Phone,
  WhatsApp: MessageSquare,
  Reunión: Pencil,
  Nota: Pencil,
  Seguimiento: Video,
};

function CommFormDialog({ comm, trigger }: { comm?: Communication; trigger: React.ReactNode }) {
  const { contacts, players, clubs } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    subject: comm?.subject ?? "",
    type: comm?.type ?? "Email",
    contactId: comm?.contactId ?? "",
    playerId: comm?.playerId ?? "",
    clubId: comm?.clubId ?? "",
    description: comm?.description ?? "",
    owner: comm?.owner ?? "Martín Solari",
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim()) {
      toast.error("El asunto es obligatorio.");
      return;
    }
    const wrap = (v: string) => (v === "__none__" ? undefined : v);
    if (comm) {
      actions.update("communications", comm.id, {
        ...form,
        subject: form.subject.trim(),
        description: form.description.trim(),
        contactId: wrap(form.contactId),
        playerId: wrap(form.playerId),
        clubId: wrap(form.clubId),
        type: form.type as CommunicationType,
      });
      toast.success("Comunicación actualizada");
    } else {
      actions.addCommunication({
        subject: form.subject.trim(),
        type: form.type as CommunicationType,
        description: form.description.trim(),
        contactId: wrap(form.contactId),
        playerId: wrap(form.playerId),
        clubId: wrap(form.clubId),
        owner: form.owner,
      });
      toast.success("Comunicación registrada");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">
            {comm ? "Editar comunicación" : "Registrar comunicación"}
          </DialogTitle>
          <DialogDescription>
            Queda asociada al historial del contacto, jugador o club.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Asunto *</Label>
            <Input
              value={form.subject}
              onChange={(e) => set("subject")(e.target.value)}
              placeholder="Portfolio Mateo Ferrer"
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
            <Label>Contacto</Label>
            <Select value={form.contactId} onValueChange={set("contactId")}>
              <SelectTrigger>
                <SelectValue placeholder="Sin contacto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Sin contacto</SelectItem>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
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
          <div className="grid gap-2 sm:col-span-2">
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
              placeholder="Resumen del intercambio…"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              {comm ? "Guardar cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CommunicationsModule() {
  const { communications, contacts, players, clubs } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return [...communications]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((c) => {
        const contact = contacts.find((k) => k.id === c.contactId)?.name ?? "";
        const player = players.find((k) => k.id === c.playerId)?.name ?? "";
        const club = clubs.find((k) => k.id === c.clubId)?.name ?? "";
        return `${c.subject} ${c.description} ${c.type} ${c.owner} ${contact} ${player} ${club}`
          .toLowerCase()
          .includes(term);
      });
  }, [communications, contacts, players, clubs, q]);

  const columns: DataColumn<Communication>[] = [
    {
      header: "Fecha",
      cell: (c) => {
        const Icon = typeIcon[c.type] ?? Mail;
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5" /> {shortDate(c.date)}
          </span>
        );
      },
    },
    { header: "Tipo", cell: (c) => <StatusBadge value={c.type} /> },
    {
      header: "Asunto",
      cell: (c) => (
        <div className="max-w-[300px]">
          <p className="font-medium leading-snug">{c.subject}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">{c.description}</p>
        </div>
      ),
    },
    {
      header: "Vinculado a",
      cell: (c) => {
        const contact = contacts.find((k) => k.id === c.contactId)?.name;
        const player = players.find((k) => k.id === c.playerId)?.name;
        const club = clubs.find((k) => k.id === c.clubId)?.name;
        const parts = [
          contact && `Contacto: ${contact}`,
          player && `Jugador: ${player}`,
          club && `Club: ${club}`,
        ].filter(Boolean);
        return <span className="text-xs text-muted-foreground">{parts.join(" · ") || "—"}</span>;
      },
    },
    { header: "Responsable", cell: (c) => <span className="text-sm">{c.owner}</span> },
    {
      header: "Acciones",
      cell: (c) => (
        <div className="flex items-center gap-0.5">
          <CommFormDialog
            comm={c}
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
              actions.remove("communications", c.id);
              toast.success("Comunicación eliminada");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Comunicaciones"
        description="Registro centralizado de emails, llamadas, WhatsApp, reuniones y notas."
        action={
          <CommFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Registrar
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
          placeholder="Buscar por asunto, contacto, jugador…"
          className="pl-9"
        />
      </div>
      <DataTable columns={columns} rows={rows} keyField={(c) => c.id} />
    </div>
  );
}
