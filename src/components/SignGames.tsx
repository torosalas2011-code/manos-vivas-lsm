import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Flame, Hand, Pause, Play, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandSignIllustration } from "@/components/HandSignIllustration";
import { answerScore, isPair, memoryDeck, sprintQuestions, type GameTheme } from "@/lib/lsm-games";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

function Results({ title, children, onExit }: { title: string; children: React.ReactNode; onExit: () => void }) {
  return <section className="py-8 text-center">
    <Trophy className="mx-auto size-16 text-accent motion-safe:animate-in motion-safe:zoom-in" aria-hidden="true" />
    <h2 className="mt-5 text-2xl font-bold">{title}</h2>
    <div className="mt-4 space-y-3 text-muted-foreground">{children}</div>
    <Button className="mt-7 min-h-12 w-full" onClick={onExit}><RotateCcw />Volver a jugar</Button>
    <Button asChild variant="outline" className="mt-3 min-h-12 w-full"><Link to="/diccionario">Repasar señas</Link></Button>
  </section>;
}

export function MemoryGame({ theme, onExit }: { theme: GameTheme; onExit: () => void }) {
  const [deck] = useState(() => memoryDeck(theme));
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Encuentra la seña y su palabra");
  const complete = matched.length === deck.length;

  useEffect(() => {
    if (open.length !== 2) return;
    const a = deck.find((tile) => tile.id === open[0]);
    const b = deck.find((tile) => tile.id === open[1]);
    if (!a || !b) return;
    const pair = isPair(a, b);
    setMessage(pair ? `¡Pareja encontrada: ${a.sign.palabra}!` : "No es pareja. Inténtalo de nuevo.");
    const timer = setTimeout(() => {
      if (pair) setMatched((prev) => [...prev, a.id, b.id]);
      setOpen([]);
    }, pair ? 650 : 1400);
    return () => clearTimeout(timer);
  }, [open, deck]);

  function flip(id: string) {
    if (open.length === 2 || open.includes(id) || matched.includes(id)) return;
    if (open.length === 1) setMoves((prev) => prev + 1);
    setOpen((prev) => [...prev, id]);
  }

  if (complete) return <Results title="¡Memoria completada!" onExit={onExit}>
    <p className="text-3xl font-bold text-foreground">6 parejas</p>
    <p>{moves} intentos · {Math.round(600 / moves)}% de precisión</p>
    <p>Ahora reproduce cada seña con tus manos.</p>
  </Results>;

  return <section>
    <div className="flex items-center justify-between border-b border-border pb-3 text-sm">
      <span className="font-semibold">{matched.length / 2} / 6 parejas</span><span>{moves} intentos</span>
    </div>
    <p className="my-4 min-h-10 text-center text-sm font-semibold text-primary" role="status">{message}</p>
    <div className="grid grid-cols-3 gap-2">
      {deck.map((tile, index) => {
        const visible = open.includes(tile.id) || matched.includes(tile.id);
        const done = matched.includes(tile.id);
        return <Button key={tile.id} variant="outline" onClick={() => flip(tile.id)}
          disabled={done || (open.length === 2 && !visible)}
          aria-label={visible ? `${tile.kind === "visual" ? "Seña" : "Palabra"}: ${tile.sign.palabra}` : `Tarjeta ${index + 1}`}
          aria-pressed={visible}
          className={cn("relative h-32 min-w-0 overflow-hidden whitespace-normal p-1 transition-colors [&_figure]:border-0 [&_svg]:h-24 [&_svg]:w-full", !visible && "border-primary/30 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground", done && "border-primary bg-secondary disabled:opacity-100")}>
          {visible ? tile.kind === "visual" ? <div className="w-full"><HandSignIllustration sign={tile.sign} size="lg" hideAnswer /></div> : <span className="break-words text-center text-sm font-bold">{tile.sign.palabra}</span> : <Hand className="size-8" aria-hidden="true" />}
          {done && <Check className="absolute right-1 top-1 size-4 text-primary" aria-hidden="true" />}
        </Button>;
      })}
    </div>
    <Button variant="ghost" onClick={onExit} className="mt-5 min-h-11 w-full">Salir de la partida</Button>
  </section>;
}

export function SprintGame({ theme, onExit }: { theme: GameTheme; onExit: () => void }) {
  const [questions] = useState(() => sprintQuestions(theme));
  const [remaining, setRemaining] = useState(60);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const saved = useRef(false);
  const { registrarCuestionario, listo } = useProgress();
  const finished = remaining === 0 || index >= questions.length;
  const question = questions[index];

  useEffect(() => {
    if (paused || finished) return;
    const deadline = Date.now() + remaining * 1000;
    const timer = setInterval(() => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 200);
    return () => clearInterval(timer);
    // The deadline is recreated only on pause/resume, not on each tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, finished]);

  useEffect(() => {
    if (!finished || !listo || saved.current) return;
    saved.current = true;
    if (answered > 0) registrarCuestionario(correct, answered, false);
  }, [finished, listo, correct, answered, registrarCuestionario]);

  function answer(id: string) {
    if (!question || choice || paused || finished) return;
    const right = id === question.sign.id;
    const score = answerScore(right, streak);
    setChoice(id);
    setStreak(score.streak);
    setPoints((prev) => prev + score.points);
    setAnswered((prev) => prev + 1);
    if (right) setCorrect((prev) => prev + 1);
  }

  if (finished) return <Results title={index >= questions.length ? "¡Ronda completada!" : "¡Tiempo cumplido!"} onExit={onExit}>
    <p className="text-4xl font-bold text-primary">{points} puntos</p>
    <p>{correct} aciertos de {answered} respuestas</p>
    <p>{answered > 0 ? "Tu práctica cuenta en Progreso y en tu racha." : "Puedes intentarlo otra vez a tu ritmo."}</p>
    <div className="pt-4 text-left">
      <h3 className="mb-2 font-semibold text-foreground">Señas de esta ronda</h3>
      <div className="flex flex-wrap gap-x-4 gap-y-2">{questions.slice(0, answered).map(({ sign }) => <Link key={sign.id} to="/diccionario/$signId" params={{ signId: sign.id }} className="text-sm text-primary underline">{sign.palabra}</Link>)}</div>
    </div>
  </Results>;
  if (!question) return null;

  return <section>
    <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
      <span role="timer" aria-label="Tiempo restante" className={cn("text-xl font-bold tabular-nums", remaining <= 10 ? "text-destructive" : "text-primary")}>{remaining} s</span>
      <span className="font-semibold tabular-nums">{points} pts</span>
      <Button variant="outline" size="icon" className="size-11" onClick={() => setPaused((prev) => !prev)} aria-label={paused ? "Continuar juego" : "Pausar juego"} title={paused ? "Continuar" : "Pausar"}>{paused ? <Play /> : <Pause />}</Button>
    </div>
    {paused ? <div className="py-16 text-center"><Pause className="mx-auto size-10 text-primary" /><h2 className="mt-4 text-xl font-bold">Partida en pausa</h2><Button className="mt-5 min-h-12" onClick={() => setPaused(false)}><Play />Continuar juego</Button></div> : <>
      <div className="my-4 flex justify-between text-sm text-muted-foreground"><span>Seña {index + 1} / {questions.length}</span><span className="flex items-center gap-1 text-accent"><Flame className="size-4" />Combo ×{streak}</span></div>
      <HandSignIllustration sign={question.sign} size="lg" hideAnswer />
      <p className="mt-3 text-sm text-muted-foreground">{question.sign.movimiento}</p>
      <h2 className="my-4 text-base font-semibold">¿Qué seña es?</h2>
      <div className="grid grid-cols-2 gap-2">{question.options.map((option) => <Button key={option.id} variant="outline" disabled={choice !== null} onClick={() => answer(option.id)}
        className={cn("h-auto min-h-14 whitespace-normal px-2 py-3 disabled:opacity-100", choice && option.id === question.sign.id && "border-primary bg-primary text-primary-foreground", choice === option.id && choice !== question.sign.id && "border-destructive bg-destructive text-destructive-foreground")}>
        {option.palabra}{choice && option.id === question.sign.id && <Check />}{choice === option.id && choice !== question.sign.id && <X />}
      </Button>)}</div>
      {choice && <div className="mt-4" role="status"><p className="text-sm font-semibold">{choice === question.sign.id ? "¡Correcto!" : `La respuesta es: ${question.sign.palabra}`}</p><Button className="mt-3 min-h-12 w-full" onClick={() => { setChoice(null); setIndex((prev) => prev + 1); }}>{index + 1 === questions.length ? "Ver resultado" : "Siguiente seña"}</Button></div>}
    </>}
    <Button variant="ghost" className="mt-5 min-h-11 w-full" onClick={onExit}>Salir de la partida</Button>
  </section>;
}