import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { casosClinicos } from "@/lib/lsm-clinico";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/casos/")({
  head: () => ({
    meta: [
      { title: "Casos clínicos en LSM — Manos Vivas" },
      { name: "description", content: "Practica la atención a pacientes sordos con casos clínicos paso a paso en Lengua de Señas Mexicana." },
      { property: "og:title", content: "Casos clínicos en LSM" },
      { property: "og:description", content: "Situaciones reales de enfermería para practicar LSM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Casos,
});

function Casos() {
  const { casosCompletados } = useProgress();
  return (
    <AppShell titulo="Casos clínicos" subtitulo="Atiende al paciente eligiendo la seña correcta">
      <ul className="space-y-3">
        {casosClinicos.map((c) => (
          <li key={c.id}>
            <Link
              to="/casos/$casoId"
              params={{ casoId: c.id }}
              className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{c.titulo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.escenario}</p>
              </div>
              {casosCompletados.includes(c.id) ? (
                <CheckCircle2 className="size-5 text-primary" aria-label="Completado" />
              ) : (
                <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
