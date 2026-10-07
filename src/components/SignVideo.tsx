import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SignVideoReference {
  id: string;
  title: string;
  publisher: string;
  scope: string;
}

export function SignVideo({ video }: { video: SignVideoReference }) {
  const [opened, setOpened] = useState(false);
  const url = `https://www.youtube.com/watch?v=${video.id}`;

  return (
    <section className="mt-5 border-t border-border pt-5" aria-label="Video explicativo de LSM">
      <h2 className="text-lg font-semibold text-foreground">Demostración en video</h2>
      <p className="mt-1 text-sm text-muted-foreground">{video.scope}</p>
      <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border border-border bg-secondary">
        {opened ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
            title={video.title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <Play className="size-8 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-foreground">{video.title}</p>
            <Button onClick={() => setOpened(true)} className="min-h-11 whitespace-normal">
              <Play aria-hidden="true" /> Ver demostración
            </Button>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Fuente: {video.publisher} · Lengua de Señas Mexicana</p>
      <Button asChild variant="link" className="mt-1 min-h-11 h-auto px-0 whitespace-normal text-left">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden="true" /> Abrir en YouTube
        </a>
      </Button>
      <p className="mt-1 text-xs text-muted-foreground">Requiere internet. Si no se reproduce aquí, ábrelo en YouTube.</p>
    </section>
  );
}