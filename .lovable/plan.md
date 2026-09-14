# Manos Vivas LSM — app móvil de aprendizaje

App instalable en el celular para aprender Lengua de Señas Mexicana, con diccionario visual, retos diarios, cuestionarios y seguimiento de progreso. Todo en español.

## Pantallas

1. **Inicio**
   - Saludo, racha actual (días seguidos), nivel y barra de progreso.
   - Reto del día destacado con botón para empezar.
   - Accesos rápidos a diccionario y práctica.

2. **Diccionario**
   - Buscador por palabra.
   - Categorías: Abecedario, Números, Saludos, Familia, Emergencias.
   - Lista de señas con imagen e ilustración.
   - Ficha detallada: seña grande, descripción del movimiento, consejo de uso y categoría.

3. **Misiones y retos**
   - Niveles progresivos: cada nivel agrupa misiones (aprender 5 señas, aprobar un cuestionario, etc.).
   - Los niveles se desbloquean al completar el anterior.
   - Reto diario que renueva cada día y alimenta la racha.

4. **Práctica (cuestionarios)**
   - Preguntas de opción múltiple: ver la seña y elegir el significado, o al revés.
   - Retroalimentación inmediata (correcto/incorrecto) y pantalla de resultados con puntaje.

5. **Progreso**
   - Racha actual y mejor racha, señas aprendidas, cuestionarios completados, precisión.
   - Avance por categoría y logros obtenidos.

## Diseño

- Estilo limpio y serio, no infantil: fondo claro, un color principal sobrio (azul profundo) y un acento cálido para logros.
- Tipografía grande y legible, alto contraste, botones amplios para dedo (mínimo 44px).
- Navegación inferior fija con 5 secciones, pensada para pantalla móvil.

## Contenido

Incluyo un catálogo inicial de señas con ilustraciones generadas: abecedario completo, números 0–10, y varias señas de saludos, familia y emergencias, cada una con descripción del movimiento.

## Detalles técnicos

- App instalable (manifiesto + iconos), sin modo sin conexión por ahora.
- El progreso, la racha y las misiones se guardan en el propio dispositivo (sin cuenta ni registro). Si más adelante quieres que el avance se sincronice entre dispositivos, se agrega una base de datos con inicio de sesión.
- Rutas separadas por sección con títulos y descripciones propias.
