import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ACTIVE_STAGES, STAGE_ORDER } from "@/lib/admin-utils";
import { useStore } from "@/lib/store";
import { CircleDollarSign, Percent, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reportes — Panel NEXUS SPORTS" }] }),
  component: ReportsModule,
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function Panel({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <p className="kicker text-primary">{kicker}</p>
      <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-tight">{title}</h2>
      <div className="mt-4 h-72 w-full">{children}</div>
    </section>
  );
}

function ReportsModule() {
  const { players, clubs, opportunities, negotiations, tasks, scouting } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toNumber = (v: string) => {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const activeOps = opportunities.filter((o) => ACTIVE_STAGES.includes(o.stage));
  const pipelineValue = activeOps.reduce(
    (sum, o) => sum + toNumber(o.estimatedValue) * (o.probability / 100),
    0,
  );
  const closed = opportunities.filter((o) => o.stage === "Cerrada").length;
  const lost = opportunities.filter((o) => o.stage === "Perdida").length;
  const winRate = closed + lost > 0 ? (closed / (closed + lost)) * 100 : 0;
  const avgTicket = activeOps.length
    ? activeOps.reduce((s, o) => s + toNumber(o.estimatedValue), 0) / activeOps.length
    : 0;

  const stageData = useMemo(
    () =>
      STAGE_ORDER.map((stage) => ({
        name: stage,
        value: opportunities.filter((o) => o.stage === stage).length,
      })),
    [opportunities],
  );

  const typeData = useMemo(() => {
    const types = ["Transferencia", "Préstamo", "Renovación", "Prueba"];
    return types
      .map((t) => ({ name: t, value: opportunities.filter((o) => o.type === t).length }))
      .filter((d) => d.value > 0);
  }, [opportunities]);

  const playerValue = useMemo(
    () =>
      activeOps
        .map((o) => {
          const player = players.find((p) => p.id === o.playerId);
          return {
            name: player?.name.split(" ").slice(-1)[0] ?? "—",
            value: Number((toNumber(o.estimatedValue) * (o.probability / 100)).toFixed(2)),
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
    [activeOps, players],
  );

  const taskData = useMemo(() => {
    const statuses = ["Pendiente", "En progreso", "Bloqueada", "Completada"];
    return statuses.map((s) => ({ name: s, value: tasks.filter((t) => t.status === s).length }));
  }, [tasks]);

  const negData = useMemo(() => {
    const statuses = ["Activa", "Pausada", "Cerrada", "Caída"];
    return statuses.map((s) => ({
      name: s,
      value: negotiations.filter((n) => n.status === s).length,
    }));
  }, [negotiations]);

  const scoutData = useMemo(() => {
    const positions = [...new Set(scouting.map((s) => s.position))];
    return positions
      .map((pos) => {
        const group = scouting.filter((s) => s.position === pos);
        return {
          name: pos,
          rating: Number((group.reduce((sum, s) => sum + s.rating, 0) / group.length).toFixed(1)),
          potential: Number(
            (group.reduce((sum, s) => sum + s.potential, 0) / group.length).toFixed(1),
          ),
        };
      })
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 6);
  }, [scouting]);

  const axis = { stroke: "var(--muted-foreground)", fontSize: 11 };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Reportes"
        description="Analítica del pipeline, la operación comercial y el scouting de la agencia."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="Pipeline ponderado"
          value={`USD ${pipelineValue.toFixed(1)}M`}
          sub={
            <span className="text-xs text-muted-foreground">
              {activeOps.length} operaciones activas
            </span>
          }
        />
        <StatCard
          icon={Percent}
          label="Tasa de cierre"
          value={`${winRate.toFixed(0)}%`}
          sub={
            <span className="text-xs text-muted-foreground">
              {closed} cerradas · {lost} perdidas
            </span>
          }
        />
        <StatCard
          icon={CircleDollarSign}
          label="Ticket promedio"
          value={`USD ${avgTicket.toFixed(2)}M`}
          sub={<span className="text-xs text-muted-foreground">sobre operaciones activas</span>}
        />
        <StatCard
          icon={Target}
          label="Red comercial"
          value={`${players.length} / ${clubs.length}`}
          sub={<span className="text-xs text-muted-foreground">jugadores / clubes</span>}
        />
      </div>

      {mounted && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel kicker="Pipeline" title="Oportunidades por etapa">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" name="Oportunidades" radius={[4, 4, 0, 0]}>
                  {stageData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel kicker="Demanda" title="Oportunidades por tipo">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Panel>

          <Panel kicker="Valor" title="Pipeline ponderado por jugador (USD M)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={playerValue}
                layout="vertical"
                margin={{ top: 8, right: 16, bottom: 8, left: 24 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={axis} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="value"
                  name="USD M ponderado"
                  fill="var(--chart-2)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel kicker="Scouting" title="Nivel actual vs proyección por posición">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoutData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={50}
                  angle={-18}
                  textAnchor="end"
                />
                <YAxis domain={[0, 10]} tick={axis} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="rating"
                  name="Nivel actual"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="potential"
                  name="Proyección"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel kicker="Operación" title="Tareas por estado">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={axis} tickLine={false} axisLine={false} />
                <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" name="Tareas" radius={[4, 4, 0, 0]}>
                  {taskData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel kicker="Negociación" title="Negociaciones por estado">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={negData} margin={{ top: 8, right: 8, bottom: 8, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={axis} tickLine={false} axisLine={false} />
                <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" name="Negociaciones" radius={[4, 4, 0, 0]}>
                  {negData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      )}
    </div>
  );
}
