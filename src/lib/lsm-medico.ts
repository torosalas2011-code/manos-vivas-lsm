import type { SignVisual } from "./lsm-data";

export type MedicalCategoryId =
  | "cuerpo"
  | "sintomas"
  | "signos-vitales"
  | "dolor"
  | "procedimientos"
  | "indicaciones";

type Pose = SignVisual["pose"];
type Motion = NonNullable<SignVisual["motion"]>;
type Loc = SignVisual["location"];

function v(
  pose: Pose,
  orientation: string,
  motion: Motion = "none",
  location?: Loc,
  secondPose?: Pose,
): SignVisual {
  return { pose, orientation, motion, location, secondPose };
}

export type MedicalEntry = [
  MedicalCategoryId,
  string, // palabra
  string, // emoji
  string, // movimiento
  string, // consejo
  string, // nota clínica
  SignVisual,
];

export const medicalCategories: Array<{
  id: MedicalCategoryId;
  nombre: string;
  descripcion: string;
}> = [
  { id: "cuerpo", nombre: "Cuerpo humano", descripcion: "Partes del cuerpo para ubicar síntomas y lesiones." },
  { id: "sintomas", nombre: "Síntomas", descripcion: "Lo que el paciente siente o refiere en la consulta." },
  { id: "signos-vitales", nombre: "Signos vitales", descripcion: "Mediciones básicas de la valoración de enfermería." },
  { id: "dolor", nombre: "Escala de dolor", descripcion: "Valoración de la intensidad del dolor del 0 al 10." },
  { id: "procedimientos", nombre: "Procedimientos", descripcion: "Intervenciones y estudios que se explican al paciente." },
  { id: "indicaciones", nombre: "Indicaciones", descripcion: "Instrucciones claras durante la atención." },
];

export const medicalSigns: MedicalEntry[] = [
  // Cuerpo humano
  ["cuerpo", "Cabeza", "🧠", "Mano plana toca dos veces un costado de la cabeza.", "Toca la cabeza propia, no la del paciente.", "Úsala para ubicar cefalea, golpes o mareo.", v("open", "Palma hacia la cabeza", "tap", "face")],
  ["cuerpo", "Pecho", "🫁", "Mano plana se desliza de arriba abajo sobre el pecho.", "Movimiento corto y centrado.", "Clave ante dolor torácico: pregunta si irradia.", v("open", "Palma sobre el pecho", "down", "chest")],
  ["cuerpo", "Corazón", "❤️", "Dedo medio toca dos veces el lado izquierdo del pecho.", "Ubícalo a la izquierda del esternón.", "Relaciónala con palpitaciones o dolor precordial.", v("index", "Dedo sobre el corazón", "tap", "chest")],
  ["cuerpo", "Estómago", "🫃", "Mano plana hace un pequeño círculo sobre el abdomen.", "El círculo marca la zona abdominal.", "Pide que señale el cuadrante exacto del dolor.", v("open", "Palma sobre el abdomen", "circle", "belly")],
  ["cuerpo", "Garganta", "🗣️", "Índice y pulgar abiertos recorren el cuello hacia abajo.", "Roza el cuello sin presionar.", "Útil para odinofagia o dificultad para tragar.", v("l", "Dedos en el cuello", "down", "face")],
  ["cuerpo", "Espalda", "🧍", "Mano por encima del hombro toca la espalda.", "Gira ligeramente el torso.", "Diferencia lumbalgia de dolor dorsal.", v("open", "Palma hacia la espalda", "tap", "chest")],
  ["cuerpo", "Brazo", "💪", "Mano en C recorre el antebrazo contrario hacia el codo.", "Recorre, no golpees.", "Ubica sitios de punción o lesiones.", v("c", "Mano sobre el antebrazo", "up", "wrist", "open")],
  ["cuerpo", "Pierna", "🦵", "Mano plana toca el muslo del mismo lado.", "Señala la pierna afectada.", "Pregunta por edema o dolor en pantorrilla.", v("open", "Palma hacia el muslo", "tap", "belly")],

  // Síntomas
  ["sintomas", "Fiebre", "🌡️", "Dorso de la mano toca la frente y se separa.", "Expresión de malestar.", "Confirma con termómetro; registra hora de inicio.", v("open", "Dorso en la frente", "out", "face")],
  ["sintomas", "Mareo", "😵", "Índice gira en círculos junto a la sien.", "Círculos pequeños y lentos.", "Valora riesgo de caída antes de movilizar.", v("index", "Índice junto a la sien", "circle", "face")],
  ["sintomas", "Náusea", "🤢", "Mano en garra sube desde el estómago hacia la garganta.", "Acompaña con gesto facial.", "Ten listo un recipiente; evalúa hidratación.", v("four", "Dedos en garra", "up", "belly")],
  ["sintomas", "Vómito", "🤮", "Mano abierta sale de la boca hacia el frente y abajo.", "Movimiento rápido.", "Pregunta frecuencia y si hay sangre.", v("open", "Desde la boca", "out", "face")],
  ["sintomas", "Tos", "😷", "Puño golpea suavemente el pecho dos veces.", "Puede acompañarse de gesto de toser.", "Distingue tos seca de productiva.", v("fist", "Puño sobre el pecho", "tap", "chest")],
  ["sintomas", "Sangrado", "🩸", "Dedos de una mano caen como gotas desde el dorso de la otra.", "Los dedos se mueven al bajar.", "Prioridad: ubica el sitio y aplica presión.", v("four", "Dedos hacia abajo", "down", "wrist", "open")],
  ["sintomas", "Falta de aire", "😮‍💨", "Manos sobre el pecho suben y bajan rápido.", "Ritmo acelerado, como jadeo.", "Mide saturación de oxígeno de inmediato.", v("open", "Palmas en el pecho", "wave", "chest", "open")],
  ["sintomas", "Comezón", "🤚", "Dedos en garra rascan el dorso de la otra mano.", "Rascado breve.", "Pregunta por alergias y medicamentos recientes.", v("hook", "Dedos sobre el dorso", "wave", "wrist", "open")],
  ["sintomas", "Cansancio", "😩", "Manos en los hombros caen hacia abajo.", "Hombros relajados al final.", "Indaga horas de sueño y debilidad.", v("open", "Palmas en el pecho", "down", "chest", "open")],

  // Signos vitales
  ["signos-vitales", "Presión arterial", "🩺", "Mano en C aprieta el brazo opuesto dos veces, como el brazalete.", "Ubícala en el brazo, arriba del codo.", "Explica que sentirá presión en el brazo unos segundos.", v("c", "Mano rodeando el brazo", "tap", "wrist", "open")],
  ["signos-vitales", "Pulso", "💓", "Índice y medio sobre la muñeca opuesta.", "Mantén los dedos quietos.", "Avisa antes de tocar la muñeca del paciente.", v("two", "Dedos sobre la muñeca", "tap", "wrist", "open")],
  ["signos-vitales", "Temperatura", "🌡️", "Índice sube y baja frente a la palma, como un termómetro.", "Movimiento vertical corto.", "Indica dónde colocarás el termómetro.", v("index", "Índice vertical", "up", undefined, "open")],
  ["signos-vitales", "Respiración", "🌬️", "Manos en el pecho se separan y regresan lentamente.", "Ritmo pausado.", "Cuenta respiraciones sin avisar para no alterarlas.", v("open", "Palmas en el pecho", "out", "chest", "open")],
  ["signos-vitales", "Oxígeno", "🫧", "Mano en O sube desde la nariz hacia arriba.", "La O representa el oxígeno.", "Muestra el oxímetro antes de colocarlo en el dedo.", v("pinch", "Mano en O", "up", "face")],
  ["signos-vitales", "Glucosa", "🍬", "Índice toca la yema del dedo opuesto, como un piquete.", "Toque breve en la yema.", "Explica el piquete y pregunta por ayuno.", v("index", "Índice a la yema", "tap", undefined, "index")],
  ["signos-vitales", "Peso", "⚖️", "Índice y medio de ambas manos se cruzan y balancean.", "El balanceo imita la báscula.", "Necesario para calcular dosis.", v("two", "Dedos cruzados", "wave", undefined, "two")],

  // Escala de dolor
  ["dolor", "Sin dolor", "0️⃣", "Mano en O (cero) y luego negación con la cabeza.", "Expresión facial neutra.", "Equivale a 0 en la escala numérica.", v("pinch", "Mano en O", "none")],
  ["dolor", "Dolor leve", "🙂", "Índices se acercan suavemente; luego números 1 a 3.", "Movimiento suave, rostro tranquilo.", "Escala 1–3: registra y reevalúa.", v("index", "Índices al centro", "cross", undefined, "index")],
  ["dolor", "Dolor moderado", "😐", "Índices se acercan con más fuerza; números 4 a 6.", "Ceño ligeramente fruncido.", "Escala 4–6: considera analgesia indicada.", v("index", "Índices al centro", "tap", undefined, "index")],
  ["dolor", "Dolor intenso", "😣", "Índices chocan con fuerza repetidamente; números 7 a 9.", "Expresión de dolor marcada.", "Escala 7–9: avisa al médico.", v("index", "Índices al centro", "wave", undefined, "index")],
  ["dolor", "Dolor insoportable", "😫", "Manos en garra tiemblan frente al cuerpo; número 10.", "La expresión facial es esencial.", "Escala 10: atención prioritaria.", v("hook", "Garras temblorosas", "wave", undefined, "hook")],

  // Procedimientos
  ["procedimientos", "Inyección", "💉", "Índice y medio se acercan al brazo y el pulgar presiona, como jeringa.", "Ubícala en el sitio de aplicación.", "Explica sitio, sensación y duración antes de aplicar.", v("three", "Mano en jeringa", "tap", "wrist", "open")],
  ["procedimientos", "Suero", "💧", "Mano en pinza baja desde arriba hasta el dorso de la otra mano.", "Imita el goteo de la venoclisis.", "Indica no mover el brazo con la vía.", v("pinch", "Goteo hacia la mano", "down", "wrist", "open")],
  ["procedimientos", "Vacuna", "🩹", "Índice raspa dos veces la parte alta del brazo.", "Movimiento corto en el deltoides.", "Registra lote y pregunta por reacciones previas.", v("index", "Índice en el brazo", "tap", "chest")],
  ["procedimientos", "Curación", "🩹", "Mano plana cubre el dorso de la otra y la limpia en círculo.", "Movimiento delicado.", "Explica que limpiarás la herida y puede arder.", v("open", "Palma sobre el dorso", "circle", "wrist", "fist")],
  ["procedimientos", "Análisis de sangre", "🧪", "Seña de sangrado seguida de mano en C como tubo.", "Une las dos ideas en orden.", "Indica ayuno si es necesario.", v("c", "Mano como tubo", "up", "wrist", "open")],
  ["procedimientos", "Radiografía", "🩻", "Manos abiertas frente al pecho se separan como una placa.", "Las manos marcan el rectángulo.", "Pregunta por embarazo antes del estudio.", v("l", "Manos formando placa", "out", "chest", "l")],
  ["procedimientos", "Cirugía", "🔪", "Pulgar recorre la palma opuesta en línea recta, como un corte.", "Una sola línea firme.", "Requiere consentimiento informado comprendido.", v("fist", "Pulgar sobre la palma", "cross", undefined, "open")],
  ["procedimientos", "Receta", "📝", "Mano en pinza escribe sobre la palma opuesta.", "Simula escribir.", "Apóyate en la receta escrita y verifica comprensión.", v("pinch", "Escribir en la palma", "wave", undefined, "open")],

  // Indicaciones
  ["indicaciones", "Acuéstese", "🛏️", "Índice y medio se acuestan sobre la palma opuesta.", "Los dedos representan a la persona.", "Ayuda a la movilización si hay mareo.", v("two", "Dedos sobre la palma", "down", undefined, "open")],
  ["indicaciones", "Respire hondo", "😤", "Manos suben desde el abdomen al pecho lentamente.", "Inhala tú también como modelo.", "Úsala durante la auscultación.", v("open", "Palmas subiendo", "up", "chest", "open")],
  ["indicaciones", "No coma", "🚫", "Seña de comer (pinza a la boca) seguida de negación con el índice.", "La negación va al final.", "Indica ayuno y hasta qué hora.", v("index", "Índice que niega", "wave", "face")],
  ["indicaciones", "Tome el medicamento", "💊", "Pinza lleva una pastilla a la boca, seguida de seña de agua.", "Señala la hora con el reloj.", "Verifica los correctos antes de administrar.", v("pinch", "Pinza hacia la boca", "up", "face")],
  ["indicaciones", "Espere", "✋", "Manos abiertas con dedos que se mueven, palmas arriba.", "Expresión amable.", "Indica cuánto tiempo y dónde esperar.", v("open", "Palmas arriba", "wave", undefined, "open")],
  ["indicaciones", "Firme aquí", "✍️", "Pinza firma sobre la palma y el índice señala el papel.", "Señala el lugar exacto.", "Solo después de explicar y confirmar comprensión.", v("pinch", "Firmar sobre la palma", "cross", undefined, "open")],
  ["indicaciones", "¿Alergias?", "🤧", "Índice toca la nariz y se aleja, con cejas levantadas.", "Las cejas arriba marcan pregunta.", "Pregunta obligatoria antes de cualquier medicamento.", v("index", "Índice desde la nariz", "out", "face")],
  ["indicaciones", "¿Dónde le duele?", "📍", "Seña de dolor y luego mano abierta que interroga.", "Mantén las cejas arriba.", "Pide que señale con el dedo la zona.", v("open", "Palma interrogante", "circle", undefined, "index")],
];
