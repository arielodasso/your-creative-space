import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, Pencil, Phone, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ContactFormDialog } from "@/components/admin/ContactFormDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dueState, shortDate } from "@/lib/admin-utils";
import { actions, useStore } from "@/lib/store";
import type { Contact } from "@/lib/data/types";

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({ meta: [{ title: "Contactos — Panel NEXUS SPORTS" }] }),
  component: ContactsModule,
});

function ContactsModule() {
  const { contacts, clubs } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return contacts.filter((c) => {
      const club = clubs.find((k) => k.id === c.clubId)?.name ?? "";
      return `${c.name} ${c.role} ${c.type} ${c.country} ${club}`.toLowerCase().includes(term);
    });
  }, [contacts, clubs, q]);

  const columns: DataColumn<Contact>[] = [
    {
      header: "Contacto",
      cell: (c) => (
        <div>
          <p className="font-semibold">{c.name}</p>
          <p className="text-xs text-muted-foreground">{c.role}</p>
        </div>
      ),
    },
    { header: "Tipo", cell: (c) => <StatusBadge value={c.type} /> },
    {
      header: "Club",
      cell: (c) => {
        const club = clubs.find((k) => k.id === c.clubId);
        return <span className="text-sm">{club?.name ?? "—"}</span>;
      },
    },
    {
      header: "Contacto",
      cell: (c) => (
        <div className="grid gap-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3 w-3" /> {c.email || "—"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-3 w-3" /> {c.phone || "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Último contacto",
      cell: (c) => (
        <span className="text-xs text-muted-foreground">{shortDate(c.lastContact)}</span>
      ),
    },
    {
      header: "Próxima acción",
      cell: (c) => (
        <span className="max-w-[200px] text-xs text-muted-foreground line-clamp-2">
          {c.nextAction || "—"}
        </span>
      ),
    },
    {
      header: "Acciones",
      cell: (c) => (
        <div className="flex items-center gap-0.5">
          <ContactFormDialog
            contact={c}
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
              actions.remove("contacts", c.id);
              toast.success("Contacto eliminado");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Contactos"
        description="Red institucional: direcciones deportivas, scouts, entrenadores y representantes."
        action={
          <ContactFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Nuevo contacto
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
          placeholder="Buscar contacto…"
          className="pl-9"
        />
      </div>
      <DataTable columns={columns} rows={rows} keyField={(c) => c.id} />
    </div>
  );
}
