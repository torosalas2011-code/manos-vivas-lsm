/// <reference types="bun" />
import { describe, expect, it } from "bun:test";
import {
  classifyHandPose,
  expectedPoseForSign,
  type HandLandmark,
  type RecognizedPose,
} from "./hand-recognition";

type FixtureOptions = {
  extended?: number[];
  thumb?: boolean;
  curved?: number[];
  pinch?: boolean;
};

function handFixture({ extended = [], thumb = false, curved = [], pinch = false }: FixtureOptions = {}): HandLandmark[] {
  const points = Array.from({ length: 21 }, () => ({ x: 0, y: 0 }));
  const xs = [-0.3, -0.1, 0.1, 0.3];
  const bases = [5, 9, 13, 17];
  bases.forEach((base, finger) => {
    const x = xs[finger]!;
    points[base] = { x, y: -1 };
    if (extended.includes(finger)) {
      points[base + 1] = { x, y: -1.45 };
      points[base + 2] = { x, y: -1.8 };
      points[base + 3] = { x, y: -2.15 };
    } else if (curved.includes(finger)) {
      points[base + 1] = { x, y: -1.4 };
      points[base + 2] = { x, y: -1.55 };
      points[base + 3] = { x, y: -1.35 };
    } else {
      points[base + 1] = { x, y: -1.25 };
      points[base + 2] = { x, y: -1 };
      points[base + 3] = { x, y: -0.75 };
    }
  });
  points[1] = { x: -0.25, y: -0.35 };
  points[2] = { x: -0.55, y: -0.55 };
  points[3] = thumb ? { x: -0.75, y: -0.7 } : { x: -0.35, y: -0.7 };
  points[4] = thumb ? { x: -1, y: -0.8 } : { x: -0.2, y: -0.85 };
  if (pinch) points[4] = { ...points[8]! };
  return points;
}

const poseCases: Array<[string, HandLandmark[], RecognizedPose]> = [
  ["puño", handFixture(), "fist"],
  ["mano abierta", handFixture({ extended: [0, 1, 2, 3], thumb: true }), "open"],
  ["cuatro dedos", handFixture({ extended: [0, 1, 2, 3] }), "four"],
  ["índice", handFixture({ extended: [0] }), "index"],
  ["postura L", handFixture({ extended: [0], thumb: true }), "l"],
  ["dos dedos", handFixture({ extended: [0, 1] }), "two"],
  ["tres dedos", handFixture({ extended: [0, 1, 2] }), "three"],
  ["postura Y", handFixture({ extended: [3], thumb: true }), "y"],
  ["pinza", handFixture({ extended: [1, 2, 3], pinch: true }), "pinch"],
  ["mano en C", handFixture({ curved: [0, 1, 2, 3], thumb: true }), "c"],
  ["índice curvado", handFixture({ curved: [0] }), "hook"],
];

describe("classifyHandPose", () => {
  it.each(poseCases)("reconoce la postura: %s", (_name, landmarks, expected) => {
    expect(classifyHandPose(landmarks)).toBe(expected);
  });

  it("rechaza datos incompletos o inválidos", () => {
    expect(classifyHandPose([])).toBe("unknown");
    expect(classifyHandPose(handFixture({ extended: [0] }).slice(0, 20))).toBe("unknown");
  });
});

describe("expectedPoseForSign", () => {
  it("compara la postura, no afirma reconocer señas sin cobertura", () => {
    expect(expectedPoseForSign("letra-l")).toBe("l");
    expect(expectedPoseForSign("numero-5")).toBe("open");
    expect(expectedPoseForSign("dolor")).toBe("index");
    expect(expectedPoseForSign("letra-z")).toBeUndefined();
  });
});
