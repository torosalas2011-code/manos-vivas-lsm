import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HandSignIllustration } from "@/components/HandSignIllustration";
import { categories, searchSigns, type CategoryId } from "@/lib/lsm-data";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diccionario/")({
  head: () => ({
    meta: [
      { title: "Diccionario de señas — Manos Vivas LSM" },
      {
        name: "description",
        content:
          "Busca señas de LSM por categoría: abecedario, números, saludos, familia y emergencias.",
      },
      { property: "og:title", content: "Diccionario de señas LSM" },
      {
        property: "og:description",
        content:
          "Fichas visuales de Lengua de Señas Mexicana con descripción del movimiento y consejos.",
      },
    ],
  }),
  component: Diccionario,
});

function Diccionario() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryId | "todas">("todas");
  const { aprendidas } = useProgress();
  const resultados = searchSigns(query, cat);

  return (
    <AppShell titulo="Diccionario" subtitulo="Busca una seña o explora por categoría">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar seña…"
          aria-label="Buscar seña"
          className="min-h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {(["todas", ...categories.map((c) => c.id)] as const).map((id) => {
          const label =
            id === "todas"
              ? "Todas"
              : categories.find((c) => c.id === id)!.nombre;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCat(id)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
                cat === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {resultados.length} {resultados.length === 1 ? "seña" : "señas"}
      </p>

      <ul className="mt-2 space-y-3">
        {resultados.map((sign) => (
          <li key={sign.id}>
            <Link
              to="/diccionario/$signId"
              params={{ signId: sign.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <HandSignIllustration sign={sign} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {sign.palabra}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {sign.movimiento}
                </p>
              </div>
              {aprendidas.includes(sign.id) ? (
                <Check className="size-5 shrink-0 text-primary" aria-label="Aprendida" />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      {resultados.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          No encontramos esa seña. Intenta con otra palabra.
        </p>
      ) : null}
    </AppShell>
  );
}
