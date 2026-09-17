import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  Building2,
  Check,
  Database,
  LogOut,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Configuración — Panel NEXUS SPORTS" }] }),
  component: SettingsModule,
});

const CHANNELS = [
  { key: "email", label: "Email", detail: "Resumen diario y alertas de contratos" },
  { key: "push", label: "Push", detail: "Notificaciones en tiempo real" },
  { key: "whatsapp", label: "WhatsApp", detail: "Avisos de oportunidades y tareas" },
  { key: "weekly", label: "Reporte semanal", detail: "KPIs del pipeline cada lunes" },
] as const;

function SettingsModule() {
  const store = useStore();
  const [profile, setProfile] = useState({
    name: store.userName,
    email: "agencia@nexus.demo",
    phone: "+54 11 5555 0199",
    agency: "Nexus Sports",
  });
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    whatsapp: false,
    weekly: true,
  });

  const summary = [
    { label: "Jugadores", value: store.players.length, icon: Users },
    { label: "Clubes", value: store.clubs.length, icon: Shield },
    { label: "Contactos", value: store.contacts.length, icon: User },
    { label: "Oportunidades", value: store.opportunities.length, icon: Database },
    { label: "Negociaciones", value: store.negotiations.length, icon: Building2 },
    { label: "Tareas", value: store.tasks.length, icon: Check },
    { label: "Eventos", value: store.events.length, icon: Database },
    { label: "Comunicaciones", value: store.communications.length, icon: Bell },
    { label: "Documentos", value: store.documents.length, icon: Database },
    { label: "Scouting", value: store.scouting.length, icon: Database },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Configuración"
        description="Perfil del agente, notificaciones, datos y preferencias del panel."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Perfil del agente
            </h2>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Agencia</Label>
              <Input
                value={profile.agency}
                onChange={(e) => setProfile((p) => ({ ...p, agency: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Teléfono</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>
          <Button className="mt-5" onClick={() => toast.success("Perfil guardado (demo)")}>
            <Save className="mr-1.5 h-4 w-4" /> Guardar cambios
          </Button>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Notificaciones
            </h2>
          </div>
          <Separator className="my-4" />
          <ul className="grid gap-1">
            {CHANNELS.map((c) => (
              <li key={c.key} className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
                <Switch
                  checked={!!prefs[c.key]}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, [c.key]: v }))}
                />
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => toast.success("Preferencias actualizadas")}
          >
            <Save className="mr-1.5 h-4 w-4" /> Guardar preferencias
          </Button>
        </section>

        <section className="rounded-lg border bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Datos del sistema
            </h2>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {summary.map((s) => (
              <div key={s.label} className="rounded-md border bg-background p-3">
                <p className="font-display text-2xl font-bold">{s.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (window.confirm("Se restaurarán todos los datos de demostración. ¿Continuar?")) {
                  window.location.reload();
                }
              }}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Restablecer datos demo
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info("Exportación disponible en la versión productiva")}
            >
              <Database className="mr-1.5 h-4 w-4" /> Exportar respaldo
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-destructive/40 bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" />
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-destructive">
              Zona sensible
            </h2>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Cerrar sesión del panel</p>
              <p className="text-xs text-muted-foreground">
                Requiere volver a ingresar credenciales.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                actions.logout();
                toast.success("Sesión cerrada");
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Vaciar comunicaciones</p>
              <p className="text-xs text-muted-foreground">
                Elimina los registros de contacto cargados.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                store.communications.forEach((c) => actions.remove("communications", c.id));
                toast.success("Comunicaciones eliminadas");
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Vaciar
            </Button>
          </div>
        </section>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <SettingsIcon className="h-3.5 w-3.5" /> Panel de demostración — los cambios sólo afectan a
        esta sesión.
      </p>
    </div>
  );
}
