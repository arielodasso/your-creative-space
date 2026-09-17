import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { PlayerCard } from "@/components/PlayerCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_public/players/")({
  head: () => ({
    meta: [
      { title: "Jugadores representados — NEXUS SPORTS" },
      { name: "description", content: "Conocé a los jugadores representados por Nexus Sports: perfiles, posiciones, estadísticas y clubes." },
      { property: "og:title", content: "Jugadores representados — NEXUS SPORTS" },
      { property: "og:description", content: "Perfiles profesionales de los futbolistas representados por la agencia." },
    ],
  }),
  component: PlayersPage,
});

function PlayersPage() {
  const { players, clubs } = useStore();
  const [q, setQ] = useState("");
  const [position, setPosition] = useState("todas");
  const [country, setCountry] = useState("todos");

  const positions = [...new Set(players.map((p) => p.position))];
  const countries = [...new Set(players.map((p) => p.nationality))];

  const filtered = useMemo(
    () =>
      players.filter((p) => {
        const club = clubs.find((c) => c.id === p.clubId)?.name ?? "";
        const matchQ = `${p.name} ${p.position} ${club}`.toLowerCase().includes(q.toLowerCase());
        return matchQ && (position === "todas" || p.position === position) && (country === "todos" || p.nationality === country);
      }),
    [players, clubs, q, position, country],
  );

  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="kicker text-gold">Plantel representado</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">Nuestros jugadores</h1>
          <p className="mt-4 max-w-2xl text-navy-foreground/70">
            Perfiles profesionales completos con información deportiva, estadísticas e historial de clubes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, posición o club" className="pl-9" />
          </div>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger className="sm:w-56"><SelectValue placeholder="Posición" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las posiciones</SelectItem>
              {positions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="Nacionalidad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las nacionalidades</SelectItem>
              {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{filtered.length} jugador{filtered.length === 1 ? "" : "es"}</p>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed p-16 text-center">
            <p className="font-display text-lg font-bold uppercase">Sin resultados</p>
            <p className="mt-2 text-sm text-muted-foreground">Probá con otro nombre, posición o nacionalidad.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => <PlayerCard key={p.id} player={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
