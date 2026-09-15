import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SignGlyph } from "@/components/SignGlyph";
import {
  signs,
  categories,
  retoDelDia,
  type CategoryId,
  type Sign,
} from "@/lib/lsm-data";
import { useProgress, precision, hoy } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practica")({
  validateSearch: (search: Record<string, unknown>): { reto?: boolean | undefined } => ({
    reto: search['reto'] === true || search['reto'] === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Práctica interactiva — Manos Vivas LSM" },
      {
        name: "description",
        content:
          "Cuestionarios de opción múltiple para poner a prueba lo que aprendiste en Lengua de Señas Mexicana.",
      },
      { property: "og:title", content: "Práctica de LSM" },
      {
        property: "og:description",
        content: "Responde cuestionarios y mide tu precisión en LSM.",
      },
    ],
  }),
  component: Practica,
});

interface Pregunta {
  sign: Sign;
  opciones: string[];
}

function barajar<T>(arr: T[]): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

function crearPreguntas(categoria: CategoryId | "todas", total: number): Pregunta[] {
  const universo =
    categoria === "todas"
      ? signs
      : signs.filter((s) => s.categoria === categoria);
  const base = universo.length >= 4 ? universo : signs;
  return barajar(base)
    .slice(0, total)
    .map((sign) => {
      const distractores = barajar(base.filter((s) => s.id !== sign.id))
        .slice(0, 3)
        .map((s) => s.palabra);
      return { sign, opciones: barajar([sign.palabra, ...distractores]) };
    });
}

function Practica() {
  const { reto } = Route.useSearch();
  const { registrarCuestionario, aciertos, respuestas } = useProgress();
  const [categoria, setCategoria] = useState<CategoryId | "todas">("todas");
  const [semilla, setSemilla] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);

  const total = reto ? 8 : 6;
  const preguntas = useMemo(
    () => crearPreguntas(categoria, total),
    [categoria, total, semilla],
  );

  const terminado = iniciado && indice >= preguntas.length;
  const pregunta = preguntas[indice];

  function responder(opcion: string) {
    if (elegida || !pregunta) return;
    setElegida(opcion);
    if (opcion === pregunta.sign.palabra) setCorrectas((c) => c + 1);
  }

  function siguiente() {
    if (!pregunta) return;
    const esUltima = indice + 1 >= preguntas.length;
    const finales =
      elegida === pregunta.sign.palabra ? correctas : correctas;
    setElegida(null);
    setIndice((i) => i + 1);
    if (esUltima) registrarCuestionario(finales, preguntas.length, Boolean(reto));
  }

  function reiniciarQuiz() {
    setSemilla((s) => s + 1);
    setIndice(0);
    setElegida(null);
    setCorrectas(0);
    setIniciado(true);
  }

  if (!iniciado) {
    return (
      <AppShell
        titulo="Práctica"
        subtitulo={reto ? "Reto del día: 8 preguntas" : "Elige qué quieres repasar"}
      >
        <div className="grid grid-cols-2 gap-3">
          {(["todas", ...categories.map((c) => c.id)] as const).map((id) => {
            const label =
              id === "todas" ? "Todas" : categories.find((c) => c.id === id)!.nombre;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategoria(id)}
                className={cn(
                  "min-h-14 rounded-2xl border px-3 text-sm font-semibold transition-colors",
                  categoria === id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIniciado(true)}
          className="mt-6 min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Comenzar cuestionario de {total} preguntas
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Precisión histórica: {precision(aciertos, respuestas)}%
        </p>
      </AppShell>
    );
  }

  if (terminado) {
    const pct = Math.round((correctas / preguntas.length) * 100);
    return (
      <AppShell titulo="Resultados" subtitulo="Así te fue en este cuestionario">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="font-display text-5xl font-bold text-foreground">{pct}%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {correctas} de {preguntas.length} respuestas correctas
          </p>
          <p className="mt-4 text-base text-foreground">
            {pct >= 80
              ? "Excelente dominio. Sigue así."
              : pct >= 50
                ? "Buen avance, repasa las señas que fallaste."
                : "Vuelve al diccionario y practica de nuevo."}
          </p>
        </div>

        <button
          type="button"
          onClick={reiniciarQuiz}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Repetir cuestionario
        </button>
        <Link
          to="/diccionario"
          className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground"
        >
          Repasar el diccionario
        </Link>
      </AppShell>
    );
  }

  if (!pregunta) return null;

  return (
    <AppShell
      titulo={reto ? "Reto del día" : "Práctica"}
      subtitulo={`Pregunta ${indice + 1} de ${preguntas.length}`}
    >
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6">
        <SignGlyph sign={pregunta.sign} size="lg" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Qué significa esta seña?
        </p>
      </div>

      <ul className="mt-5 space-y-3">
        {pregunta.opciones.map((opcion) => {
          const esCorrecta = opcion === pregunta.sign.palabra;
          const mostrada = elegida !== null;
          return (
            <li key={opcion}>
              <button
                type="button"
                onClick={() => responder(opcion)}
                disabled={mostrada}
                className={cn(
                  "flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left text-base font-medium transition-colors",
                  !mostrada && "border-border bg-card text-foreground",
                  mostrada && esCorrecta && "border-primary bg-primary text-primary-foreground",
                  mostrada &&
                    !esCorrecta &&
                    opcion === elegida &&
                    "border-destructive bg-destructive text-destructive-foreground",
                  mostrada && !esCorrecta && opcion !== elegida && "border-border bg-card text-muted-foreground",
                )}
              >
                <span className="min-w-0 truncate">{opcion}</span>
                {mostrada && esCorrecta ? <Check className="size-5 shrink-0" aria-hidden="true" /> : null}
                {mostrada && !esCorrecta && opcion === elegida ? (
                  <X className="size-5 shrink-0" aria-hidden="true" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {elegida ? (
        <div className="mt-5">
          <p className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
            {pregunta.sign.movimiento}
          </p>
          <button
            type="button"
            onClick={siguiente}
            className="mt-4 min-h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            {indice + 1 >= preguntas.length ? "Ver resultados" : "Siguiente"}
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}
