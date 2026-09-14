import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, BookOpen, Dumbbell, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { useProgress, nivelActual, aprendidasPorCategoria } from "@/lib/progress";
import { signs } from "@/lib/lsm-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manos Vivas LSM — Aprende Lengua de Señas Mexicana" },
      {
        name: "description",
        content:
          "Aprende Lengua de Señas Mexicana con diccionario visual, retos diarios, cuestionarios y seguimiento de tu racha.",
      },
      { property: "og:title", content: "Manos Vivas LSM" },
      {
        property: "og:description",
        content:
          "Diccionario visual, misiones diarias y práctica interactiva para aprender LSM desde tu celular.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { aprendidas, rachaActual, retoCompletado, listo } = useProgress();
  const nivel = nivelActual(aprendidas);
  const avance = aprendidasPorCategoria(aprendidas, nivel.categoria);

  return (
    <AppShell
      titulo="Manos Vivas LSM"
      subtitulo="Tu práctica diaria de Lengua de Señas Mexicana"
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
          {retoCompletado ? "¡Reto completado!" : "Cuestionario de 8 preguntas"}
        </h2>
        <p className="mt-1 text-sm opacity-90">
          {retoCompletado
            ? "Vuelve mañana por un reto nuevo, o sigue practicando libremente."
            : "Responde correctamente y mantén viva tu racha de aprendizaje."}
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
    </AppShell>
  );
}
