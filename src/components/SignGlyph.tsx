import { cn } from "@/lib/utils";
import type { Sign } from "@/lib/lsm-data";

export function SignGlyph({
  sign,
  size = "md",
}: {
  sign: Sign;
  size?: "sm" | "md" | "lg";
}) {
  const esTexto = sign.categoria === "abecedario" || sign.categoria === "numeros";
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-secondary font-display text-secondary-foreground",
        size === "sm" && "size-12 text-xl",
        size === "md" && "size-16 text-2xl",
        size === "lg" && "size-32 text-6xl",
        !esTexto && (size === "lg" ? "text-7xl" : "text-3xl"),
      )}
    >
      <span className="font-bold">{sign.glifo}</span>
    </div>
  );
}
