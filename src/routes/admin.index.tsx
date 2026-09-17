import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  ClipboardList,
  Handshake,
  Shield,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ClubBadge } from "@/components/ClubBadge";
import { ACTIVE_STAGES, dueState, shortDate, STAGE_ORDER, todayISO } from "@/lib/admin-utils";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NEXUS SPORTS" },
      {
        name: "description",
        content: "Indicadores clave, pipeline de oportunidades y actividad reciente de la agencia.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const {
    players,
    clubs,
    contacts,
    opportunities,
    negotiations,
    tasks,
    events,
    activities,
    notifications,
  } = useStore();

  const activeOps = opportunities.filter((o) => ACTIVE_STAGES.includes(o.stage));
  const activeNegs = negotiations.filter((n) => n.status === "Activa");
  const pendingTasks = tasks.filter((t) => t.status !== "Completada");
  const unreadNotifs = notifications.filter((n) => !n.read);
  const pipelineValue = activeOps.reduce((sum, o) => {
    const v = parseFloat(o.estimatedValue.replace(/[^0-9.]/g, ""));
    return sum + (Number.isFinite(v) ? v * (o.probability / 100) : 0);
  }, 0);

  const byStage = STAGE_ORDER.map((stage) => ({
    stage,
    count: opportunities.filter((o) => o.stage === stage).length,
  }));

  const upcoming = [...events]
    .filter((e) => e.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 6);

  const urgent = pendingTasks.filter((t) => t.priority === "Urgente").length;
  const expiring = [
    ...new Set(
      opportunities
        .filter((o) => o.probability >= 50 && ACTIVE_STAGES.includes(o.stage))
        .map((o) => o.playerId),
    ),
  ].length;

  const stageDots = byStage.reduce((max, s) => Math.max(max, s.count), 1);

  return (
    <div className="grid gap-8">
      <div>
        <p className="kicker text-primary">Panel de gestión</p>
        <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Resumen operativo de la agencia. Todos los datos provienen del mock centralizado y son
          ilustrativos.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Jugadores representados"
          value={players.length}
          sub={
            <span className="text-xs text-muted-foreground">
              {players.filter((p) => p.status === "Transferible").length} transferibles
            </span>
          }
        />
        <StatCard
          icon={Shield}
          label="Clubes en la red"
          value={clubs.length}
          sub={
            <span className="text-xs text-muted-foreground">
              {
                clubs.filter((c) => c.relation === "Cliente" || c.relation === "Relación activa")
                  .length
              }{" "}
              activos
            </span>
          }
        />
        <StatCard
          icon={TrendingUp}
          label="Oportunidades activas"
          value={activeOps.length}
          sub={
            <span className="font-semibold text-gold-foreground">
              USD {pipelineValue.toFixed(1)}M ponderado
            </span>
          }
        />
        <StatCard
          icon={Handshake}
          label="Negociaciones activas"
          value={activeNegs.length}
          sub={
            <span className="text-xs text-muted-foreground">
              {negotiations.filter((n) => n.status === "Cerrada").length} cerradas
            </span>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Tareas pendientes"
          value={pendingTasks.length}
          sub={
            urgent > 0 ? (
              <span className="font-semibold text-destructive">{urgent} urgentes</span>
            ) : (
              <span className="text-xs text-muted-foreground">todo al día</span>
            )
          }
        />
        <StatCard
          icon={CalendarDays}
          label="Próximos eventos"
          value={upcoming.length}
          sub={
            <Link to="/admin/agenda" className="text-xs font-medium text-primary hover:underline">
              Ver agenda
            </Link>
          }
        />
        <StatCard
          icon={CircleDollarSign}
          label="Contactos institucionales"
          value={contacts.length}
        />
        <StatCard
          icon={UserPlus}
          label="Jugadores en pipeline (≥50%)"
          value={expiring}
          sub={
            <Link
              to="/admin/opportunities"
              className="text-xs font-medium text-primary hover:underline"
            >
              Ver oportunidades
            </Link>
          }
        />
      </div>

      {/* Pipeline */}
      <section className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="kicker text-primary">Pipeline</p>
            <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-tight">
              Oportunidades por etapa
            </h2>
          </div>
          <Link
            to="/admin/opportunities"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary hover:text-gold-foreground"
          >
            Kanban <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {byStage.map((s) => (
            <div key={s.stage} className="rounded-md border bg-background p-3">
              <p className="font-display text-2xl font-bold">{s.count}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {s.stage}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                  style={{ width: `${(s.count / stageDots) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Próximos eventos */}
        <section className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="kicker text-primary">Agenda</p>
            <Link to="/admin/agenda" className="text-xs font-medium text-primary hover:underline">
              Ver todo
            </Link>
          </div>
          <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-tight">
            Próximamente
          </h2>
          <ul className="mt-4 grid gap-2">
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-start gap-3 rounded-md border bg-background p-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-md bg-accent text-primary">
                  <span className="font-display text-[10px] font-bold leading-none uppercase">
                    {shortDate(e.date).split("/").slice(0, 2).reverse().join("/")}
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{e.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.type} · {e.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Tareas */}
        <section className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="kicker text-primary">Tareas</p>
            <Link to="/admin/tasks" className="text-xs font-medium text-primary hover:underline">
              Ver todo
            </Link>
          </div>
          <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-tight">
            Pendientes críticos
          </h2>
          <ul className="mt-4 grid gap-2">
            {pendingTasks
              .filter((t) => t.priority === "Urgente" || t.priority === "Alta")
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .slice(0, 6)
              .map((t) => {
                const due = dueState(t.dueDate);
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 rounded-md border bg-background p-3"
                  >
                    <CheckSquare className="h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.owner}</p>
                    </div>
                    <span className={`shrink-0 text-xs ${due.className}`}>{due.label}</span>
                  </li>
                );
              })}
          </ul>
        </section>

        {/* Actividad */}
        <section className="rounded-lg border bg-card p-6">
          <p className="kicker text-primary">Actividad</p>
          <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-tight">
            Registro reciente
          </h2>
          <ul className="mt-4 grid gap-3">
            {activities.slice(0, 7).map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${unreadNotifs.some((n) => n.date === a.date) ? "bg-gold" : "bg-primary"}`}
                />
                <div className="min-w-0">
                  <p className="leading-snug">{a.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{shortDate(a.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Operaciones activas */}
      <section className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="kicker text-primary">Negociación</p>
            <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-tight">
              Operaciones activas
            </h2>
          </div>
          <Link
            to="/admin/negotiations"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary hover:text-gold-foreground"
          >
            Módulo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeNegs.slice(0, 6).map((n) => {
            const player = players.find((p) => p.id === n.playerId);
            const club = clubs.find((c) => c.id === n.clubId);
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-md border bg-background p-4"
              >
                {club && <ClubBadge club={club} size={38} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold uppercase tracking-wide">
                    {player?.name ?? "Jugador"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {club?.name ?? "—"} · {n.type}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge value={n.step} />
                    <span className="text-xs font-semibold">{n.value}</span>
                  </div>
                </div>
                <span className="shrink-0 text-xs">
                  <StatusBadge value={n.status} />
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
