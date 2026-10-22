import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Brain, Gamepad2, Timer, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { MemoryGame, SprintGame } from "@/components/SignGames";
import type { GameTheme } from "@/lib/lsm-games";

export const Route = createFileRoute("/juegos")({
  head: () => ({ meta: [
    { title: "Juegos de señas — Manos Vivas LSM" },
    { name: "description", content: "Practica LSM con memoria de parejas y retos contrarreloj para estudiantes de enfermería y personal de salud." },
    { property: "og:title", content: "Juegos de señas — Manos Vivas LSM" },
    { property: "og:description", content: "Memoria y contrarreloj para repasar señas clínicas y el abecedario mexicano." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Games,
});

function Games() {
  const [theme, setTheme] = useState<GameTheme>("clinica");
  const [mode, setMode] = useState<"memoria" | "sprint" | null>(null);
  return <AppShell titulo={mode === "memoria" ? "Memoria de señas" : mode === "sprint" ? "Señas contrarreloj" : "Juegos de señas"} subtitulo={mode ? (theme === "clinica" ? "Vocabulario clínico" : "Abecedario LSM") : "Una partida más, una seña más"}>
    {mode ? <><Button variant="ghost" onClick={() => setMode(null)} className="mb-3 min-h-11"><ArrowLeft />Juegos</Button>{mode === "memoria" ? <MemoryGame theme={theme} onExit={() => setMode(null)} /> : <SprintGame theme={theme} onExit={() => setMode(null)} />}</> : <>
      <div className="flex items-center gap-4 border-b border-border py-5"><Gamepad2 className="size-14 shrink-0 text-primary" aria-hidden="true" /><div><h2 className="text-xl font-bold">Pon tus manos en juego</h2><p className="mt-1 text-sm text-muted-foreground">Memoria, concentración y señas.</p></div></div>
      <fieldset className="my-5"><legend className="mb-2 text-sm font-semibold">Vocabulario</legend><div className="grid grid-cols-2 gap-2">{([ ["clinica", "Clínico"], ["base", "Abecedario"] ] as const).map(([id, name]) => <Button key={id} variant={theme === id ? "default" : "outline"} aria-pressed={theme === id} onClick={() => setTheme(id)} className="min-h-11">{name}</Button>)}</div></fieldset>
      <div className="space-y-4">
        <article className="rounded-lg border border-border bg-card p-5"><Brain className="size-8 text-primary" aria-hidden="true" /><h2 className="mt-3 text-xl font-bold">Memoria de señas</h2><p className="mt-2 text-sm text-muted-foreground">6 parejas · Sin límite de tiempo</p><Button className="mt-4 min-h-12 w-full" onClick={() => setMode("memoria")}><Gamepad2 />Jugar memoria</Button></article>
        <article className="rounded-lg border border-border bg-card p-5"><Timer className="size-8 text-accent" aria-hidden="true" /><h2 className="mt-3 text-xl font-bold">Señas contrarreloj</h2><p className="mt-2 text-sm text-muted-foreground">60 segundos · 10 señas · Combos de aciertos</p><Button className="mt-4 min-h-12 w-full" onClick={() => setMode("sprint")}><Zap />Jugar contrarreloj</Button></article>
      </div>
    </>}
    <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Ilustraciones y descripciones aproximadas de apoyo educativo. No sustituyen a un intérprete certificado de LSM.</p>
  </AppShell>;
}