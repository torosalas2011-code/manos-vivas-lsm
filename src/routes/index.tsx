import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, BookOpen, Dumbbell, Target, Stethoscope, ClipboardList } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress, nivelActual, aprendidasPorCategoria, hoy } from "@/lib/progress";
import { signs, retoDelDia } from "@/lib/lsm-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manos Vivas LSM — Lengua de Señas para personal de salud" },
      {
        name: "description",
        content:
          "LSM para estudiantes de enfermería y personal de salud: vocabulario clínico, protocolos de atención y casos clínicos.",
      },
      { property: "og:title", content: "Manos Vivas LSM — LSM clínica" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content:
          "Comunícate con pacientes sordos: vocabulario médico, triaje, valoración del dolor y casos clínicos en LSM.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { aprendidas, rachaActual, retoCompletado, listo } = useProgress();
  const nivel = nivelActual(aprendidas);
  const avance = aprendidasPorCategoria(aprendidas, nivel.categoria);
  const reto = retoDelDia(hoy());

  return (
    <AppShell
      titulo="Manos Vivas LSM"
      subtitulo="LSM para enfermería y personal de salud"
    >
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Racha actual</p>
            <p className="font-display text-3xl font-bold text-foreground">
              {listo ? rachaActual : 0} {rachaActual === 1 ? "día" : "días"}
            </p>
          </div>
          <Flame className="size-10 shrink-0 text-accent" aria-hidden="true" />
        </div>
        <div className="mt-5">
          <ProgressBar
            valor={avance}
            total={nivel.meta}
            etiqueta={`Nivel ${nivel.id}: ${nivel.nombre}`}
          />
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-primary p-5 text-primary-foreground">
        <div className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Target className="size-4" aria-hidden="true" />
          Reto del día
        </div>
        <h2 className="mt-2 text-xl font-bold">
          {retoCompletado ? "¡Reto completado!" : reto.titulo}
        </h2>
        <p className="mt-1 text-sm opacity-90">
          {retoCompletado
            ? "Vuelve mañana por un reto nuevo de señas, o sigue practicando libremente."
            : `${reto.descripcion} ${reto.preguntas} señas para mantener viva tu racha.`}
        </p>
        <Link
          to="/practica"
          search={{ reto: retoCompletado ? undefined : true }}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-background px-5 text-sm font-semibold text-foreground"
        >
          {retoCompletado ? "Practicar de nuevo" : "Empezar reto"}
        </Link>
      </section>

      <h2 className="mt-7 text-base font-semibold text-foreground">
        Continúa aprendiendo
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link
          to="/diccionario"
          className="rounded-2xl border border-border bg-card p-4"
        >
          <BookOpen className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 font-semibold text-foreground">Diccionario</p>
          <p className="text-xs text-muted-foreground">
            {signs.length} señas con fichas visuales
          </p>
        </Link>
        <Link
          to="/practica"
          className="rounded-2xl border border-border bg-card p-4"
        >
          <Dumbbell className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 font-semibold text-foreground">Práctica</p>
          <p className="text-xs text-muted-foreground">
            Cuestionarios de opción múltiple
          </p>
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link to="/guia" className="rounded-2xl border border-border bg-card p-4">
          <ClipboardList className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 font-semibold text-foreground">Guía clínica</p>
          <p className="text-xs text-muted-foreground">Protocolos de atención al paciente sordo</p>
        </Link>
        <Link to="/casos" className="rounded-2xl border border-border bg-card p-4">
          <Stethoscope className="size-6 text-primary" aria-hidden="true" />
          <p className="mt-3 font-semibold text-foreground">Casos clínicos</p>
          <p className="text-xs text-muted-foreground">Practica situaciones reales paso a paso</p>
        </Link>
      </div>

      <p className="mt-6 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
        Material educativo de apoyo. No sustituye a un intérprete certificado de LSM en la atención clínica.
      </p>
    </AppShell>
  );
}
