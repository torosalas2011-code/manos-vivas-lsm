import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { levels, getCategory, retoDelDia } from "@/lib/lsm-data";
import { useProgress, aprendidasPorCategoria, hoy } from "@/lib/progress";

export const Route = createFileRoute("/misiones")({
  head: () => ({
    meta: [
      { title: "Misiones y retos — Manos Vivas LSM" },
      {
        name: "description",
        content:
          "Avanza por niveles progresivos de LSM y completa el reto diario para mantener tu racha.",
      },
      { property: "og:title", content: "Misiones y retos de LSM" },
      {
        property: "og:description",
        content:
          "Niveles progresivos y retos diarios para practicar Lengua de Señas Mexicana.",
      },
    ],
  }),
  component: Misiones,
});

function Misiones() {
  const { aprendidas, retoCompletado, cuestionarios } = useProgress();
  const reto = retoDelDia(hoy());

  let anteriorCompleto = true;

  return (
    <AppShell titulo="Misiones" subtitulo="Avanza nivel por nivel a tu ritmo">
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Target className="size-4" aria-hidden="true" />
          Reto de hoy
        </div>
        <p className="mt-2 font-semibold text-foreground">
          Completa un cuestionario de 8 preguntas
        </p>
        {retoCompletado ? (
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" aria-hidden="true" /> Completado hoy
          </p>
        ) : (
          <Link
            to="/practica"
            search={{ reto: true }}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Empezar reto
          </Link>
        )}
      </section>

      <h2 className="mt-7 text-base font-semibold text-foreground">Niveles</h2>
      <ol className="mt-3 space-y-3">
        {levels.map((nivel) => {
          const avance = aprendidasPorCategoria(aprendidas, nivel.categoria);
          const completo = avance >= nivel.meta;
          const desbloqueado = anteriorCompleto;
          anteriorCompleto = completo;

          return (
            <li
              key={nivel.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Nivel {nivel.id}
                  </p>
                  <p className="truncate font-semibold text-foreground">
                    {nivel.nombre}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {nivel.descripcion}
                  </p>
                </div>
                {completo ? (
                  <CheckCircle2
                    className="size-5 shrink-0 text-primary"
                    aria-label="Nivel completado"
                  />
                ) : !desbloqueado ? (
                  <Lock
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-label="Nivel bloqueado"
                  />
                ) : null}
              </div>

              <div className="mt-3">
                <ProgressBar
                  valor={avance}
                  total={nivel.meta}
                  etiqueta={`Señas aprendidas de ${getCategory(nivel.categoria).nombre}`}
                />
              </div>

              {desbloqueado && !completo ? (
                <Link
                  to="/diccionario"
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary"
                >
                  Estudiar estas señas
                </Link>
              ) : null}
              {!desbloqueado ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Completa el nivel anterior para desbloquearlo.
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Cuestionarios completados: {cuestionarios}
      </p>
    </AppShell>
  );
}
