import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Circle,
  Download,
  LoaderCircle,
  RefreshCw,
  ScanEye,
  Square,
  SwitchCamera,
  Video,
} from "lucide-react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";
import { HandSignIllustration } from "@/components/HandSignIllustration";
import { Button } from "@/components/ui/button";
import { categories, getSign, signs } from "@/lib/lsm-data";
import {
  classifyHandPose,
  expectedPoseForSign,
  poseLabels,
  type RecognizedPose,
} from "@/lib/hand-recognition";

type CameraStatus = "idle" | "requesting" | "ready" | "error";
type FacingMode = "user" | "environment";
type Capture = {
  kind: "photo" | "video";
  url: string;
  mimeType: string;
};
type RecognitionStatus = "idle" | "loading" | "running" | "error";
type Detection = {
  handVisible: boolean;
  pose: RecognizedPose;
  compatible: boolean | null;
};

const VISION_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm";
const HAND_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

function cameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "El navegador no tiene permiso para usar la cámara. Autorízala en los ajustes del sitio y vuelve a intentarlo.";
    }
    if (error.name === "NotFoundError") {
      return "No se encontró una cámara disponible en este dispositivo.";
    }
    if (error.name === "NotReadableError") {
      return "No se pudo abrir la cámara. Cierra otras aplicaciones que la estén usando y vuelve a intentarlo.";
    }
    if (error.name === "OverconstrainedError") {
      return "Esta cámara no está disponible. Prueba con la otra cámara del dispositivo.";
    }
  }
  return "No se pudo iniciar la cámara. Revisa el permiso del navegador y vuelve a intentarlo.";
}

function preferredVideoType(): string {
  const types = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function CameraPractice({ initialSignId }: { initialSignId: string | undefined }) {
  const [signId, setSignId] = useState(
    () => getSign(initialSignId ?? "")?.id ?? "hola",
  );
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [facing, setFacing] = useState<FacingMode>("user");
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [capture, setCapture] = useState<Capture | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<RecognitionStatus>("idle");
  const [recognitionError, setRecognitionError] = useState("");
  const [detection, setDetection] = useState<Detection | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const captureUrlRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const recognitionFrameRef = useRef<number | null>(null);
  const recognitionActiveRef = useRef(false);
  const lastDetectionRef = useRef(0);
  const signIdRef = useRef(signId);
  const sign = getSign(signId) ?? signs[0]!;
  const expectedPose = expectedPoseForSign(sign.id);

  useEffect(() => {
    signIdRef.current = sign.id;
  }, [sign.id]);

  function replaceCapture(next: Capture | null) {
    if (captureUrlRef.current) URL.revokeObjectURL(captureUrlRef.current);
    captureUrlRef.current = next?.url ?? null;
    setCapture(next);
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      recognitionActiveRef.current = false;
      if (recognitionFrameRef.current !== null) {
        cancelAnimationFrame(recognitionFrameRef.current);
      }
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (captureUrlRef.current) URL.revokeObjectURL(captureUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!recording) return;
    const startedAt = Date.now();
    setElapsed(0);
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  function stopRecognition() {
    recognitionActiveRef.current = false;
    if (recognitionFrameRef.current !== null) {
      cancelAnimationFrame(recognitionFrameRef.current);
      recognitionFrameRef.current = null;
    }
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    setDetection(null);
    setRecognitionError("");
    setRecognitionStatus("idle");
  }

  async function startRecognition() {
    if (status !== "ready" || recording || recognitionStatus === "loading") return;
    recognitionActiveRef.current = true;
    lastDetectionRef.current = 0;
    setDetection(null);
    setRecognitionError("");
    setRecognitionStatus("loading");

    try {
      const { FilesetResolver, HandLandmarker: Landmarker } = await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks(VISION_WASM_URL);
      let landmarker: HandLandmarker;
      try {
        landmarker = await Landmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: HAND_MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch {
        landmarker = await Landmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: HAND_MODEL_URL, delegate: "CPU" },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      }

      if (!mountedRef.current || !recognitionActiveRef.current) {
        landmarker.close();
        return;
      }
      landmarkerRef.current = landmarker;
      setRecognitionStatus("running");

      const analyze = (timestamp: number) => {
        if (!mountedRef.current || !recognitionActiveRef.current) return;
        const video = videoRef.current;
        if (video && video.readyState >= 2 && timestamp - lastDetectionRef.current >= 350) {
          lastDetectionRef.current = timestamp;
          try {
            const result = landmarker.detectForVideo(video, timestamp);
            const landmarks = result.landmarks[0];
            const pose = landmarks ? classifyHandPose(landmarks) : "unknown";
            const expected = expectedPoseForSign(signIdRef.current);
            setDetection({
              handVisible: Boolean(landmarks),
              pose,
              compatible: expected ? pose === expected : null,
            });
          } catch {
            recognitionActiveRef.current = false;
            landmarker.close();
            landmarkerRef.current = null;
            setRecognitionStatus("error");
            setRecognitionError("El análisis se interrumpió. Puedes volver a intentarlo sin perder tu grabación.");
            return;
          }
        }
        recognitionFrameRef.current = requestAnimationFrame(analyze);
      };
      recognitionFrameRef.current = requestAnimationFrame(analyze);
    } catch {
      if (!mountedRef.current || !recognitionActiveRef.current) return;
      recognitionActiveRef.current = false;
      setRecognitionStatus("error");
      setRecognitionError("No se pudo cargar el reconocimiento. Revisa tu conexión; las fotos y grabaciones siguen disponibles.");
    }
  }

  async function activateCamera(nextFacing: FacingMode = facing) {
    stopRecognition();
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setError(
        "Este navegador no permite usar la cámara. Ábrela desde un navegador actualizado y una conexión segura (HTTPS).",
      );
      return;
    }

    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    replaceCapture(null);
    setStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: nextFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (!mountedRef.current || !videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      stream.getVideoTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          if (mountedRef.current && streamRef.current === stream) {
            streamRef.current = null;
            setRecording(false);
            stopRecognition();
            setStatus("idle");
          }
        });
      });
      await videoRef.current.play();
      setStatus("ready");
    } catch (cameraError) {
      if (!mountedRef.current) return;
      setStatus("error");
      setError(cameraErrorMessage(cameraError));
    }
  }

  function stopCamera() {
    stopRecognition();
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setRecording(false);
    setStatus("idle");
  }

  async function switchCamera() {
    if (recording || status === "requesting") return;
    const nextFacing = facing === "user" ? "environment" : "user";
    setFacing(nextFacing);
    await activateCamera(nextFacing);
  }

  function startRecording() {
    const stream = streamRef.current;
    setError("");
    if (!stream || status !== "ready") return;
    stopRecognition();
    if (typeof MediaRecorder === "undefined") {
      setError("Este navegador no permite grabar video. Puedes tomar fotografías.");
      return;
    }

    try {
      replaceCapture(null);
      chunksRef.current = [];
      const mimeType = preferredVideoType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        if (!mountedRef.current) return;
        setRecording(false);
        setError("La grabación se interrumpió. Vuelve a intentarlo.");
      };
      recorder.onstop = () => {
        if (!mountedRef.current) return;
        setRecording(false);
        const type = recorder.mimeType || mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type });
        chunksRef.current = [];
        if (blob.size === 0) {
          setError("No se obtuvo video. Intenta grabar durante algunos segundos.");
          return;
        }
        replaceCapture({ kind: "video", url: URL.createObjectURL(blob), mimeType: type });
      };
      recorder.start(500);
      setRecording(true);
    } catch {
      setRecording(false);
      setError("No se pudo comenzar la grabación en este navegador.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    setError("");
    if (!video || status !== "ready" || recording) return;
    if (!video.videoWidth || !video.videoHeight) {
      setError("La cámara aún se está preparando. Intenta tomar la foto de nuevo.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("No se pudo capturar la fotografía en este navegador.");
      return;
    }
    if (facing === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!mountedRef.current) return;
        if (!blob) {
          setError("No se pudo crear la fotografía. Vuelve a intentarlo.");
          return;
        }
        replaceCapture({
          kind: "photo",
          url: URL.createObjectURL(blob),
          mimeType: blob.type || "image/jpeg",
        });
      },
      "image/jpeg",
      0.92,
    );
  }

  const extension = capture?.kind === "photo"
    ? "jpg"
    : capture?.mimeType.includes("mp4")
      ? "mp4"
      : "webm";

  return (
    <div>
      <section className="rounded-2xl border border-border bg-card p-4">
        <label htmlFor="sign-to-practice" className="text-sm font-semibold text-foreground">
          Seña que quieres practicar
        </label>
        <select
          id="sign-to-practice"
          value={sign.id}
          onChange={(event) => setSignId(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground"
        >
          {categories.map((category) => (
            <optgroup key={category.id} label={category.nombre}>
              {signs
                .filter((item) => item.categoria === category.id)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.palabra}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <div className="mt-4 flex items-start gap-4 rounded-xl bg-secondary p-3">
          <HandSignIllustration sign={sign} size="sm" />
          <div className="min-w-0 pt-1">
            <h2 className="font-semibold text-secondary-foreground">{sign.palabra}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {sign.movimiento}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[4/3] w-full bg-secondary">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="Vista previa de tu cámara"
            className={`h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""} ${status === "ready" ? "block" : "hidden"}`}
          />
          {status !== "ready" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              {status === "requesting" ? (
                <LoaderCircle className="size-10 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <CameraOff className="size-10 text-muted-foreground" aria-hidden="true" />
              )}
              <p className="mt-3 text-sm text-muted-foreground">
                {status === "requesting"
                  ? "Esperando permiso y preparando la cámara…"
                  : "Activa la cámara cuando estés listo para practicar."}
              </p>
            </div>
          ) : null}
          {recording ? (
            <div
              role="status"
              className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-sm font-semibold text-destructive-foreground"
            >
              <span className="size-2 animate-pulse rounded-full bg-current" aria-hidden="true" />
              REC {formatTime(elapsed)}
            </div>
          ) : null}
        </div>

        <div className="p-4">
          {error ? (
            <p role="alert" className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm leading-relaxed text-destructive">
              {error}
            </p>
          ) : null}

          {status === "idle" || status === "error" ? (
            <Button type="button" onClick={() => void activateCamera()} className="min-h-12 w-full">
              <Camera aria-hidden="true" />
              {status === "error" ? "Intentar de nuevo" : "Activar cámara"}
            </Button>
          ) : null}
          {status === "requesting" ? (
            <Button type="button" disabled className="min-h-12 w-full">
              <LoaderCircle className="animate-spin" aria-hidden="true" />
              Preparando cámara
            </Button>
          ) : null}
          {status === "ready" ? (
            <>
              {recording ? (
                <Button type="button" variant="destructive" onClick={stopRecording} className="min-h-12 w-full">
                  <Square aria-hidden="true" />
                  Detener grabación
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" onClick={startRecording} className="min-h-12">
                    <Circle aria-hidden="true" />
                    Grabar
                  </Button>
                  <Button type="button" variant="secondary" onClick={takePhoto} className="min-h-12">
                    <Camera aria-hidden="true" />
                    Tomar foto
                  </Button>
                </div>
              )}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void switchCamera()}
                  disabled={recording}
                  className="min-h-12"
                >
                  <SwitchCamera aria-hidden="true" />
                  Cambiar
                </Button>
                <Button type="button" variant="outline" onClick={stopCamera} className="min-h-12">
                  <CameraOff aria-hidden="true" />
                  Apagar
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <ScanEye className="mt-1 size-6 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-foreground">Reconocimiento experimental</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Compara la postura visible con la referencia. No interpreta movimientos, expresiones ni gramática de LSM.
            </p>
          </div>
        </div>

        <p className="mt-3 rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
          {expectedPose
            ? `Referencia disponible: ${poseLabels[expectedPose]}. El resultado solo indica si la postura parece compatible.`
            : "Esta seña todavía no tiene comparación automática. Puedes usar la cámara y la referencia visual."}
        </p>

        {recognitionError ? (
          <p role="alert" className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {recognitionError}
          </p>
        ) : null}

        {recognitionStatus === "running" ? (
          <Button type="button" variant="outline" onClick={stopRecognition} className="mt-3 min-h-12 w-full">
            <Square aria-hidden="true" />
            Detener análisis
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => void startRecognition()}
            disabled={status !== "ready" || recording || recognitionStatus === "loading"}
            className="mt-3 min-h-12 w-full"
          >
            {recognitionStatus === "loading" ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <ScanEye aria-hidden="true" />
            )}
            {recognitionStatus === "loading"
              ? "Cargando reconocimiento…"
              : recognitionStatus === "error"
                ? "Reintentar reconocimiento"
                : "Analizar mi postura"}
          </Button>
        )}

        {recognitionStatus === "running" ? (
          <div role="status" aria-live="polite" className="mt-3 rounded-xl border border-border p-3 text-sm">
            {!detection || !detection.handVisible ? (
              <p className="text-muted-foreground">Coloca una mano frente a la cámara, con buena luz y todos los dedos visibles.</p>
            ) : detection.compatible === true ? (
              <p className="font-semibold text-primary">Postura compatible con la referencia.</p>
            ) : detection.compatible === false ? (
              <p className="text-foreground">
                Veo una postura de <strong>{poseLabels[detection.pose]}</strong>. Ajusta tu mano y mantenla frente a la cámara.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Postura visible: {poseLabels[detection.pose]}. Esta seña no tiene comparación automática.
              </p>
            )}
          </div>
        ) : null}
      </section>

      {capture ? (
        <section className="mt-4 rounded-2xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            {capture.kind === "photo" ? <Camera aria-hidden="true" /> : <Video aria-hidden="true" />}
            {capture.kind === "photo" ? "Tu fotografía" : "Tu grabación"}
          </h2>
          {capture.kind === "photo" ? (
            <img
              src={capture.url}
              alt={`Fotografía de tu práctica de la seña ${sign.palabra}`}
              className="mt-3 w-full rounded-xl border border-border"
            />
          ) : (
            <video
              src={capture.url}
              controls
              playsInline
              aria-label={`Grabación de tu práctica de la seña ${sign.palabra}`}
              className="mt-3 w-full rounded-xl border border-border bg-secondary"
            />
          )}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={() => replaceCapture(null)} className="min-h-12">
              <RefreshCw aria-hidden="true" />
              Repetir
            </Button>
            <Button asChild className="min-h-12">
              <a href={capture.url} download={`practica-${sign.id}.${extension}`}>
                <Download aria-hidden="true" />
                Descargar
              </a>
            </Button>
          </div>
        </section>
      ) : null}

      <p className="mt-5 rounded-xl bg-secondary p-4 text-xs leading-relaxed text-secondary-foreground">
        Tu foto, tu video y el análisis de tu mano se procesan únicamente en este dispositivo; no se envían imágenes a internet. El reconocimiento necesita conexión para cargar su modelo la primera vez. Las capturas se descartan al repetir o salir, salvo que las descargues. El resultado es orientativo y no sustituye la enseñanza de un intérprete certificado de LSM.
      </p>
    </div>
  );
}
