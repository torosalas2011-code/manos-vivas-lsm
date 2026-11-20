# Práctica de señas con cámara

Añadir una pantalla para practicar frente a la cámara, comparar con una seña del diccionario y revisar el resultado sin enviar imágenes ni videos a internet.

## Funciones

- Pedir permiso de cámara solo al pulsar «Activar cámara» y explicar los estados de permiso denegado, cámara no disponible o error.
- Vista en espejo, cambio entre cámara frontal y trasera cuando el dispositivo lo permita y botón para apagar la cámara.
- Selector de seña con su ilustración y descripción del movimiento como referencia.
- Grabación de video con temporizador, reproducción, repetir y descarga.
- Captura de fotografía, vista previa, repetir y descarga.
- Accesos desde Práctica y desde la ficha de cada seña; al venir del diccionario, esa seña queda seleccionada.
- Aviso claro de privacidad: el material permanece en el dispositivo y se descarta al salir o repetir; no hay reconocimiento automático de señas.

## Detalles técnicos

- Nueva ruta `/camara` y componente de cámara usando `getUserMedia`, `MediaRecorder` y `canvas`, APIs disponibles en el navegador.
- Detener todas las pistas al cambiar de cámara o salir; liberar las URLs temporales de fotos y videos.
- No requiere Lovable Cloud ni almacenamiento permanente.
- Títulos y descripciones propios para la nueva página, con diseño móvil y botones accesibles.
- Verificar con una cámara simulada en el navegador: permiso, vista previa, captura, grabación, descarga y cambio de cámara; revisar también el estado de permiso denegado.
