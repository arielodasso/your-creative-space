import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Binoculars,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  Contact,
  FolderOpen,
  Handshake,
  Hexagon,
  Kanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { actions, useStore } from "@/lib/store";
import { shortDate } from "@/lib/admin-utils";

const groups = [
  {
    label: "General",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/players", label: "Jugadores", icon: Users },
      { to: "/admin/clubs", label: "Clubes", icon: Shield },
      { to: "/admin/contacts", label: "Contactos", icon: Contact },
    ],
  },
  {
    label: "Operación",
    items: [
      { to: "/admin/opportunities", label: "Oportunidades", icon: Kanban },
      { to: "/admin/negotiations", label: "Negociaciones", icon: Handshake },
      { to: "/admin/tasks", label: "Tareas", icon: CheckSquare },
      { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
    ],
  },
  {
    label: "Gestión",
    items: [
      { to: "/admin/communications", label: "Comunicaciones", icon: MessageSquare },
      { to: "/admin/documents", label: "Documentos", icon: FolderOpen },
      { to: "/admin/scouting", label: "Scouting", icon: Binoculars },
      { to: "/admin/reports", label: "Reportes", icon: BarChart3 },
      { to: "/admin/settings", label: "Configuración", icon: Settings },
    ],
  },
];

export function AdminShell() {
  const { userName, notifications } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "surface-navy fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-gold-foreground">
            <Hexagon className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest leading-none">
              Nexus <span className="text-gold">Sports</span>
            </p>
            <p className="mt-1 text-[11px] text-navy-foreground/50">Panel de gestión</p>
          </div>
          <button
            className="ml-auto text-navy-foreground/70 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g) => (
            <div key={g.label} className="mb-5">
              <p className="kicker px-2 text-navy-foreground/40">{g.label}</p>
              <div className="mt-2 grid gap-1">
                {g.items.map((item) => {
                  const active =
                    item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-navy-foreground/70 transition-colors hover:bg-white/5 hover:text-navy-foreground",
                        active && "bg-gold/15 font-semibold text-gold",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-navy-foreground/70 transition-colors hover:bg-white/5 hover:text-navy-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Ver web pública
          </Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
          <button
            className="text-foreground lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
            {userName} — sesión activa
          </div>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notificaciones"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unread}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notificaciones
                  <button
                    onClick={() => actions.markAllNotificationsRead()}
                    className="text-xs font-normal text-primary hover:underline"
                  >
                    Marcar todas leídas
                  </button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="items-start gap-2 whitespace-normal py-2"
                      onClick={() => actions.markNotificationRead(n.id)}
                    >
                      <span
                        className={cn(
                          "mt-1 h-2 w-2 shrink-0 rounded-full",
                          n.read ? "bg-muted-foreground/30" : "bg-gold",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm">{n.text}</span>
                        <span className="text-xs text-muted-foreground">{shortDate(n.date)}</span>
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground sm:flex">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={() => actions.logout()}
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
