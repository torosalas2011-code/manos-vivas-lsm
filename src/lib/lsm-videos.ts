import type { Sign } from "./lsm-data";
import type { SignVideoReference } from "@/components/SignVideo";

// Public LSM tutorials. Titles and publishers checked using YouTube oEmbed.
// Category tutorials are not presented as isolated, sign-specific clips.
const alphabet: SignVideoReference = {
  id: "V4FkOXJ95QI",
  title: "Abecedario en Lengua de Señas Mexicana",
  publisher: "Fersita",
  scope: "Tutorial del abecedario completo; incluye esta letra junto con las demás.",
};

const hola: SignVideoReference = {
  id: "rLL4LJdPRtY",
  title: "10 Señas Básicas (LSM) | Tutorial Rápido",
  publisher: "Ivan Doz",
  scope: "Tutorial de señas básicas que incluye el saludo «Hola».",
};

export function getSignVideo(sign: Sign): SignVideoReference | undefined {
  if (sign.categoria === "abecedario") return alphabet;
  if (sign.id === "hola") return hola;
  return undefined;
}