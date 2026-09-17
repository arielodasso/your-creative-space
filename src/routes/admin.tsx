import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de gestión — NEXUS SPORTS" },
      {
        name: "description",
        content:
          "Panel de gestión de la agencia Nexus Sports: jugadores, clubes, oportunidades, negociaciones y más.",
      },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { authenticated } = useStore();
  if (!authenticated) return <AdminLogin />;
  return <AdminShell />;
}
