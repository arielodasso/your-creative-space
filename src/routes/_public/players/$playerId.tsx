import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarRange,
  Flag,
  Medal,
  Ruler,
  Target,
} from "lucide-react";
import { useState } from "react";
import { ClubBadge } from "@/components/ClubBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playerPhotos } from "@/lib/data/photos";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_public/players/$playerId")({
  head: () => ({
    meta: [
      { title: "Perfil de jugador — NEXUS SPORTS" },
      {
        name: "description",
        content:
          "Perfil profesional, estadísticas e historial del jugador representado por Nexus Sports.",
      },
    ],
  }),
  component: PlayerProfilePage,
});

function PlayerProfilePage() {
  const { playerId } = Route.useParams();
  const { players, clubs } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState("perfil");

  const player = players.find((p) => p.id === playerId);
  const club = player ? clubs.find((c) => c.id === player.clubId) : undefined;
  const historyClubs = player?.history.map((h) => ({
    entry: h,
    club: clubs.find((c) => c.id === h.clubId),
  }));

  if (!player || !club) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">
          Jugador no encontrado
        </h1>
        <p className="mt-3 text-muted-foreground">El perfil que buscás no existe o fue movido.</p>
        <Link
          to="/players"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a jugadores
        </Link>
      </section>
    );
  }

  const last = player.stats[player.stats.length - 1];
  const maxGoals = Math.max(1, ...player.stats.map((s) => s.goals));

  return (
    <>
      {/* Hero */}
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            to="/players"
            className="inline-flex items-center gap-2 text-sm text-navy-foreground/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Ver todos los jugadores
          </Link>

          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[380px_1fr]">
            <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-navy-deep/60">
              <img
                src={playerPhotos[player.photo]}
                alt={player.name}
                width={768}
                height={960}
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute left-3 top-3">
                <span className="rounded-md bg-gold px-2.5 py-1 font-display text-lg font-bold text-gold-foreground">
                  #{player.number}
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge
                  value={player.status}
                  className="border-white/20 bg-white/10 text-navy-foreground"
                />
                <span className="kicker text-gold">{player.position}</span>
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
                {player.name}
              </h1>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-foreground/75">
                <span className="inline-flex items-center gap-1.5">
                  <Flag className="h-4 w-4 text-gold" /> {player.nationality}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarRange className="h-4 w-4 text-gold" /> {player.age} años ·{" "}
                  {player.birthDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-gold" /> {player.height}
                </span>
                <span>Pie {player.foot}</span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                {club && (
                  <span className="flex items-center gap-2.5">
                    <ClubBadge club={club} size={38} />
                    <span>
                      <span className="block text-sm font-semibold">{club.name}</span>
                      <span className="block text-xs text-navy-foreground/60">{club.league}</span>
                    </span>
                  </span>
                )}
                <span className="ml-auto rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-right">
                  <span className="kicker block text-gold">Valor de mercado</span>
                  <span className="font-display text-xl font-bold text-navy-foreground">
                    {player.marketValue}
                  </span>
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-gold font-bold uppercase tracking-wider text-gold-foreground hover:brightness-110"
                  onClick={() => navigate({ to: "/contact", search: { player: player.id } })}
                >
                  Consultar por {player.name.split(" ")[0]} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <span className="inline-flex items-center rounded-md border border-white/20 px-4 text-sm text-navy-foreground/80">
                  Contrato hasta {player.contractEnd}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="plan">Plan de carrera</TabsTrigger>
          </TabsList>

          {/* PERFIL */}
          <TabsContent value="perfil" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                  <p className="kicker text-primary">Bio</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{player.bio}</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <p className="kicker text-primary">Perfil técnico</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{player.profile}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {player.traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-sm bg-accent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-6 lg:col-span-2">
                  <p className="kicker text-primary">Logros</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {player.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm">
                        <Medal className="mt-0.5 h-4 w-4 shrink-0 text-gold-foreground" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="grid content-start gap-4">
                <div className="surface-navy rounded-lg p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/20 text-gold">
                    <Target className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide">
                    Próximo paso
                  </p>
                  <p className="mt-2 text-sm text-navy-foreground/75">{player.nextAction}</p>
                  <Link
                    to="/contact"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
                  >
                    Consultar a la agencia <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <p className="kicker text-primary">Representante</p>
                  <p className="mt-2 font-display text-base font-bold uppercase tracking-wide">
                    {player.agent}
                  </p>
                  <div className="mt-3 flex items-center justify-between rounded-md bg-secondary/60 p-3 text-sm">
                    <span className="text-muted-foreground">Nacionalidad</span>
                    <span className="font-semibold">{club.country}</span>
                  </div>
                </div>
              </aside>
            </div>
          </TabsContent>

          {/* ESTADÍSTICAS */}
          <TabsContent value="stats" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="overflow-hidden rounded-lg border bg-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left">
                      {[
                        "Temporada",
                        "Partidos",
                        "Minutos",
                        "Goles",
                        "Asistencias",
                        "Titular",
                        "Amarillas",
                        "Rojas",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {player.stats.map((s) => (
                      <tr key={s.season} className="border-b last:border-0">
                        <td className="px-4 py-3 font-display font-bold">{s.season}</td>
                        <td className="px-4 py-3">{s.matches}</td>
                        <td className="px-4 py-3">{s.minutes.toLocaleString("es-AR")}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{s.goals}</td>
                        <td className="px-4 py-3">{s.assists}</td>
                        <td className="px-4 py-3">{s.starts}</td>
                        <td className="px-4 py-3">{s.yellowCards}</td>
                        <td className="px-4 py-3">{s.redCards}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-lg border bg-card p-6">
                  <p className="kicker text-primary">Última temporada</p>
                  <p className="mt-3 font-display text-5xl font-bold text-primary">
                    {last?.goals ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    goles en {last?.matches ?? 0} partidos
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <p className="kicker text-primary">Evolución ofensiva</p>
                  <div className="mt-4 grid gap-3">
                    {player.stats.map((s) => (
                      <div key={s.season}>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{s.season}</span>
                          <span>{s.goals} goles</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                            style={{ width: `${(s.goals / maxGoals) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* HISTORIAL */}
          <TabsContent value="historial" className="mt-8">
            <div className="rounded-lg border bg-card p-6 sm:p-8">
              <p className="kicker text-primary">Trayectoria</p>
              <ol className="mt-6 grid gap-6 border-l-2 border-gold/40 pl-6">
                {player.history.map((h) => {
                  const hClub = clubs.find((c) => c.id === h.clubId);
                  return (
                    <li key={`${h.period}-${h.clubId}`} className="relative">
                      <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-gold bg-card" />
                      <div className="flex flex-wrap items-center gap-3">
                        {hClub && <ClubBadge club={hClub} size={34} />}
                        <div>
                          <p className="font-display text-base font-bold uppercase tracking-wide">
                            {hClub?.name ?? "Club"}
                          </p>
                          <p className="text-sm text-muted-foreground">{h.category}</p>
                        </div>
                        <span className="ml-auto rounded-sm bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                          {h.period}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </TabsContent>

          {/* PLAN */}
          <TabsContent value="plan" className="mt-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { label: "Corto plazo", text: player.planning.short },
                { label: "Mediano plazo", text: player.planning.mid },
                { label: "Largo plazo", text: player.planning.long },
              ].map((p, i) => (
                <div key={p.label} className="rounded-lg border bg-card p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent font-display text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide">
                    {p.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              ))}
              <div className="rounded-lg border bg-card p-6 lg:col-span-3">
                <p className="kicker text-primary">Acciones en curso</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {player.planning.actions.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2 rounded-md border bg-background p-3 text-sm"
                    >
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-foreground" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
