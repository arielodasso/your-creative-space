import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Player } from "@/lib/data/types";
import { playerPhotos } from "@/lib/data/photos";
import { ClubBadge } from "./ClubBadge";
import { StatusBadge } from "./StatusBadge";
import { useStore } from "@/lib/store";

export function PlayerCard({ player }: { player: Player }) {
  const { clubs } = useStore();
  const club = clubs.find((c) => c.id === player.clubId);
  return (
    <div className="card-hover group flex flex-col overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={playerPhotos[player.photo]}
          alt={player.name}
          loading="lazy"
          width={768}
          height={960}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge value={player.status} className="bg-card/90 backdrop-blur" />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/60 to-transparent p-4 pt-10">
          <p className="font-display text-lg font-bold uppercase tracking-wide text-navy-foreground">{player.name}</p>
          <p className="text-xs font-medium text-gold">{player.position} · {player.age} años · {player.nationality}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        {club ? (
          <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <ClubBadge club={club} size={22} />
            <span className="truncate">{club.name}</span>
          </span>
        ) : <span />}
        <Link
          to="/players/$playerId"
          params={{ playerId: player.id }}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary hover:text-gold-foreground"
        >
          Ver perfil <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
