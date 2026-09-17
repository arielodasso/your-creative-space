import { Link } from "@tanstack/react-router";
import { Hexagon, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actions } from "@/lib/store";

export function AdminLogin() {
  const [email, setEmail] = useState("agencia@nexus.demo");
  const [password, setPassword] = useState("demo");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Completá email y contraseña.");
      return;
    }
    actions.login();
    actions.logActivity("Sesión iniciada en el panel de gestión", "reunion");
    toast.success("Bienvenido al panel", { description: "Sesión demo activada." });
  }

  return (
    <div
      className="hero-navy relative flex min-h-screen items-center justify-center px-4 py-10"
      style={{ ["--hero-image" as string]: "none" }}
    >
      <div className="w-full max-w-md">
        <div className="surface-navy overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-navy-deep/50">
          <div className="flex flex-col items-center border-b border-white/10 px-8 pb-6 pt-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gold text-gold-foreground">
              <Hexagon className="h-6 w-6" strokeWidth={2.4} />
            </span>
            <p className="mt-4 font-display text-xl font-bold uppercase tracking-widest">
              Nexus <span className="text-gold">Sports</span>
            </p>
            <p className="mt-1 text-sm text-navy-foreground/60">Panel de gestión de la agencia</p>
          </div>

          <form onSubmit={submit} className="grid gap-4 p-8">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-navy-foreground/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/15 bg-white/5 pl-9 text-navy-foreground placeholder:text-navy-foreground/40"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-navy-foreground/80">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-foreground/40" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/15 bg-white/5 pl-9 text-navy-foreground placeholder:text-navy-foreground/40"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full bg-gold font-bold uppercase tracking-wider text-gold-foreground hover:brightness-110"
            >
              <LogIn className="mr-2 h-4 w-4" /> Ingresar al panel
            </Button>
            <p className="text-center text-xs text-navy-foreground/50">
              Login ficticio — cualquier credencial habilita la demo.
            </p>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-navy-foreground/70 underline-offset-4 hover:text-gold hover:underline"
          >
            Volver a la web pública
          </Link>
        </div>
      </div>
    </div>
  );
}
