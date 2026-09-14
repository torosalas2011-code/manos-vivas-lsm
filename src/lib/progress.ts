import { useCallback, useEffect, useState } from "react";
import { signs, levels, type CategoryId } from "./lsm-data";

const STORAGE_KEY = "manos-vivas-lsm-v1";

export interface ProgressState {
  aprendidas: string[];
  cuestionarios: number;
  aciertos: number;
  respuestas: number;
  rachaActual: number;
  mejorRacha: number;
  ultimoDia: string | null;
  retoDia: string | null;
  retoCompletado: boolean;
}

const initialState: ProgressState = {
  aprendidas: [],
  cuestionarios: 0,
  aciertos: 0,
  respuestas: 0,
  rachaActual: 0,
  mejorRacha: 0,
  ultimoDia: null,
  retoDia: null,
  retoCompletado: false,
};

export function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function ayer() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function read(): ProgressState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as Partial<ProgressState>) };
  } catch {
    return initialState;
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(initialState);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const cargado = read();
    // Reinicia el reto si cambió el día
    const base =
      cargado.retoDia === hoy()
        ? cargado
        : { ...cargado, retoDia: hoy(), retoCompletado: false };
    setState(base);
    setListo(true);
  }, []);

  const update = useCallback((fn: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = fn(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* almacenamiento no disponible */
      }
      return next;
    });
  }, []);

  const registrarActividad = useCallback(
    (prev: ProgressState): ProgressState => {
      const d = hoy();
      if (prev.ultimoDia === d) return prev;
      const racha = prev.ultimoDia === ayer() ? prev.rachaActual + 1 : 1;
      return {
        ...prev,
        ultimoDia: d,
        rachaActual: racha,
        mejorRacha: Math.max(racha, prev.mejorRacha),
      };
    },
    [],
  );

  const marcarAprendida = useCallback(
    (id: string) => {
      update((prev) => {
        const aprendidas = prev.aprendidas.includes(id)
          ? prev.aprendidas.filter((x) => x !== id)
          : [...prev.aprendidas, id];
        const base = { ...prev, aprendidas };
        return aprendidas.length > prev.aprendidas.length
          ? registrarActividad(base)
          : base;
      });
    },
    [update, registrarActividad],
  );

  const registrarCuestionario = useCallback(
    (aciertos: number, total: number, esReto: boolean) => {
      update((prev) =>
        registrarActividad({
          ...prev,
          cuestionarios: prev.cuestionarios + 1,
          aciertos: prev.aciertos + aciertos,
          respuestas: prev.respuestas + total,
          retoDia: hoy(),
          retoCompletado: esReto ? true : prev.retoCompletado,
        }),
      );
    },
    [update, registrarActividad],
  );

  const reiniciar = useCallback(() => {
    update(() => initialState);
  }, [update]);

  return {
    ...state,
    listo,
    marcarAprendida,
    registrarCuestionario,
    reiniciar,
  };
}

export function aprendidasPorCategoria(
  aprendidas: string[],
  categoria: CategoryId,
) {
  const ids = new Set(aprendidas);
  return signs.filter((s) => s.categoria === categoria && ids.has(s.id)).length;
}

export function nivelActual(aprendidas: string[]) {
  for (const nivel of levels) {
    if (aprendidasPorCategoria(aprendidas, nivel.categoria) < nivel.meta) {
      return nivel;
    }
  }
  return levels[levels.length - 1];
}

export function precision(aciertos: number, respuestas: number) {
  if (!respuestas) return 0;
  return Math.round((aciertos / respuestas) * 100);
}
