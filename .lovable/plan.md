# Manos Vivas LSM — enfoque para enfermería y personal de salud

Adaptar toda la app para estudiantes de enfermería y personal médico: vocabulario clínico, situaciones reales de atención a pacientes sordos y práctica con casos clínicos.

## 1. Nuevas categorías del diccionario (vocabulario clínico)
- **Cuerpo humano**: cabeza, pecho, estómago, brazo, pierna, espalda, garganta, corazón, etc.
- **Síntomas**: fiebre, mareo, náusea, vómito, tos, sangrado, falta de aire, comezón, cansancio.
- **Signos vitales**: presión arterial, pulso, temperatura, respiración, oxígeno, glucosa, peso.
- **Procedimientos**: inyección, suero, vacuna, curación, análisis de sangre, radiografía, cirugía, receta.
- **Indicaciones al paciente**: acuéstese, respire hondo, no coma, tome el medicamento, espere, firme aquí.
- **Escala de dolor**: sin dolor, leve, moderado, intenso, insoportable (0 al 10).
- Se conservan las categorías actuales (abecedario, números, saludos, familia, emergencias) como base.
- Cada seña nueva lleva su ilustración de mano, movimiento, consejo y una **nota clínica** (cuándo usarla en la atención).

## 2. Nueva sección "Guía clínica" (protocolos de atención)
Accesible desde Inicio y Misiones. Fichas paso a paso:
- **Recepción y triaje** del paciente sordo: presentarse, identificar al paciente, motivo de consulta.
- **Entrevista (anamnesis)**: preguntas clave en orden — ¿qué siente?, ¿dónde?, ¿desde cuándo?, ¿alergias?, ¿medicamentos?
- **Valoración del dolor** con la escala 0–10 en señas.
- **Toma de signos vitales**: qué decir antes de cada procedimiento.
- **Consentimiento informado y administración de medicamentos** (los "correctos" de enfermería).
- **Emergencias**: código de comunicación rápida.
- **Buenas prácticas** con pacientes sordos: contacto visual, iluminación, no hablar de espaldas, uso de intérprete, escritura de apoyo, derechos del paciente (NOM / ley de inclusión, mencionado en términos generales).

## 3. Misiones y retos con enfoque médico
- Niveles reorganizados en ruta clínica: Fundamentos (abecedario/números/saludos) -> Cuerpo humano -> Síntomas -> Signos vitales -> Procedimientos -> Indicaciones -> Urgencias.
- Retos diarios clínicos ("Turno de triaje", "Valora el dolor", "Ronda de signos vitales", etc.).

## 4. Práctica con casos clínicos
- Nuevo modo **"Caso clínico"**: una situación breve (ej. "Paciente de 45 años llega con dolor en el pecho") y preguntas encadenadas donde se elige la seña correcta para cada paso de la atención.
- Se mantiene el cuestionario de señas actual.

## 5. Progreso
- Avance por las nuevas categorías y logros clínicos (ej. "Triaje completo", "Experto en signos vitales").

## 6. Textos y presentación
- Inicio y descripciones orientados a estudiantes de enfermería y personal de salud.
- Aviso: la app es material de apoyo educativo y no sustituye a un intérprete certificado de LSM.

## Detalles técnicos
- Ampliar el catálogo de datos con las nuevas categorías, campo `notaClinica`, niveles y retos.
- Nuevo archivo de datos para protocolos y casos clínicos; rutas nuevas `/guia` y `/guia/$protocoloId`.
- Nuevas posturas/ubicaciones en las ilustraciones vectoriales (ubicación en pecho, estómago, brazo, etc.); sin imágenes generadas por IA.
- La navegación inferior se mantiene en 5 secciones; la Guía se abre desde tarjetas en Inicio y Misiones.
- Nota: las descripciones de señas son aproximaciones educativas; conviene validarlas con un intérprete o la comunidad sorda antes de una exposición formal.
