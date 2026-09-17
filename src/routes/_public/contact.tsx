import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { InquiryForm } from "@/components/public/InquiryForm";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_public/contact")({
  validateSearch: (search: Record<string, unknown>): { player?: string } => {
    const player = typeof search["player"] === "string" ? (search["player"] as string) : undefined;
    return player === undefined ? {} : { player };
  },
  head: () => ({
    meta: [
      { title: "Contacto — NEXUS SPORTS" },
      {
        name: "description",
        content:
          "Contactá a Nexus Sports: consultas de clubes, direcciones deportivas, scouts y jugadores.",
      },
      { property: "og:title", content: "Contacto — NEXUS SPORTS" },
      {
        property: "og:description",
        content: "Escribinos por un jugador representado o contanos qué perfil buscás.",
      },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  {
    q: "¿Pueden responder consultas de clubes?",
    a: "Sí. Las direcciones deportivas y áreas de scouting pueden consultar por cualquier jugador representado y recibir ficha, estadísticas y videos de highlights.",
  },
  {
    q: "¿Cómo se manejan las solicitudes de prueba o préstamo?",
    a: "Se registran como solicitudes y el equipo de la agencia las gestiona a través del panel: se vincula al jugador y al club, y se le da seguimiento.",
  },
  {
    q: "¿Los datos de la demo son reales?",
    a: "No. Todos los jugadores, clubes y operaciones son ficticios e ilustrativos. La plataforma es un prototipo de experiencia.",
  },
];

function ContactPage() {
  const { player: searchPlayer } = Route.useSearch();
  const { players, inquiries } = useStore();
  const preselect = players.find((p) => p.id === searchPlayer);

  return (
    <>
      <section className="surface-navy">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="kicker text-gold">Contacto</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
            Hablemos de tu próximo movimiento
          </h1>
          <p className="mt-5 max-w-2xl text-navy-foreground/70">
            {preselect
              ? `Completá la solicitud y recibiremos tu interés por ${preselect.name}. El equipo de la agencia la gestionará en el panel.`
              : "Clubes, direcciones deportivas y jugadores: dejá tu consulta y la agencia te responde desde el panel de gestión."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <p className="kicker text-primary">Formulario</p>
                <h2 className="font-display text-lg font-bold uppercase tracking-tight">
                  {preselect ? `Consulta por ${preselect.name}` : "Solicitud de información"}
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <InquiryForm defaultPlayerId={preselect?.id} />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border bg-card p-5">
              <p className="kicker text-primary">Directo</p>
              <ul className="mt-4 grid gap-3 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span>contacto@nexussports.demo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>+54 9 11 5555 0100</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>Buenos Aires, Argentina</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  <span>Respuesta en 24–48 h hábiles</span>
                </li>
              </ul>
            </div>

            <div className="surface-navy rounded-lg p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/20 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide">
                Gestión profesional
              </p>
              <p className="mt-1.5 text-sm text-navy-foreground/70">
                Cada solicitud se registra en la plataforma y un agente se encarga del seguimiento.
              </p>
              <Link
                to="/players"
                className="mt-3 inline-block text-sm font-semibold text-gold hover:underline"
              >
                Ver jugadores representados
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <p className="kicker text-primary">Preguntas frecuentes</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight">
            Antes de escribirnos
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-lg border bg-card p-6">
                <h3 className="font-display text-base font-bold uppercase tracking-wide">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
