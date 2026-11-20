import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CameraPractice } from "@/components/CameraPractice";

export const Route = createFileRoute("/camara")({
  validateSearch: (search: Record<string, unknown>): { signo?: string } => {
    const signo = search["signo"];
    return typeof signo === "string" ? { signo } : {};
  },
  head: () => ({
    meta: [
      { title: "Práctica con cámara — Manos Vivas LSM" },
      {
        name: "description",
        content:
          "Graba tus señas, toma fotografías y prueba el reconocimiento experimental de posturas con referencias de Lengua de Señas Mexicana.",
      },
      { property: "og:title", content: "Práctica de LSM con cámara" },
      {
        property: "og:description",
        content:
          "Practica señas frente a la cámara. Tus fotos y videos permanecen en tu dispositivo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CameraPage,
});

function CameraPage() {
  const { signo } = Route.useSearch();
  return (
    <AppShell
      titulo="Práctica con cámara"
      subtitulo="Observa, imita y revisa tu postura"
    >
      <CameraPractice initialSignId={signo} />
    </AppShell>
  );
}
