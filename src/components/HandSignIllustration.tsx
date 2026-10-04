import { cn } from "@/lib/utils";
import type { Sign } from "@/lib/lsm-data";

type HandPose =
  | "fist"
  | "open"
  | "index"
  | "two"
  | "three"
  | "four"
  | "pinch"
  | "c"
  | "l"
  | "y"
  | "hook"
  | "crossed";

type Motion = "none" | "up" | "down" | "out" | "circle" | "wave" | "cross" | "tap";

interface VisualConfig {
  pose: HandPose;
  secondPose?: HandPose;
  orientation: string;
  rotation?: number;
  secondRotation?: number;
  motion?: Motion;
  location?: "face" | "chest" | "wrist" | "belly" | undefined;
}

const alphabetPoses: Record<string, Partial<VisualConfig>> = {
  "letra-a": { pose: "fist" },
  "letra-b": { pose: "four" },
  "letra-c": { pose: "c", orientation: "De perfil" },
  "letra-d": { pose: "index" },
  "letra-e": { pose: "fist", orientation: "Nudillos al frente" },
  "letra-f": { pose: "pinch" },
  "letra-g": { pose: "l", rotation: 90, orientation: "De costado" },
  "letra-h": { pose: "two", rotation: 90, orientation: "De costado" },
  "letra-i": { pose: "y" },
  "letra-j": { pose: "y", motion: "down" },
  "letra-k": { pose: "two" },
  "letra-l": { pose: "l" },
  "letra-m": { pose: "fist", orientation: "Tres dedos sobre el pulgar" },
  "letra-n": { pose: "fist", orientation: "Dos dedos sobre el pulgar" },
  "letra-ñ": { pose: "fist", motion: "wave", orientation: "Palma al frente" },
  "letra-o": { pose: "c", orientation: "Dedos unidos" },
  "letra-p": { pose: "two", rotation: 180, orientation: "Hacia abajo" },
  "letra-q": { pose: "l", rotation: 180, orientation: "Hacia abajo" },
  "letra-r": { pose: "crossed" },
  "letra-s": { pose: "fist" },
  "letra-t": { pose: "fist", orientation: "Pulgar entre los dedos" },
  "letra-u": { pose: "two", orientation: "Dedos juntos" },
  "letra-v": { pose: "two", orientation: "Dedos separados" },
  "letra-w": { pose: "three" },
  "letra-x": { pose: "hook" },
  "letra-y": { pose: "y" },
  "letra-z": { pose: "index", motion: "wave" },
};

const numberPoses: Record<string, HandPose> = {
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
};

const conceptConfigs: Record<string, VisualConfig> = {
  hola: { pose: "open", orientation: "Palma hacia afuera", rotation: 12, motion: "out", location: "face" },
  "buenos-dias": { pose: "open", secondPose: "open", orientation: "Palma sobre antebrazo", motion: "up" },
  "buenas-noches": { pose: "open", secondPose: "open", orientation: "Palma sobre antebrazo", motion: "down" },
  gracias: { pose: "open", orientation: "Dedos desde el mentón", motion: "out", location: "face" },
  "por-favor": { pose: "open", orientation: "Palma sobre el pecho", motion: "circle", location: "chest" },
  adios: { pose: "open", orientation: "Palma hacia afuera", motion: "wave" },
  "mucho-gusto": { pose: "open", secondPose: "open", orientation: "Palmas encontradas", motion: "cross" },
  mama: { pose: "open", orientation: "Pulgar en la barbilla", location: "face" },
  papa: { pose: "open", orientation: "Pulgar en la frente", location: "face" },
  hermano: { pose: "index", secondPose: "index", orientation: "Índices paralelos", motion: "cross", location: "face" },
  hermana: { pose: "index", secondPose: "index", orientation: "Índices paralelos", motion: "cross", location: "face" },
  abuela: { pose: "open", orientation: "Pulgar desde la barbilla", motion: "out", location: "face" },
  abuelo: { pose: "open", orientation: "Pulgar desde la frente", motion: "out", location: "face" },
  hijo: { pose: "open", orientation: "Palma hacia abajo", rotation: 90, motion: "down", location: "chest" },
  familia: { pose: "pinch", secondPose: "pinch", orientation: "Ambas palmas al frente", motion: "circle" },
  ayuda: { pose: "fist", secondPose: "open", orientation: "Puño sobre palma", motion: "up" },
  peligro: { pose: "fist", secondPose: "open", orientation: "Pulgar sobre el dorso", motion: "tap" },
  doctor: { pose: "three", secondPose: "open", orientation: "Dedos sobre la muñeca", motion: "tap", location: "wrist" },
  hospital: { pose: "two", orientation: "Dedos hacia el hombro", motion: "cross", location: "chest" },
  policia: { pose: "c", orientation: "Mano en C sobre el pecho", location: "chest" },
  fuego: { pose: "open", secondPose: "open", orientation: "Palmas hacia arriba", motion: "up" },
  dolor: { pose: "index", secondPose: "index", orientation: "Puntas enfrentadas", motion: "tap" },
  llamar: { pose: "y", orientation: "Pulgar hacia la oreja", rotation: -15, motion: "tap", location: "face" },
};

function getVisualConfig(sign: Sign): VisualConfig {
  if (alphabetPoses[sign.id]) {
    return {
      pose: "open",
      orientation: "Palma al frente",
      motion: "none",
      ...alphabetPoses[sign.id],
    };
  }
  const numberPose = numberPoses[sign.id];
  if (numberPose) {
    return {
      pose: numberPose,
      orientation: "Palma al frente",
      motion: sign.id === "numero-10" ? "wave" : "none",
    };
  }
  return conceptConfigs[sign.id] ?? (sign.visual as VisualConfig | undefined) ?? {
    pose: "open",
    orientation: "Palma al frente",
    motion: "none",
  };
}

const poseFingers: Record<HandPose, number[]> = {
  fist: [],
  open: [0, 1, 2, 3],
  index: [1],
  two: [1, 2],
  three: [1, 2, 3],
  four: [0, 1, 2, 3],
  pinch: [2, 3],
  c: [0, 1, 2, 3],
  l: [1],
  y: [0],
  hook: [1],
  crossed: [1, 2],
};

function Hand({
  pose,
  x,
  rotation = 0,
  mirrored = false,
}: {
  pose: HandPose;
  x: number;
  rotation?: number;
  mirrored?: boolean;
}) {
  const extended = poseFingers[pose];
  const isFist = pose === "fist";
  const isC = pose === "c";
  const spread = pose === "two" || pose === "three" || pose === "open" || pose === "four";
  return (
    <g transform={`translate(${x} 18) rotate(${rotation} 50 62) ${mirrored ? "translate(100 0) scale(-1 1)" : ""}`}>
      <rect x="28" y="58" width="46" height="45" rx="18" className="fill-accent/70 stroke-primary" strokeWidth="3" />
      <rect x="39" y="96" width="25" height="29" rx="10" className="fill-accent/70 stroke-primary" strokeWidth="3" />
      {[0, 1, 2, 3].map((finger) => {
        const active = extended.includes(finger);
        const xPos = 29 + finger * 11;
        const heights = [30, 44, 48, 39];
        const fingerHeight = active ? (heights[finger] ?? 30) : 15;
        const gap = spread ? (finger - 1.5) * 1.5 : 0;
        return (
          <rect
            key={finger}
            x={xPos + gap}
            y={60 - fingerHeight}
            width="10"
            height={fingerHeight + 12}
            rx="5"
            className={active ? "fill-accent stroke-primary" : "fill-secondary stroke-primary/70"}
            strokeWidth="2.5"
            transform={pose === "crossed" && finger === 2 ? "rotate(-15 55 50)" : undefined}
          />
        );
      })}
      <rect
        x={pose === "l" || pose === "y" ? "5" : isC ? "13" : "15"}
        y={pose === "l" || pose === "y" ? "61" : "66"}
        width={pose === "l" || pose === "y" ? "35" : "30"}
        height="12"
        rx="6"
        className="fill-accent stroke-primary"
        strokeWidth="2.5"
        transform="rotate(-24 40 70)"
      />
      {isFist ? <path d="M32 67 Q50 58 70 68" fill="none" className="stroke-primary" strokeWidth="3" /> : null}
      {pose === "pinch" ? <circle cx="35" cy="52" r="7" className="fill-card stroke-primary" strokeWidth="2.5" /> : null}
      {pose === "c" ? <path d="M28 42 Q8 62 29 84" fill="none" className="stroke-primary" strokeWidth="4" strokeLinecap="round" /> : null}
      {pose === "hook" ? <path d="M42 25 Q58 28 51 43" fill="none" className="stroke-primary" strokeWidth="5" strokeLinecap="round" /> : null}
    </g>
  );
}

function MotionCue({ motion }: { motion: Motion }) {
  if (motion === "none") return null;
  const paths: Record<Exclude<Motion, "none">, string> = {
    up: "M164 108 L164 45 M154 57 L164 45 L174 57",
    down: "M164 45 L164 108 M154 96 L164 108 L174 96",
    out: "M146 78 L190 78 M178 68 L190 78 L178 88",
    circle: "M151 64 C178 40 197 82 171 99 C149 112 135 88 145 72 M145 72 L143 56 M145 72 L160 68",
    wave: "M145 99 C166 86 143 68 164 56 C178 48 184 43 188 34 M177 38 L188 34 L187 47",
    cross: "M144 53 L188 99 M176 97 L188 99 L186 87 M188 53 L144 99 M146 87 L144 99 L156 97",
    tap: "M152 56 L177 81 M167 80 L177 81 L176 70",
  };
  return <path d={paths[motion]} fill="none" className="stroke-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />;
}

function LocationCue({ location }: { location?: VisualConfig["location"] }) {
  if (!location) return null;
  if (location === "face") {
    return <path d="M27 24 Q8 46 26 75 Q42 82 53 69 M19 46 H27" fill="none" className="stroke-muted-foreground/45" strokeWidth="3" strokeLinecap="round" />;
  }
  if (location === "chest") {
    return <path d="M9 112 Q28 86 47 112 M28 89 V131" fill="none" className="stroke-muted-foreground/45" strokeWidth="3" strokeLinecap="round" />;
  }
  if (location === "belly") {
    return <path d="M8 118 Q28 100 48 118 M14 132 Q28 140 42 132" fill="none" className="stroke-muted-foreground/45" strokeWidth="3" strokeLinecap="round" />;
  }
  return <path d="M9 100 Q29 87 47 102" fill="none" className="stroke-muted-foreground/45" strokeWidth="5" strokeLinecap="round" />;
}

export function HandSignIllustration({
  sign,
  size = "md",
  showLabel = false,
}: {
  sign: Sign;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const config = getVisualConfig(sign);
  const twoHands = Boolean(config.secondPose);
  const description = `Referencia visual para ${sign.palabra}: ${config.orientation.toLowerCase()}. ${sign.movimiento}`;

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-secondary",
        size === "sm" && "w-24 shrink-0",
        size === "md" && "w-36",
        size === "lg" && "w-full",
      )}
    >
      <svg
        viewBox="0 0 210 155"
        role="img"
        aria-label={description}
        className={cn("w-full", size === "sm" ? "h-[72px]" : size === "md" ? "h-28" : "h-52")}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>{description}</title>
        <LocationCue location={config.location} />
        <Hand pose={config.pose} x={twoHands ? 25 : 52} rotation={config.rotation ?? 0} />
        {config.secondPose ? (
          <Hand pose={config.secondPose} x={82} rotation={config.secondRotation ?? -8} mirrored />
        ) : null}
        <MotionCue motion={config.motion ?? "none"} />
        <text x="12" y="143" className="fill-primary text-[18px] font-bold">
          {sign.glifo}
        </text>
      </svg>
      {showLabel ? (
        <figcaption className="border-t border-border bg-card px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
          {config.orientation}
        </figcaption>
      ) : null}
    </figure>
  );
}