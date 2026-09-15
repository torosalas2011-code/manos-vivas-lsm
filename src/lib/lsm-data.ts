export type CategoryId =
  | "abecedario"
  | "numeros"
  | "saludos"
  | "familia"
  | "emergencias";

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
    id: palabra
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]+/g, "-"),
    palabra,
    glifo,
    categoria,
    movimiento,
    consejo,
  })),
];

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
  { id: 1, nombre: "Primeros saludos", categoria: "saludos", meta: 7, descripcion: "Aprende las fórmulas de cortesía básicas." },
  { id: 2, nombre: "Deletreo manual", categoria: "abecedario", meta: 12, descripcion: "Domina las primeras letras del abecedario." },
  { id: 3, nombre: "Contar con las manos", categoria: "numeros", meta: 11, descripcion: "Del 0 al 10 sin dudar." },
  { id: 4, nombre: "Mi familia", categoria: "familia", meta: 8, descripcion: "Presenta a las personas cercanas." },
  { id: 5, nombre: "Situaciones urgentes", categoria: "emergencias", meta: 8, descripcion: "Señas que pueden salvar una situación." },
];

export interface DailyChallenge {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoryId | "todas";
  preguntas: number;
}

export const dailyChallenges: DailyChallenge[] = [
  {
    id: "saludos",
    titulo: "Saluda en señas",
    descripcion:
      "Reconoce las señas de cortesía: hola, gracias, por favor y despedidas.",
    categoria: "saludos",
    preguntas: 7,
  },
  {
    id: "abecedario",
    titulo: "Deletreo manual",
    descripcion:
      "Identifica letras del abecedario en dactilología para deletrear nombres.",
    categoria: "abecedario",
    preguntas: 8,
  },
  {
    id: "numeros",
    titulo: "Cuenta con las manos",
    descripcion: "Reconoce los números del 0 al 10 hechos con una sola mano.",
    categoria: "numeros",
    preguntas: 8,
  },
  {
    id: "familia",
    titulo: "Presenta a tu familia",
    descripcion:
      "Distingue las señas de mamá, papá, hermanos y demás parentescos.",
    categoria: "familia",
    preguntas: 7,
  },
  {
    id: "emergencias",
    titulo: "Señas que auxilian",
    descripcion:
      "Practica las señas de ayuda, peligro, doctor y hospital por si las necesitas.",
    categoria: "emergencias",
    preguntas: 7,
  },
  {
    id: "mixto",
    titulo: "Repaso de manos vivas",
    descripcion:
      "Señas mezcladas de todas las categorías para probar tu memoria visual.",
    categoria: "todas",
    preguntas: 8,
  },
  {
    id: "abecedario-2",
    titulo: "Letras difíciles",
    descripcion:
      "Vuelve al abecedario y afina las letras que más se confunden entre sí.",
    categoria: "abecedario",
    preguntas: 8,
  },
];

export function retoDelDia(fecha: string): DailyChallenge {
  const dias = Math.floor(Date.parse(`${fecha}T00:00:00Z`) / 86400000);
  const indice =
    ((dias % dailyChallenges.length) + dailyChallenges.length) %
    dailyChallenges.length;
  return dailyChallenges[indice]!;
}
