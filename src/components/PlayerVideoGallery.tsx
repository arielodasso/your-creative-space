import { CalendarRange, Clapperboard, Play } from "lucide-react";
import { useMemo, useState } from "react";
import type { Player, PlayerVideo, PlayerVideoCategory } from "@/lib/data/types";
import { playerPhotos } from "@/lib/data/photos";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categoryStyles: Record<PlayerVideoCategory, string> = {
  Highlights: "bg-gold text-gold-foreground",
  Skills: "bg-primary text-primary-foreground",
  Goles: "bg-emerald-600 text-white",
  Atajadas: "bg-sky-600 text-white",
  Entrevista: "bg-fuchsia-600 text-white",
  "Detrás de escena": "bg-orange-600 text-white",
  Rendimiento: "bg-slate-700 text-white",
};

export function PlayerVideoGallery({ player }: { player: Player }) {
  const [selected, setSelected] = useState<PlayerVideo | null>(null);
  const [filter, setFilter] = useState<"Todas" | PlayerVideoCategory>("Todas");

  const videos = useMemo(() => {
    const ordered = [...player.videos].sort(
      (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
    );
    return filter === "Todas" ? ordered : ordered.filter((x) => x.category === filter);
  }, [player.videos, filter]);

  const categories = useMemo(
    () => [...new Set(player.videos.map((x) => x.category))],
    [player.videos],
  );

  const featured = videos.find((x) => x.featured) ?? videos[0];
  const rest = featured ? videos.filter((x) => x.id !== featured.id) : videos;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker text-primary">Galería de videos</p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Highlights, skills y contenido audiovisual de {player.name.split(" ")[0]} para scouts y
            clubes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("Todas")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
              filter === "Todas"
                ? "bg-primary text-primary-foreground"
                : "border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                filter === c
                  ? "bg-primary text-primary-foreground"
                  : "border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {featured && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <VideoThumb
            video={featured}
            player={player}
            featured
            onOpen={() => setSelected(featured)}
          />
          {rest.slice(0, 2).map((video) => (
            <VideoThumb
              key={video.id}
              video={video}
              player={player}
              onOpen={() => setSelected(video)}
            />
          ))}
        </div>
      )}

      {rest.length > 2 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((video) => (
            <VideoThumb
              key={video.id}
              video={video}
              player={player}
              onOpen={() => setSelected(video)}
            />
          ))}
        </div>
      )}

      {!featured && (
        <div className="mt-6 rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No hay videos publicados para esta categoría.
        </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl gap-3 p-4 sm:p-6">
          <video
            key={selected?.id}
            src={selected?.url}
            poster={selected ? playerPhotos[player.photo] : undefined}
            controls
            autoPlay
            playsInline
            className="aspect-video w-full rounded-lg bg-navy-deep object-cover"
          />
          {selected && (
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wide",
                    categoryStyles[selected.category],
                  )}
                >
                  {selected.category}
                </span>
                {selected.featured && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
                    <Clapperboard className="h-3.5 w-3.5" /> Destacado
                  </span>
                )}
              </div>
              <DialogTitle className="font-display uppercase tracking-wide">
                {selected.title}
              </DialogTitle>
              {selected.description && (
                <DialogDescription>{selected.description}</DialogDescription>
              )}
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5" /> Publicado el {selected.date} · Duración{" "}
                {selected.duration}
              </p>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VideoThumb({
  video,
  player,
  featured,
  onOpen,
}: {
  video: PlayerVideo;
  player: Player;
  featured?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "card-hover group relative block w-full overflow-hidden rounded-lg border bg-card text-left aspect-[16/9]",
      )}
    >
      <img
        src={playerPhotos[player.photo]}
        alt={video.title}
        loading="lazy"
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/25 to-navy-deep/10 transition-colors group-hover:from-navy-deep/95" />
      <span className="absolute left-3 top-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide",
            categoryStyles[video.category],
          )}
        >
          <Clapperboard className="h-3 w-3" /> {video.category}
        </span>
      </span>
      {video.featured && (
        <span className="absolute right-3 top-3 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
          Destacado
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/95 text-gold-foreground shadow-xl shadow-navy-deep/50 transition-transform duration-300 group-hover:scale-110">
          <Play className="h-6 w-6 fill-current" />
        </span>
      </span>
      <span className="absolute bottom-3 right-3 rounded-sm bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
        {video.duration}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4 pt-12">
        <p className="font-display text-base font-bold uppercase tracking-wide text-navy-foreground sm:text-lg">
          {video.title}
        </p>
        <p className="text-xs text-navy-foreground/70">Publicado el {video.date}</p>
      </div>
    </button>
  );
}
