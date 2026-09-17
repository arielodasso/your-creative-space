import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe2, Target, Users } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_public/agency")({
  head: () => ({
    meta: [
      { title: "La agencia — NEXUS SPORTS" },
      { name: "description", content: "Nexus Sports es una agencia de representación deportiva enfocada en el desarrollo de carreras y la relación con clubes." },
      { property: "og:title", content: "La agencia — NEXUS SPORTS" },
      { property: "og:description", content: "Quiénes somos, cómo trabajamos y con qué clubes nos relacionamos." },
    ],
  }),
  component: AgencyPage,
});

function AgencyPage() {
  const { players, clubs, contacts } = useStore();

  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="kicker text-gold">La agencia</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
            Una estructura profesional detrás de cada carrera
          </h1>
          <p className="mt-5 max-w-2xl text-navy-foreground/70">
            Nexus Sports nació para ordenar lo que la representación deportiva suele dejar librado al azar:
            información, relaciones y planificación. Trabajamos con una base de datos viva de jugadores,
            clubes, contactos y oportunidades.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { value: players.length, label: "Jugadores representados" },
              { value: clubs.length, label: "Clubes en la red" },
              { value: contacts.length, label: "Contactos institucionales" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <p className="font-display text-4xl font-bold text-gold">{s.value}</p>
                <p className="mt-1 text-sm text-navy-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { icon: Users, title: "Cercanía real", text: "Cada jugador tiene un agente responsable, un plan de carrera definido y seguimiento continuo de su situación deportiva y contractual." },
            { icon: Globe2, title: "Alcance internacional", text: "Relaciones activas con clubes de Sudamérica y Europa, y contactos directos con direcciones deportivas y áreas de scouting." },
            { icon: Target, title: "Decisiones con datos", text: "Estadísticas, informes y documentación centralizados para tomar decisiones de carrera con información, no con intuición." },
          ].map((b) => (
            <div key={b.title}>
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-primary">
                <b.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold uppercase tracking-wide">{b.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <p className="kicker text-primary">Equipo</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight">Quiénes representan</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.filter((c) => c.email.endsWith("@nexus.demo")).slice(0, 4).map((c) => (
              <div key={c.id} className="card-hover rounded-lg border bg-card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                <p className="mt-4 font-display text-base font-bold uppercase tracking-wide">{c.name}</p>
                <p className="text-sm text-primary">{c.role}</p>
                <p className="mt-2 text-xs text-muted-foreground">{c.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight">¿Querés trabajar con nosotros?</h2>
        <Link to="/contact" className="mt-6 inline-flex rounded-md bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:brightness-110">
          Contactar agencia
        </Link>
      </section>
    </>
  );
}
