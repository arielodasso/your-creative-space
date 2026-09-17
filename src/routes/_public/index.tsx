import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Handshake, LineChart, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { playerPhotos, heroStadium } from "@/lib/data/photos";
import { PlayerCard } from "@/components/PlayerCard";
import { ClubBadge } from "@/components/ClubBadge";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "NEXUS SPORTS — Representamos talento. Construimos oportunidades." },
      { name: "description", content: "Agencia de representación deportiva orientada al desarrollo de jugadores y la generación de oportunidades con clubes." },
      { property: "og:title", content: "NEXUS SPORTS — Agencia de representación deportiva" },
      { property: "og:description", content: "Representamos talento. Construimos oportunidades." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { players, clubs } = useStore();
  const featured = players.find((p) => p.id === "mateo-ferrer")!;
  const featuredClub = clubs.find((c) => c.id === featured.clubId)!;
  const featuredPlayers = players.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section
        className="hero-navy relative"
        style={{ ["--hero-image" as string]: `url(${heroStadium})` }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <span className="kicker inline-block rounded-sm bg-gold px-3 py-1.5 text-gold-foreground">
              Demo — Datos 100% ficticios
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-navy-foreground sm:text-5xl lg:text-6xl">
              Representamos talento. <span className="text-gradient-gold">Construimos oportunidades.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              Una agencia deportiva orientada al desarrollo de jugadores, la gestión profesional
              de sus carreras y la generación de oportunidades con clubes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/players" className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-gold-foreground transition hover:brightness-110">
                Nuestros jugadores <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center rounded-md border border-navy-foreground/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-navy-foreground transition hover:border-gold hover:text-gold">
                Contactar agencia
              </Link>
            </div>
          </div>

          {/* Composición jugador destacado */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-navy-deep/60">
              <img src={playerPhotos[featured.photo]} alt={featured.name} width={768} height={960} className="aspect-[4/5] w-full object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent p-5 pt-16">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold uppercase text-navy-foreground">{featured.name}</p>
                    <p className="text-sm font-medium text-gold">{featured.position} · {featured.age} años · {featured.nationality}</p>
                  </div>
                  <span className="rounded-md bg-gold px-2.5 py-1 font-display text-lg font-bold text-gold-foreground">#{featured.number}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-white/15 pt-3 text-xs text-navy-foreground/80">
                  <ClubBadge club={featuredClub} size={26} />
                  <span>{featuredClub.name} — {featuredClub.league}</span>
                </div>
              </div>
            </div>
            <div className="absolute -left-4 top-6 rounded-md border border-gold/40 bg-navy-deep/90 px-3 py-2 backdrop-blur">
              <p className="kicker text-gold">Valor de mercado</p>
              <p className="font-display text-lg font-bold text-navy-foreground">{featured.marketValue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="kicker text-primary">Qué hacemos</p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Players. Relationships. Opportunities.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Representación integral", text: "Gestión contractual, legal y deportiva de cada jugador representado." },
            { icon: Handshake, title: "Red de clubes", text: "Relaciones activas con clubes de Argentina, Uruguay, Chile, España, Portugal e Italia." },
            { icon: LineChart, title: "Desarrollo de carrera", text: "Planificación deportiva y comercial a corto, mediano y largo plazo." },
            { icon: BadgeCheck, title: "Portfolios profesionales", text: "Fichas, estadísticas y presentaciones listas para direcciones deportivas." },
          ].map((f) => (
            <div key={f.title} className="card-hover rounded-lg border bg-card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold uppercase tracking-wide">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JUGADORES */}
      <section className="border-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="kicker text-primary">Plantel representado</p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Nuestros jugadores</h2>
            </div>
            <Link to="/players" className="hidden items-center gap-1 text-sm font-semibold uppercase tracking-wide text-primary hover:text-gold-foreground sm:inline-flex">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPlayers.map((p) => <PlayerCard key={p.id} player={p} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/players" className="text-sm font-semibold uppercase tracking-wide text-primary">Ver todos los jugadores</Link>
          </div>
        </div>
      </section>

      {/* RED DE CLUBES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="kicker text-primary">Red de trabajo</p>
        <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight">Clubes vinculados</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {clubs.map((c) => (
            <div key={c.id} className="card-hover flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center">
              <ClubBadge club={c} size={44} />
              <p className="text-xs font-semibold leading-tight">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">{c.country}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">¿Sos club, jugador o institución?</h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-foreground/70">
            Consultanos por un jugador representado o contanos qué perfil estás buscando.
          </p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-gold-foreground transition hover:brightness-110">
            Contactar agencia <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
