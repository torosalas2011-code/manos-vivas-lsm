import { createFileRoute } from "@tanstack/react-router";
import { Award, Flame, ListChecks, Target } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProgressBar } from "@/components/ProgressBar";
import { categories, signsByCategory, signs } from "@/lib/lsm-data";
import { casosClinicos } from "@/lib/lsm-clinico";
import { useProgress, aprendidasPorCategoria, precision } from "@/lib/progress";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso — Manos Vivas LSM" },
      {
        name: "description",
        content:
          "Consulta tu racha, señas aprendidas, precisión y logros en tu aprendizaje de LSM.",
      },
      { property: "og:title", content: "Mi progreso en LSM" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: "Racha, señas aprendidas, precisión y logros de Manos Vivas LSM.",
      },
    ],
  }),
  component: Progreso,
});

function Progreso() {
  const {
    aprendidas,
    rachaActual,
    mejorRacha,
    cuestionarios,
    aciertos,
    respuestas,
    reiniciar,
    casosCompletados,
  } = useProgress();

  const logros = [
    { id: "a", nombre: "Primera seña", logrado: aprendidas.length >= 1 },
    { id: "b", nombre: "10 señas aprendidas", logrado: aprendidas.length >= 10 },
    { id: "c", nombre: "Racha de 3 días", logrado: mejorRacha >= 3 },
    { id: "d", nombre: "5 cuestionarios", logrado: cuestionarios >= 5 },
    {
      id: "e",
      nombre: "Precisión de 80%",
      logrado: respuestas >= 10 && precision(aciertos, respuestas) >= 80,
    },
    { id: "f", nombre: "Primer caso clínico", logrado: casosCompletados.length >= 1 },
    { id: "g", nombre: "Todos los casos clínicos", logrado: casosCompletados.length >= casosClinicos.length },
    { id: "h", nombre: "Experto en signos vitales", logrado: aprendidasPorCategoria(aprendidas, "signos-vitales") >= signsByCategory("signos-vitales").length },
    { id: "i", nombre: "Escala de dolor dominada", logrado: aprendidasPorCategoria(aprendidas, "dolor") >= signsByCategory("dolor").length },
    { id: "j", nombre: "Triaje completo", logrado: aprendidasPorCategoria(aprendidas, "sintomas") >= signsByCategory("sintomas").length },
  ];

  const stats = [
    { icon: Flame, label: "Racha actual", valor: `${rachaActual} d` },
    { icon: Award, label: "Mejor racha", valor: `${mejorRacha} d` },
    { icon: ListChecks, label: "Cuestionarios", valor: `${cuestionarios}` },
    { icon: Target, label: "Precisión", valor: `${precision(aciertos, respuestas)}%` },
  ];

  return (
    <AppShell titulo="Mi progreso" subtitulo="Tu avance en Lengua de Señas Mexicana">
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, valor }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {valor}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold text-foreground">Avance general</h2>
        <div className="mt-3">
          <ProgressBar
            valor={aprendidas.length}
            total={signs.length}
            etiqueta="Señas aprendidas"
          />
        </div>
      </section>

      <h2 className="mt-7 text-base font-semibold text-foreground">Por categoría</h2>
      <div className="mt-3 space-y-4 rounded-2xl border border-border bg-card p-5">
        {categories.map((c) => (
          <ProgressBar
            key={c.id}
            valor={aprendidasPorCategoria(aprendidas, c.id)}
            total={signsByCategory(c.id).length}
            etiqueta={c.nombre}
          />
        ))}
      </div>

      <h2 className="mt-7 text-base font-semibold text-foreground">Logros</h2>
      <ul className="mt-3 space-y-2">
        {logros.map((l) => (
          <li
            key={l.id}
            className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-4"
          >
            <Award
              className={l.logrado ? "size-5 text-accent" : "size-5 text-muted-foreground"}
              aria-hidden="true"
            />
            <span
              className={
                l.logrado
                  ? "font-medium text-foreground"
                  : "font-medium text-muted-foreground"
              }
            >
              {l.nombre}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          if (window.confirm("¿Seguro que quieres borrar todo tu progreso?")) {
            reiniciar();
          }
        }}
        className="mt-8 min-h-12 w-full rounded-xl border border-border bg-background px-5 text-sm font-medium text-muted-foreground"
      >
        Reiniciar mi progreso
      </button>
    </AppShell>
  );
}
