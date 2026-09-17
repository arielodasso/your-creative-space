import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Hexagon, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/players", label: "Jugadores" },
  { to: "/agency", label: "Agencia" },
  { to: "/services", label: "Servicios" },
  { to: "/contact", label: "Contacto" },
] as const;

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 surface-navy shadow-lg shadow-navy-deep/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-gold-foreground">
              <Hexagon className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold uppercase tracking-widest text-navy-foreground">
              Nexus <span className="text-gold">Sports</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "kicker text-navy-foreground/70 transition-colors hover:text-gold",
                  (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)) && "text-gold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/players"
              className="rounded-md border border-navy-foreground/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Consultar un jugador
            </Link>
            <Link
              to="/contact"
              className="rounded-md bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-foreground transition-colors hover:brightness-110"
            >
              Contactar agencia
            </Link>
          </div>

          <button className="text-navy-foreground lg:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 px-4 pb-4 pt-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-semibold uppercase tracking-wider text-navy-foreground/80"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 block rounded-md bg-gold px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-gold-foreground">
              Contactar agencia
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="surface-navy">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-gold-foreground">
                <Hexagon className="h-5 w-5" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-bold uppercase tracking-widest">Nexus <span className="text-gold">Sports</span></span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-navy-foreground/60">
              Players. Relationships. Opportunities. Representación profesional de futbolistas con gestión integral de carrera.
            </p>
          </div>
          <div>
            <p className="kicker text-gold">Navegación</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {nav.map((item) => (
                <Link key={item.to} to={item.to} className="text-sm text-navy-foreground/70 hover:text-gold">{item.label}</Link>
              ))}
              <Link to="/admin" className="text-sm text-navy-foreground/70 hover:text-gold">Acceso agencia</Link>
            </div>
          </div>
          <div>
            <p className="kicker text-gold">Contacto</p>
            <p className="mt-4 text-sm text-navy-foreground/70">contacto@nexussports.demo<br />+54 9 11 5555 0100<br />Buenos Aires, Argentina</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-navy-foreground/40">
          © 2026 Nexus Sports — Demo ficticia. Todos los jugadores, clubes y datos son ilustrativos.
        </div>
      </footer>
    </div>
  );
}
