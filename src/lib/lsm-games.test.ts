/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { answerScore, gameSigns, isPair, memoryDeck, sprintQuestions } from "./lsm-games";

describe("Juegos de señas", () => {
  test("cada tema ofrece seis parejas completas sin señas ausentes", () => {
    for (const theme of ["clinica", "base"] as const) {
      expect(gameSigns(theme).length).toBe(12);
      const deck = memoryDeck(theme);
      expect(deck.length).toBe(12);
      for (const tile of deck) {
        expect(deck.filter((other) => isPair(tile, other)).length).toBe(1);
        expect(isPair(tile, tile)).toBe(false);
      }
    }
  });
  test("las diez preguntas tienen cuatro opciones y una respuesta correcta", () => {
    for (const theme of ["clinica", "base"] as const) {
      const questions = sprintQuestions(theme);
      expect(questions.length).toBe(10);
      for (const question of questions) {
        expect(new Set(question.options.map((s) => s.id)).size).toBe(4);
        expect(question.options.filter((s) => s.id === question.sign.id).length).toBe(1);
      }
    }
  });
  test("un error rompe el combo sin quitar puntos", () => {
    expect(answerScore(false, 3)).toEqual({ streak: 0, points: 0 });
    expect(answerScore(true, 0)).toEqual({ streak: 1, points: 100 });
    expect(answerScore(true, 1)).toEqual({ streak: 2, points: 125 });
    expect(answerScore(true, 8)).toEqual({ streak: 9, points: 200 });
  });
});