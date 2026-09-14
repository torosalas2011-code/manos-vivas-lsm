import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, Flag, Home, TrendingUp, Dumbbell } from "lucide-react";

const nav = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/diccionario", label: "Diccionario", icon: BookOpen },
  { to: "/misiones", label: "Misiones", icon: Flag },
  { to: "/practica", label: "Práctica", icon: Dumbbell },
  { to: "/progreso", label: "Progreso", icon: TrendingUp },
] as const;

export function AppShell({
  children,
  titulo,
  subtitulo,
}: {
  children: ReactNode;
  titulo: string;
  subtitulo?: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 pb-3 pt-5 backdrop-blur">
        <h1 className="truncate text-2xl font-bold text-foreground">{titulo}</h1>
        {subtitulo ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>
        ) : null}
      </header>

      <main className="flex-1 px-5 pb-28 pt-4">{children}</main>

      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-card"
      >
        <ul className="grid grid-cols-5">
          {nav.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors"
                activeProps={{ className: "!text-primary" }}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
