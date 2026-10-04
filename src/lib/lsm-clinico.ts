export interface ProtocolStep {
  titulo: string;
  texto: string;
  senas: string[];
}

export interface Protocol {
  id: string;
  titulo: string;
  resumen: string;
  pasos: ProtocolStep[];
}

export const protocolos: Protocol[] = [
  {
    id: "recepcion-triaje",
    titulo: "Recepción y triaje",
    resumen: "Primer contacto con el paciente sordo y clasificación de la urgencia.",
    pasos: [
      { titulo: "Preséntate", texto: "Colócate de frente, con buena luz. Saluda y deletrea tu nombre en dactilología.", senas: ["hola", "mucho-gusto"] },
      { titulo: "Identifica al paciente", texto: "Pide que deletree su nombre; confírmalo por escrito con su identificación.", senas: ["letra-a", "letra-b"] },
      { titulo: "Motivo de consulta", texto: "Pregunta qué siente y desde cuándo. Ofrece papel si la comunicación se complica.", senas: ["donde-le-duele", "dolor"] },
      { titulo: "Clasifica", texto: "Detecta signos de alarma: falta de aire, dolor de pecho, sangrado. Prioriza según el protocolo de triaje de tu unidad.", senas: ["falta-de-aire", "pecho", "sangrado"] },
    ],
  },
  {
    id: "anamnesis",
    titulo: "Entrevista clínica (anamnesis)",
    resumen: "Preguntas clave en orden para obtener la historia del padecimiento.",
    pasos: [
      { titulo: "¿Qué siente?", texto: "Deja que el paciente se exprese. Usa preguntas abiertas y cejas levantadas para preguntar.", senas: ["fiebre", "mareo", "nausea"] },
      { titulo: "¿Dónde?", texto: "Pide que señale la zona con el dedo.", senas: ["donde-le-duele", "cabeza", "estomago"] },
      { titulo: "¿Desde cuándo?", texto: "Usa números y referencias de tiempo; confirma con calendario si es necesario.", senas: ["numero-1", "numero-2", "numero-3"] },
      { titulo: "Alergias y medicamentos", texto: "Pregunta siempre por alergias y fármacos actuales antes de cualquier tratamiento.", senas: ["alergias", "tome-el-medicamento"] },
    ],
  },
  {
    id: "valoracion-dolor",
    titulo: "Valoración del dolor",
    resumen: "Uso de la escala numérica 0–10 adaptada a señas.",
    pasos: [
      { titulo: "Ubicación", texto: "Primero pregunta dónde duele y que lo señale.", senas: ["donde-le-duele"] },
      { titulo: "Intensidad", texto: "Muestra los números del 0 al 10 con la mano y pide que elija. La expresión facial acompaña la intensidad.", senas: ["sin-dolor", "dolor-leve", "dolor-moderado", "dolor-intenso", "dolor-insoportable"] },
      { titulo: "Registro y reevaluación", texto: "Anota el valor en la hoja de enfermería y reevalúa tras la intervención (30–60 min).", senas: ["numero-5", "espere"] },
    ],
  },
  {
    id: "signos-vitales",
    titulo: "Toma de signos vitales",
    resumen: "Qué explicar antes de cada medición.",
    pasos: [
      { titulo: "Explica antes de tocar", texto: "Muestra el instrumento y haz la seña antes de colocarlo. Nunca toques sin avisar.", senas: ["presion-arterial", "temperatura"] },
      { titulo: "Pulso y respiración", texto: "Toma el pulso; cuenta respiraciones sin anunciarlo para no alterarlas.", senas: ["pulso", "respiracion"] },
      { titulo: "Saturación y glucosa", texto: "Muestra el oxímetro y explica el piquete de la glucometría.", senas: ["oxigeno", "glucosa"] },
      { titulo: "Comunica resultados", texto: "Informa de forma sencilla si los valores son normales o requieren atención.", senas: ["espere", "doctor"] },
    ],
  },
  {
    id: "medicamentos",
    titulo: "Consentimiento y medicamentos",
    resumen: "Los correctos de enfermería y consentimiento informado comprendido.",
    pasos: [
      { titulo: "Los correctos", texto: "Paciente, medicamento, dosis, vía y hora correctos; además registro, educación y verificación de alergias.", senas: ["alergias", "tome-el-medicamento"] },
      { titulo: "Explica el procedimiento", texto: "Indica qué se hará, por qué y qué sentirá. Usa la seña del procedimiento.", senas: ["inyeccion", "suero", "cirugia"] },
      { titulo: "Confirma comprensión", texto: "Pide que te lo explique con sus palabras o señas. Si hay duda, solicita intérprete certificado.", senas: ["por-favor", "espere"] },
      { titulo: "Firma", texto: "Solo cuando la información fue comprendida, solicita la firma del consentimiento.", senas: ["firme-aqui"] },
    ],
  },
  {
    id: "emergencias",
    titulo: "Comunicación en emergencias",
    resumen: "Señas rápidas cuando cada segundo cuenta.",
    pasos: [
      { titulo: "Llama la atención", texto: "Toca suavemente el hombro o mueve la mano en su campo visual.", senas: ["hola"] },
      { titulo: "Pregunta lo esencial", texto: "¿Dónde duele? ¿Puede respirar? ¿Alergias?", senas: ["donde-le-duele", "falta-de-aire", "alergias"] },
      { titulo: "Da indicaciones simples", texto: "Frases cortas, una idea a la vez.", senas: ["acuestese", "respire-hondo", "espere"] },
      { titulo: "Pide apoyo", texto: "Solicita médico e intérprete lo antes posible.", senas: ["ayuda", "doctor", "llamar"] },
    ],
  },
  {
    id: "buenas-practicas",
    titulo: "Buenas prácticas con pacientes sordos",
    resumen: "Atención digna, inclusiva y segura.",
    pasos: [
      { titulo: "Contacto visual", texto: "Mira al paciente, no al acompañante ni al intérprete. Mantén el rostro descubierto cuando sea seguro.", senas: [] },
      { titulo: "Ambiente", texto: "Buena iluminación, sin luz de frente a sus ojos; nunca hables de espaldas.", senas: [] },
      { titulo: "Intérprete y escritura", texto: "Ofrece intérprete de LSM certificado. Usa escritura y dibujos como apoyo, no como sustituto.", senas: ["por-favor"] },
      { titulo: "Derechos del paciente", texto: "La LSM es lengua nacional reconocida en México; el paciente tiene derecho a recibir información en su lengua y a dar consentimiento informado comprendido.", senas: [] },
    ],
  },
];

export function getProtocolo(id: string) {
  return protocolos.find((p) => p.id === id);
}

export interface CaseStep {
  pregunta: string;
  respuesta: string;
  opciones: string[];
}

export interface ClinicalCase {
  id: string;
  titulo: string;
  escenario: string;
  pasos: CaseStep[];
}

export const casosClinicos: ClinicalCase[] = [
  {
    id: "dolor-toracico",
    titulo: "Dolor en el pecho",
    escenario: "Paciente sordo de 45 años llega a urgencias llevándose la mano al pecho.",
    pasos: [
      { pregunta: "¿Qué seña usas para preguntar dónde le duele?", respuesta: "donde-le-duele", opciones: ["donde-le-duele", "espere", "receta", "peso"] },
      { pregunta: "Señala el pecho. ¿Qué seña confirma la zona?", respuesta: "pecho", opciones: ["pecho", "estomago", "pierna", "garganta"] },
      { pregunta: "Refiere que le cuesta respirar. ¿Qué seña es?", respuesta: "falta-de-aire", opciones: ["falta-de-aire", "comezon", "tos", "cansancio"] },
      { pregunta: "Vas a medir la saturación. ¿Qué seña haces antes?", respuesta: "oxigeno", opciones: ["oxigeno", "peso", "vacuna", "cirugia"] },
      { pregunta: "Le pides que se recueste en la camilla.", respuesta: "acuestese", opciones: ["acuestese", "firme-aqui", "no-coma", "adios"] },
    ],
  },
  {
    id: "fiebre-pediatrica",
    titulo: "Fiebre en consulta",
    escenario: "Mamá sorda acude con su hijo, quien tiene la frente caliente desde ayer.",
    pasos: [
      { pregunta: "La mamá toca la frente del niño. ¿Qué síntoma indica?", respuesta: "fiebre", opciones: ["fiebre", "mareo", "sangrado", "dolor-intenso"] },
      { pregunta: "Vas a medir la temperatura.", respuesta: "temperatura", opciones: ["temperatura", "presion-arterial", "glucosa", "radiografia"] },
      { pregunta: "Antes de indicar un antipirético preguntas…", respuesta: "alergias", opciones: ["alergias", "acuestese", "espere", "hola"] },
      { pregunta: "Explicas cómo dar el medicamento en casa.", respuesta: "tome-el-medicamento", opciones: ["tome-el-medicamento", "cirugia", "no-coma", "curacion"] },
    ],
  },
  {
    id: "toma-muestra",
    titulo: "Toma de muestra de sangre",
    escenario: "Paciente sordo citado para laboratorio en ayuno.",
    pasos: [
      { pregunta: "Confirmas que no ha comido. ¿Qué indicación se relaciona?", respuesta: "no-coma", opciones: ["no-coma", "respire-hondo", "espere", "vomito"] },
      { pregunta: "Explicas el estudio que harás.", respuesta: "analisis-de-sangre", opciones: ["analisis-de-sangre", "radiografia", "vacuna", "receta"] },
      { pregunta: "Le indicas el sitio de punción en el…", respuesta: "brazo", opciones: ["brazo", "cabeza", "espalda", "pierna"] },
      { pregunta: "Tras la punción le pides que aguarde unos minutos.", respuesta: "espere", opciones: ["espere", "llamar", "adios", "familia"] },
    ],
  },
  {
    id: "valoracion-dolor",
    titulo: "Dolor postoperatorio",
    escenario: "Paciente sordo operado ayer; valoras el dolor en tu ronda.",
    pasos: [
      { pregunta: "Muestra 8 dedos y gesto de mucho dolor. ¿Cómo lo clasificas?", respuesta: "dolor-intenso", opciones: ["dolor-intenso", "dolor-leve", "sin-dolor", "dolor-moderado"] },
      { pregunta: "Antes de aplicar analgésico IV revisas la vía de…", respuesta: "suero", opciones: ["suero", "vacuna", "receta", "peso"] },
      { pregunta: "Vas a curar la herida quirúrgica.", respuesta: "curacion", opciones: ["curacion", "cirugia", "radiografia", "glucosa"] },
      { pregunta: "Una hora después refiere 2 de 10.", respuesta: "dolor-leve", opciones: ["dolor-leve", "dolor-insoportable", "dolor-intenso", "fiebre"] },
    ],
  },
];

export function getCaso(id: string) {
  return casosClinicos.find((c) => c.id === id);
}
