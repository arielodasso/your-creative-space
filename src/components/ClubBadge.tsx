import type { Club } from "@/lib/data/types";

/** Escudo ficticio generado: forma de escudo con gradiente e iniciales del club. */
export function ClubBadge({ club, size = 40 }: { club: Pick<Club, "initials" | "colors" | "name">; size?: number }) {
  const [c1, c2] = club.colors;
  const gid = `g-${club.initials}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label={club.name} className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <path
        d="M24 3 L42 8 V24 C42 35 34.5 42.5 24 45 C13.5 42.5 6 35 6 24 V8 Z"
        fill={`url(#${gid})`}
        stroke="oklch(74% 0.11 88)"
        strokeWidth="1.6"
      />
      <text x="24" y="29" textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="14" fill="white">
        {club.initials}
      </text>
    </svg>
  );
}
