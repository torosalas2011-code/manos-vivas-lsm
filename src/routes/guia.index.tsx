import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { protocolos } from "@/lib/lsm-clinico";

export const Route = createFileRoute("/guia/")({
  head: () => ({
    meta: [
      { title: "Guía clínica en LSM — Manos Vivas" },
      { name: "description", content: "Protocolos de enfermería para atender a pacientes sordos: triaje, anamnesis, dolor, signos vitales y consentimiento." },
      { property: "og:title", content: "Guía clínica en LSM" },
      { property: "og:description", content: "Protocolos paso a paso para atender a pacientes sordos en Lengua de Señas Mexicana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Guia,
});

function Guia() {
  return (
    <AppShell titulo="Guía clínica" subtitulo="Protocolos de atención al paciente sordo">
      <ul className="space-y-3">
        {protocolos.map((p) => (
          <li key={p.id}>
            <Link
              to="/guia/$protocoloId"
              params={{ protocoloId: p.id }}
              className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{p.titulo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.resumen}</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
        Material educativo de apoyo. Sigue siempre los protocolos de tu institución y solicita intérprete certificado de LSM cuando sea posible.
      </p>
    </AppShell>
  );
}
