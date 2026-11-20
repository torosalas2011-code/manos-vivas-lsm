export interface HandLandmark {
  x: number;
  y: number;
  z?: number;
}

export type RecognizedPose =
  | "open"
  | "fist"
  | "index"
  | "two"
  | "three"
  | "four"
  | "pinch"
  | "c"
  | "l"
  | "y"
  | "hook"
  | "unknown";

export const poseLabels: Record<RecognizedPose, string> = {
  open: "mano abierta",
  fist: "puño",
  index: "índice extendido",
  two: "dos dedos extendidos",
  three: "tres dedos extendidos",
  four: "cuatro dedos extendidos",
  pinch: "pinza",
  c: "mano en C",
  l: "postura L",
  y: "postura Y",
  hook: "índice curvado",
  unknown: "postura no identificada",
};

const signPoses: Record<string, Exclude<RecognizedPose, "unknown">> = {
  "letra-a": "fist",
  "letra-b": "four",
  "letra-c": "c",
  "letra-d": "index",
  "letra-e": "fist",
  "letra-f": "pinch",
  "letra-g": "l",
  "letra-k": "two",
  "letra-l": "l",
  "letra-m": "fist",
  "letra-n": "fist",
  "letra-o": "c",
  "letra-s": "fist",
  "letra-t": "fist",
  "letra-u": "two",
  "letra-v": "two",
  "letra-w": "three",
  "letra-x": "hook",
  "letra-y": "y",
  "numero-0": "c",
  "numero-1": "index",
  "numero-2": "two",
  "numero-3": "three",
  "numero-4": "four",
  "numero-5": "open",
  "numero-6": "pinch",
  "numero-7": "pinch",
  "numero-8": "pinch",
  "numero-9": "pinch",
  "numero-10": "fist",
  hola: "open",
  adios: "open",
  gracias: "open",
  "por-favor": "open",
  ayuda: "fist",
  dolor: "index",
  hospital: "two",
  doctor: "three",
  policia: "c",
  llamar: "y",
};

export function expectedPoseForSign(
  signId: string,
): Exclude<RecognizedPose, "unknown"> | undefined {
  return signPoses[signId];
}

function distance(a: HandLandmark, b: HandLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
}

const fingers = [
  { mcp: 5, pip: 6, tip: 8 },
  { mcp: 9, pip: 10, tip: 12 },
  { mcp: 13, pip: 14, tip: 16 },
  { mcp: 17, pip: 18, tip: 20 },
] as const;

export function classifyHandPose(landmarks: HandLandmark[]): RecognizedPose {
  if (landmarks.length < 21 || landmarks.some((point) => !Number.isFinite(point.x) || !Number.isFinite(point.y))) {
    return "unknown";
  }

  const wrist = landmarks[0]!;
  const scale = distance(wrist, landmarks[9]!);
  if (scale < 0.0001) return "unknown";

  const extended = fingers.map(({ mcp, pip, tip }) => {
    const wristToPip = distance(wrist, landmarks[pip]!);
    const wristToTip = distance(wrist, landmarks[tip]!);
    const mcpToPip = distance(landmarks[mcp]!, landmarks[pip]!);
    const mcpToTip = distance(landmarks[mcp]!, landmarks[tip]!);
    return wristToTip > wristToPip * 1.15 && mcpToTip > mcpToPip * 1.1;
  });
  const thumbExtended =
    distance(landmarks[4]!, landmarks[17]!) > distance(landmarks[3]!, landmarks[17]!) * 1.05 &&
    distance(landmarks[4]!, wrist) > distance(landmarks[2]!, wrist) * 1.05;
  const pinchDistance = distance(landmarks[4]!, landmarks[8]!) / scale;
  const [index, middle, ring, pinky] = extended as [boolean, boolean, boolean, boolean];
  const curved = fingers.map(({ pip, tip }, index) => {
    return !extended[index] && distance(wrist, landmarks[tip]!) > distance(wrist, landmarks[pip]!) * 0.8;
  });

  if (pinchDistance < 0.45 && [middle, ring, pinky].filter(Boolean).length >= 2) {
    return "pinch";
  }
  if (index && middle && ring && pinky) return thumbExtended ? "open" : "four";
  if (index && middle && ring) return "three";
  if (index && middle && !ring && !pinky) return "two";
  if (index && !middle && !ring && !pinky) return thumbExtended ? "l" : "index";
  if (!index && !middle && !ring && pinky && thumbExtended) return "y";
  if (!index && !middle && !ring && !pinky) {
    if (curved[0] && !curved.slice(1).some(Boolean)) return "hook";
    if (thumbExtended && curved.every(Boolean)) return "c";
    return "fist";
  }
  return "unknown";
}
