import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HandSignIllustration } from "@/components/HandSignIllustration";
import { getProtocolo } from "@/lib/lsm-clinico";
import { getSign } from "@/lib/lsm-data";

export const Route = createFileRoute("/guia/$protocoloId")({
  loader: ({ params }) => {
    const protocolo = getProtocolo(params.protocoloId);
    if (!protocolo) throw notFound();
    return { protocolo };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Protocolo no encontrado — Manos Vivas" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.protocolo.titulo} en LSM — Manos Vivas`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.protocolo.resumen },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.protocolo.resumen },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Protocolo,
});

function Protocolo() {
  const { protocolo } = Route.useLoaderData();
  return (
    <AppShell titulo={protocolo.titulo} subtitulo={protocolo.resumen}>
      <Link to="/guia" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary">
        <ArrowLeft className="size-4" aria-hidden="true" /> Volver a la guía
      </Link>
      <ol className="mt-2 space-y-4">
        {protocolo.pasos.map((paso, i) => (
          <li key={paso.titulo} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Paso {i + 1}</p>
            <p className="mt-1 font-semibold text-foreground">{paso.titulo}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{paso.texto}</p>
            {paso.senas.length ? (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {paso.senas.map((id) => {
                  const s = getSign(id);
                  if (!s) return null;
                  return (
                    <Link
                      key={id}
                      to="/diccionario/$signId"
                      params={{ signId: id }}
                      className="flex w-24 shrink-0 flex-col items-center rounded-xl border border-border bg-background p-2"
                    >
                      <HandSignIllustration sign={s} size="sm" />
                      <span className="mt-1 text-center text-xs font-medium text-foreground">{s.palabra}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
