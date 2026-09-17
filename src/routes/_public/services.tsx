import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefcaseBusiness, FileText, Gauge, GraduationCap, Presentation, Scale } from "lucide-react";

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Servicios — NEXUS SPORTS" },
      { name: "description", content: "Representación contractual, planificación de carrera, portfolios profesionales y gestión documental para futbolistas y clubes." },
      { property: "og:title", content: "Servicios — NEXUS SPORTS" },
      { property: "og:description", content: "Todo lo que hace la agencia por cada jugador representado." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Scale, title: "Representación contractual", text: "Negociación de contratos, renovaciones, cláusulas y comisiones con acompañamiento legal en cada operación." },
  { icon: Gauge, title: "Planificación de carrera", text: "Objetivos a corto, mediano y largo plazo con acciones concretas y revisión periódica de cada jugador." },
  { icon: Presentation, title: "Portfolios y presentaciones", text: "Fichas profesionales, videos de highlights e informes listos para direcciones deportivas y áreas de scouting." },
  { icon: BriefcaseBusiness, title: "Gestión de oportunidades", text: "Detección de clubes interesados, seguimiento de negociaciones y coordinación de pruebas o préstamos." },
  { icon: FileText, title: "Gestión documental", text: "Contratos, pasaportes, autorizaciones y seguros centralizados con alertas de vencimiento." },
  { icon: GraduationCap, title: "Scouting y evaluación", text: "Detección y seguimiento de jugadores potenciales con informes internos y ratings de evaluación." },
];

function ServicesPage() {
  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="kicker text-gold">Servicios</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
            Todo lo que rodea a un jugador, en un solo lugar
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card-hover rounded-lg border bg-card p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-accent text-primary">
                <s.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-lg font-bold uppercase tracking-wide">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-navy">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Consultanos por un jugador</h2>
          <p className="max-w-xl text-navy-foreground/70">Respondemos consultas de clubes, direcciones deportivas y áreas de scouting.</p>
          <Link to="/contact" className="rounded-md bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-gold-foreground transition hover:brightness-110">
            Contactar agencia
          </Link>
        </div>
      </section>
    </>
  );
}
