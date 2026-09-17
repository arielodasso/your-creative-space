import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  // Estados de jugador
  Activo: "bg-success/15 text-success border-success/30",
  "En desarrollo": "bg-primary/10 text-primary border-primary/30",
  "En evaluación": "bg-warning/15 text-warning-foreground border-warning/40",
  Lesionado: "bg-destructive/10 text-destructive border-destructive/30",
  Transferible: "bg-gold/20 text-gold-foreground border-gold/50",
  Préstamo: "bg-secondary text-secondary-foreground border-border",
  Finalizado: "bg-muted text-muted-foreground border-border",
  // Pipeline
  Nueva: "bg-secondary text-secondary-foreground border-border",
  Contactado: "bg-primary/10 text-primary border-primary/30",
  Interés: "bg-warning/15 text-warning-foreground border-warning/40",
  Negociación: "bg-gold/20 text-gold-foreground border-gold/50",
  Propuesta: "bg-primary/15 text-primary border-primary/40",
  Cerrada: "bg-success/15 text-success border-success/30",
  Perdida: "bg-destructive/10 text-destructive border-destructive/30",
  // Tareas
  Pendiente: "bg-secondary text-secondary-foreground border-border",
  "En progreso": "bg-primary/10 text-primary border-primary/30",
  Bloqueada: "bg-destructive/10 text-destructive border-destructive/30",
  Completada: "bg-success/15 text-success border-success/30",
  Baja: "bg-muted text-muted-foreground border-border",
  Media: "bg-primary/10 text-primary border-primary/30",
  Alta: "bg-warning/15 text-warning-foreground border-warning/40",
  Urgente: "bg-destructive/10 text-destructive border-destructive/30",
  // Relaciones / docs
  Prospecto: "bg-secondary text-secondary-foreground border-border",
  "Relación activa": "bg-success/15 text-success border-success/30",
  Cliente: "bg-gold/20 text-gold-foreground border-gold/50",
  Inactivo: "bg-muted text-muted-foreground border-border",
  Vigente: "bg-success/15 text-success border-success/30",
  "Por vencer": "bg-warning/15 text-warning-foreground border-warning/40",
  Vencido: "bg-destructive/10 text-destructive border-destructive/30",
  Activa: "bg-success/15 text-success border-success/30",
  Pausada: "bg-warning/15 text-warning-foreground border-warning/40",
  Caída: "bg-destructive/10 text-destructive border-destructive/30",
  "En gestión": "bg-primary/10 text-primary border-primary/30",
  Respondida: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium whitespace-nowrap", toneMap[value] ?? "bg-muted text-muted-foreground", className)}>
      {value}
    </Badge>
  );
}
