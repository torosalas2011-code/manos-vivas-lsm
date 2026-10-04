import { medicalCategories, medicalSigns, type MedicalCategoryId } from "./lsm-medico";

export type CategoryId =
  | "abecedario"
  | "numeros"
  | "saludos"
  | "familia"
  | "emergencias"
  | MedicalCategoryId;

export interface SignVisual {
  pose:
    | "fist" | "open" | "index" | "two" | "three" | "four"
    | "pinch" | "c" | "l" | "y" | "hook" | "crossed";
  secondPose?: SignVisual["pose"] | undefined;
  orientation: string;
  rotation?: number | undefined;
  secondRotation?: number | undefined;
  motion?: "none" | "up" | "down" | "out" | "circle" | "wave" | "cross" | "tap" | undefined;
  location?: "face" | "chest" | "wrist" | "belly" | undefined;
}

export interface Category {
  id: CategoryId;
  nombre: string;
  descripcion: string;
}

export interface Sign {
  id: string;
  palabra: string;
  glifo: string;
  categoria: CategoryId;
  movimiento: string;
  consejo: string;
  notaClinica?: string | undefined;
  visual?: SignVisual | undefined;
}

export const categories: Category[] = [
  {
    id: "abecedario",
    nombre: "Abecedario",
    descripcion: "Dactilología: deletreo manual letra por letra.",
  },
  {
    id: "numeros",
    nombre: "Números",
    descripcion: "Cantidades del 0 al 10 con una sola mano.",
  },
  {
    id: "saludos",
    nombre: "Saludos",
    descripcion: "Fórmulas de cortesía para iniciar una conversación.",
  },
  {
    id: "familia",
    nombre: "Familia",
    descripcion: "Parentescos y personas cercanas.",
  },
  {
    id: "emergencias",
    nombre: "Emergencias",
    descripcion: "Señas de auxilio y situaciones urgentes.",
  },
  ...medicalCategories,
];

const letras: Array<[string, string, string]> = [
  ["A", "Puño cerrado con el pulgar extendido a un costado.", "No escondas el pulgar dentro del puño."],
  ["B", "Mano abierta, dedos juntos y rectos, pulgar doblado sobre la palma.", "Mantén la palma al frente."],
  ["C", "Mano curvada formando la letra C vista de perfil.", "Deja un hueco visible entre dedos y pulgar."],
  ["D", "Índice extendido hacia arriba; los demás dedos tocan el pulgar.", "El círculo inferior debe quedar redondo."],
  ["E", "Dedos doblados hacia la palma apoyando sobre el pulgar.", "Los nudillos van al frente."],
  ["F", "Índice y pulgar unidos en círculo; los otros tres dedos arriba.", "Separa bien los tres dedos libres."],
  ["G", "Índice y pulgar extendidos y paralelos, mano de costado.", "Apunta hacia el frente, no hacia arriba."],
  ["H", "Índice y medio juntos extendidos de forma horizontal.", "Los dos dedos deben ir pegados."],
  ["I", "Puño cerrado con el meñique extendido hacia arriba.", "Cuida que el pulgar quede cruzado al frente."],
  ["J", "Meñique extendido dibujando una J en el aire.", "El trazo es corto y hacia abajo."],
  ["K", "Índice y medio en V con el pulgar entre ambos.", "El pulgar toca la base del dedo medio."],
  ["L", "Índice arriba y pulgar a un lado formando una L.", "El ángulo debe ser recto."],
  ["M", "Pulgar cubierto por los tres primeros dedos.", "Se ven tres nudillos al frente."],
  ["N", "Pulgar cubierto por índice y medio.", "Se ven dos nudillos al frente."],
  ["Ñ", "Como la N, con un pequeño movimiento ondulado.", "La onda marca la diferencia con la N."],
  ["O", "Todos los dedos curvados tocando el pulgar en círculo.", "El círculo se ve cerrado de frente."],
  ["P", "Como la K, pero apuntando hacia abajo.", "Gira la muñeca, no el codo."],
  ["Q", "Índice y pulgar extendidos apuntando hacia abajo.", "Similar a la G invertida."],
  ["R", "Índice y medio cruzados hacia arriba.", "El cruce debe ser visible."],
  ["S", "Puño cerrado con el pulgar cruzado al frente.", "No dejes el pulgar a un lado."],
  ["T", "Pulgar asomando entre índice y medio.", "Compárala con la N para no confundirlas."],
  ["U", "Índice y medio juntos apuntando hacia arriba.", "Los dedos van pegados, no en V."],
  ["V", "Índice y medio separados apuntando hacia arriba.", "Marca bien la separación."],
  ["W", "Índice, medio y anular extendidos y separados.", "El pulgar sostiene al meñique."],
  ["X", "Índice doblado en gancho, puño cerrado.", "El gancho es firme."],
  ["Y", "Pulgar y meñique extendidos, resto cerrado.", "Mantén la mano quieta."],
  ["Z", "Índice extendido dibujando una Z en el aire.", "El trazo se hace de izquierda a derecha."],
];

const numeros: Array<[string, string, string, string]> = [
  ["0", "Cero", "Mano en círculo cerrado, como la letra O.", "No aprietes los dedos."],
  ["1", "Uno", "Índice extendido hacia arriba.", "El resto de los dedos van cerrados."],
  ["2", "Dos", "Índice y medio extendidos y separados.", "Palma hacia el frente."],
  ["3", "Tres", "Pulgar, índice y medio extendidos.", "No uses el anular."],
  ["4", "Cuatro", "Cuatro dedos extendidos, pulgar doblado.", "Dedos ligeramente separados."],
  ["5", "Cinco", "Mano abierta con los cinco dedos separados.", "Palma al frente y firme."],
  ["6", "Seis", "Meñique tocando el pulgar, tres dedos arriba.", "Parecida a la letra W."],
  ["7", "Siete", "Anular tocando el pulgar.", "Cuida cuál dedo baja."],
  ["8", "Ocho", "Dedo medio tocando el pulgar.", "Los demás dedos permanecen rectos."],
  ["9", "Nueve", "Índice tocando el pulgar en círculo.", "Igual que la letra F."],
  ["10", "Diez", "Puño cerrado con el pulgar arriba, pequeño giro.", "El giro de muñeca es breve."],
];

const otros: Array<[CategoryId, string, string, string, string]> = [
  ["saludos", "Hola", "🖐️", "Mano abierta a la altura de la sien que se separa hacia afuera.", "Acompaña siempre con contacto visual y sonrisa."],
  ["saludos", "Buenos días", "🌅", "Mano plana que se eleva desde el antebrazo opuesto, como un amanecer.", "El brazo de apoyo permanece horizontal."],
  ["saludos", "Buenas noches", "🌙", "Mano plana que desciende sobre el antebrazo opuesto.", "Es el movimiento inverso a buenos días."],
  ["saludos", "Gracias", "🙏", "Dedos de la mano plana tocan el mentón y avanzan al frente.", "El gesto sale hacia la persona."],
  ["saludos", "Por favor", "🤲", "Mano abierta que gira en círculo sobre el pecho.", "Movimiento suave y lento."],
  ["saludos", "Adiós", "👋", "Mano abierta que se agita levemente a la altura del hombro.", "Movimiento corto, no exagerado."],
  ["saludos", "Mucho gusto", "😊", "Manos planas que se deslizan una sobre otra al frente.", "Se usa al conocer a alguien."],
  ["familia", "Mamá", "👩", "Mano abierta con el pulgar tocando la barbilla.", "La barbilla marca lo femenino."],
  ["familia", "Papá", "👨", "Mano abierta con el pulgar tocando la frente.", "La frente marca lo masculino."],
  ["familia", "Hermano", "🧑", "Índices extendidos que se juntan de forma paralela tras señalar la frente.", "Primero el género, luego la unión."],
  ["familia", "Hermana", "👧", "Igual que hermano, pero iniciando en la barbilla.", "Mantén los índices paralelos."],
  ["familia", "Abuela", "👵", "Seña de mamá desplazada hacia adelante en dos tiempos.", "Los saltos indican generación anterior."],
  ["familia", "Abuelo", "👴", "Seña de papá desplazada hacia adelante en dos tiempos.", "Dos impulsos claros y cortos."],
  ["familia", "Hijo", "🧒", "Mano plana que baja desde el pecho indicando estatura.", "La altura sugiere a alguien menor."],
  ["familia", "Familia", "👪", "Ambas manos en F trazando un círculo hacia el frente.", "El círculo representa al grupo."],
  ["emergencias", "Ayuda", "🆘", "Puño con pulgar arriba sobre la palma abierta que lo eleva.", "Movimiento firme y hacia arriba."],
  ["emergencias", "Peligro", "⚠️", "Puño con pulgar que golpea dos veces el dorso de la otra mano.", "Expresión facial de alerta."],
  ["emergencias", "Doctor", "🩺", "Dedos tocando la muñeca opuesta, como tomando el pulso.", "Se ubica sobre la muñeca, no el brazo."],
  ["emergencias", "Hospital", "🏥", "Índice y medio dibujan una cruz sobre el hombro.", "La cruz se traza con dos líneas."],
  ["emergencias", "Policía", "👮", "Mano en C colocada sobre el pecho, como una placa.", "Del hombro hacia el centro del pecho."],
  ["emergencias", "Fuego", "🔥", "Manos abiertas que suben moviendo los dedos.", "Los dedos vibran al subir."],
  ["emergencias", "Dolor", "😖", "Índices que se acercan y alejan frente a la zona afectada.", "Señala la parte del cuerpo que duele."],
  ["emergencias", "Llamar", "📞", "Mano en Y llevada a la oreja con giro corto.", "Pulgar a la oreja, meñique a la boca."],
];

export const signs: Sign[] = [
  ...letras.map(([letra, movimiento, consejo]) => ({
    id: `letra-${letra.toLowerCase()}`,
    palabra: `Letra ${letra}`,
    glifo: letra,
    categoria: "abecedario" as CategoryId,
    movimiento,
    consejo,
  })),
  ...numeros.map(([glifo, nombre, movimiento, consejo]) => ({
    id: `numero-${glifo}`,
    palabra: nombre,
    glifo,
    categoria: "numeros" as CategoryId,
    movimiento,
    consejo,
  })),
  ...otros.map(([categoria, palabra, glifo, movimiento, consejo]) => ({
    id: slug(palabra),
    palabra,
    glifo,
    categoria,
    movimiento,
    consejo,
  })),
  ...medicalSigns.map(
    ([categoria, palabra, glifo, movimiento, consejo, notaClinica, visual]) => ({
      id: slug(palabra),
      palabra,
      glifo,
      categoria,
      movimiento,
      consejo,
      notaClinica,
      visual,
    }),
  ),
];

function slug(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSign(id: string) {
  return signs.find((s) => s.id === id);
}

export function signsByCategory(id: CategoryId) {
  return signs.filter((s) => s.categoria === id);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export function searchSigns(query: string, categoria: CategoryId | "todas") {
  const q = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return signs.filter((s) => {
    if (categoria !== "todas" && s.categoria !== categoria) return false;
    if (!q) return true;
    const base = `${s.palabra} ${s.glifo}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return base.includes(q);
  });
}

export interface Level {
  id: number;
  nombre: string;
  categoria: CategoryId;
  meta: number;
  descripcion: string;
}

export const levels: Level[] = [
  { id: 1, nombre: "Fundamentos: saludos", categoria: "saludos", meta: 7, descripcion: "Preséntate con el paciente de forma cordial." },
  { id: 2, nombre: "Fundamentos: deletreo", categoria: "abecedario", meta: 12, descripcion: "Deletrea nombres y confirma la identidad del paciente." },
  { id: 3, nombre: "Fundamentos: números", categoria: "numeros", meta: 11, descripcion: "Edades, dosis, horarios y escala de dolor." },
  { id: 4, nombre: "Cuerpo humano", categoria: "cuerpo", meta: 8, descripcion: "Ubica síntomas y lesiones en el cuerpo." },
  { id: 5, nombre: "Síntomas", categoria: "sintomas", meta: 9, descripcion: "Comprende lo que el paciente refiere." },
  { id: 6, nombre: "Signos vitales", categoria: "signos-vitales", meta: 7, descripcion: "Explica cada medición antes de realizarla." },
  { id: 7, nombre: "Valoración del dolor", categoria: "dolor", meta: 5, descripcion: "Aplica la escala 0–10 en señas." },
  { id: 8, nombre: "Procedimientos", categoria: "procedimientos", meta: 8, descripcion: "Explica intervenciones y estudios." },
  { id: 9, nombre: "Indicaciones al paciente", categoria: "indicaciones", meta: 8, descripcion: "Da instrucciones claras durante la atención." },
  { id: 10, nombre: "Urgencias", categoria: "emergencias", meta: 8, descripcion: "Comunicación rápida en situaciones críticas." },
  { id: 11, nombre: "Familia y acompañantes", categoria: "familia", meta: 8, descripcion: "Identifica a familiares y responsables." },
];

export interface DailyChallenge {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoryId | "todas";
  preguntas: number;
}

export const dailyChallenges: DailyChallenge[] = [
  { id: "triaje", titulo: "Turno de triaje", descripcion: "Reconoce los síntomas que un paciente sordo refiere al llegar a urgencias.", categoria: "sintomas", preguntas: 7 },
  { id: "dolor", titulo: "Valora el dolor", descripcion: "Identifica cada nivel de la escala de dolor en señas.", categoria: "dolor", preguntas: 5 },
  { id: "vitales", titulo: "Ronda de signos vitales", descripcion: "Practica las señas para explicar presión, pulso, temperatura y saturación.", categoria: "signos-vitales", preguntas: 7 },
  { id: "cuerpo", titulo: "Mapa del cuerpo", descripcion: "Ubica partes del cuerpo para localizar molestias y lesiones.", categoria: "cuerpo", preguntas: 8 },
  { id: "procedimientos", titulo: "Explica el procedimiento", descripcion: "Reconoce las señas de inyección, suero, curación y estudios.", categoria: "procedimientos", preguntas: 8 },
  { id: "indicaciones", titulo: "Indicaciones claras", descripcion: "Instrucciones al paciente: acuéstese, respire hondo, espere y más.", categoria: "indicaciones", preguntas: 8 },
  { id: "urgencias", titulo: "Código de urgencias", descripcion: "Señas de ayuda, peligro, doctor y hospital para actuar rápido.", categoria: "emergencias", preguntas: 7 },
  { id: "mixto", titulo: "Guardia completa", descripcion: "Señas clínicas mezcladas de todas las categorías.", categoria: "todas", preguntas: 8 },
];

export function retoDelDia(fecha: string): DailyChallenge {
  const dias = Math.floor(Date.parse(`${fecha}T00:00:00Z`) / 86400000);
  const indice =
    ((dias % dailyChallenges.length) + dailyChallenges.length) %
    dailyChallenges.length;
  return dailyChallenges[indice]!;
}
