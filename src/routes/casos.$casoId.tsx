import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HandSignIllustration } from "@/components/HandSignIllustration";
import { getCaso } from "@/lib/lsm-clinico";
import { getSign } from "@/lib/lsm-data";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/casos/$casoId")({
  loader: ({ params }) => {
    const caso = getCaso(params.casoId);
    if (!caso) throw notFound();
    return { caso };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Caso no encontrado — Manos Vivas" }, { name: "robots", content: "noindex" }] };
    }
    const t = `Caso clínico: ${loaderData.caso.titulo} — Manos Vivas`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.caso.escenario },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.caso.escenario },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Caso,
});

function Caso() {
  const { caso } = Route.useLoaderData();
  const { registrarCaso } = useProgress();
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [correctas, setCorrectas] = useState(0);

  const paso = caso.pasos[indice];
  const terminado = indice >= caso.pasos.length;

  function siguiente() {
    const esUltimo = indice + 1 >= caso.pasos.length;
    if (esUltimo) registrarCaso(caso.id, correctas, caso.pasos.length);
    setElegida(null);
    setIndice((i) => i + 1);
  }

  function reiniciar() {
    setIndice(0);
    setElegida(null);
    setCorrectas(0);
  }

  return (
    <AppShell titulo={caso.titulo} subtitulo="Caso clínico">
      <Link to="/casos" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" /> Todos los casos
      </Link>

      <div className="mt-2 rounded-2xl border border-border bg-secondary p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Escenario</p>
        <p className="mt-1 text-sm leading-relaxed text-secondary-foreground">{caso.escenario}</p>
      </div>

      {terminado ? (
        <div className="mt-5 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="font-display text-4xl font-bold text-foreground">
            {correctas}/{caso.pasos.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {correctas === caso.pasos.length
              ? "Atención impecable. ¡Caso resuelto!"
              : "Repasa las señas que fallaste y vuelve a intentarlo."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={reiniciar} className="min-h-12 rounded-xl border border-border bg-background text-sm font-semibold text-foreground">
              Repetir
            </button>
            <Link to="/casos" className="flex min-h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              Otro caso
            </Link>
          </div>
        </div>
      ) : paso ? (
        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">
            Paso {indice + 1} de {caso.pasos.length}
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">{paso.pregunta}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {paso.opciones.map((id) => {
              const s = getSign(id);
              if (!s) return null;
              const correcta = id === paso.respuesta;
              const estado = elegida
                ? correcta
                  ? "border-primary bg-primary/10"
                  : elegida === id
                    ? "border-destructive bg-destructive/10"
                    : "border-border opacity-60"
                : "border-border";
              return (
                <button
                  key={id}
                  type="button"
                  disabled={Boolean(elegida)}
                  onClick={() => {
                    setElegida(id);
                    if (correcta) setCorrectas((c) => c + 1);
                  }}
                  className={cn("flex flex-col items-center rounded-2xl border-2 bg-card p-2", estado)}
                >
                  <HandSignIllustration sign={s} size="sm" />
                  <span className="mt-1 text-sm font-semibold text-foreground">{s.palabra}</span>
                </button>
              );
            })}
          </div>
          {elegida ? (
            <>
              <p className="mt-4 text-sm text-foreground">
                {elegida === paso.respuesta ? "Correcto. " : "No es correcto. "}
                {getSign(paso.respuesta)?.notaClinica ?? getSign(paso.respuesta)?.consejo}
              </p>
              <button type="button" onClick={siguiente} className="mt-4 min-h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                {indice + 1 >= caso.pasos.length ? "Ver resultado" : "Siguiente paso"}
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}
