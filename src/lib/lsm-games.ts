import { signs, type Sign } from "./lsm-data";

export type GameTheme = "clinica" | "base";
export type MemoryTile = { id: string; sign: Sign; kind: "visual" | "palabra" };

export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i];
    const b = result[j];
    if (a !== undefined && b !== undefined) { result[i] = b; result[j] = a; }
  }
  return result;
}

const pools: Record<GameTheme, string[]> = {
  clinica: ["cabeza", "pecho", "corazon", "estomago", "garganta", "brazo", "mareo", "tos", "doctor", "ayuda", "hospital", "dolor"],
  base: ["letra-a", "letra-c", "letra-d", "letra-f", "letra-g", "letra-h", "letra-l", "letra-r", "letra-w", "letra-x", "letra-y", "letra-z"],
};

export function gameSigns(theme: GameTheme): Sign[] {
  return signs.filter((sign) => pools[theme].includes(sign.id));
}

export function memoryDeck(theme: GameTheme): MemoryTile[] {
  return shuffle(shuffle(gameSigns(theme)).slice(0, 6).flatMap((sign) => [
    { id: `${sign.id}-visual`, sign, kind: "visual" as const },
    { id: `${sign.id}-palabra`, sign, kind: "palabra" as const },
  ]));
}

export function isPair(a: MemoryTile, b: MemoryTile): boolean {
  return a.id !== b.id && a.sign.id === b.sign.id && a.kind !== b.kind;
}

export function sprintQuestions(theme: GameTheme) {
  const pool = gameSigns(theme);
  return shuffle(pool).slice(0, 10).map((sign) => ({
    sign,
    options: shuffle([sign, ...shuffle(pool.filter((s) => s.id !== sign.id)).slice(0, 3)]),
  }));
}

export function answerScore(correct: boolean, streak: number) {
  const nextStreak = correct ? streak + 1 : 0;
  return { streak: nextStreak, points: correct ? 100 + Math.min(nextStreak - 1, 4) * 25 : 0 };
}