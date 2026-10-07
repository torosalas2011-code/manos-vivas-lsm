import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HandSignIllustration } from "@/components/HandSignIllustration";
import { SignVideo } from "@/components/SignVideo";
import { Button } from "@/components/ui/button";
import { getSignVideo } from "@/lib/lsm-videos";
import { getSign, getCategory } from "@/lib/lsm-data";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diccionario/$signId")({
  loader: ({ params }) => {
    const sign = getSign(params.signId);
    if (!sign) throw notFound();
    return { sign };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Seña no encontrada — Manos Vivas LSM" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const titulo = `${loaderData.sign.palabra} en LSM — Manos Vivas`;
    return {
      meta: [
        { title: titulo },
        { name: "description", content: loaderData.sign.movimiento },
        { property: "og:title", content: titulo },
        { property: "og:description", content: loaderData.sign.movimiento },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: FichaSeña,
});

function FichaSeña() {
  const { sign } = Route.useLoaderData();
  const { aprendidas, marcarAprendida } = useProgress();
  const categoria = getCategory(sign.categoria);
  const aprendida = aprendidas.includes(sign.id);
  const video = getSignVideo(sign);

  return (
    <AppShell titulo={sign.palabra} subtitulo={categoria.nombre}>
      <Link
        to="/diccionario"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al diccionario
      </Link>

      <div className="mt-2 flex flex-col items-center rounded-2xl border border-border bg-card p-4">
        <HandSignIllustration sign={sign} size="lg" showLabel />
        <p className="mt-4 font-display text-2xl font-bold text-foreground">
          {sign.palabra}
        </p>
        <p className="text-sm text-muted-foreground">{categoria.nombre}</p>
      </div>

      {video ? <SignVideo key={sign.id} video={video} /> : (
        <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
          Aún no hay una demostración en video verificada para esta seña.
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Material educativo; no sustituye a un intérprete certificado de LSM. Las ilustraciones y descripciones son aproximaciones educativas.
      </p>

      <section className="mt-5 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Cómo se hace
        </h2>
        <p className="mt-2 text-base leading-relaxed text-foreground">
          {sign.movimiento}
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-secondary p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Consejo
        </h2>
        <p className="mt-2 text-base leading-relaxed text-secondary-foreground">
          {sign.consejo}
        </p>
      </section>

      {sign.notaClinica ? (
        <section className="mt-4 rounded-2xl border border-primary/30 bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
            Nota clínica
          </h2>
          <p className="mt-2 text-base leading-relaxed text-foreground">
            {sign.notaClinica}
          </p>
        </section>
      ) : null}

      <Button
        type="button"
        onClick={() => marcarAprendida(sign.id)}
        className={cn(
          "mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
          aprendida
            ? "border border-primary bg-background text-primary"
            : "bg-primary text-primary-foreground",
        )}
      >
        {aprendida ? <Check className="size-5" aria-hidden="true" /> : null}
        {aprendida ? "Aprendida" : "Marcar como aprendida"}
      </Button>
    </AppShell>
  );
}
