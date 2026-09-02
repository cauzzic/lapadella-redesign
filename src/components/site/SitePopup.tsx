import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { isPopupVisible, resolvePopupImage, usePopupSettings } from "@/hooks/usePopup";

/** Vyskakovací okno na veřejném webu – zobrazí se při každé nové návštěvě v daném období. */
export function SitePopup() {
  const { settings, loading } = usePopupSettings();
  const [closed, setClosed] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const visible = !loading && !closed && isPopupVisible(settings);

  useEffect(() => {
    let active = true;
    void resolvePopupImage(settings.obrazek).then((url) => {
      if (active) setImageUrl(url);
    });
    return () => {
      active = false;
    };
  }, [settings.obrazek]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={settings.nadpis || "Informace"}
      onClick={() => setClosed(true)}
    >
      <div
        className="relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-xl bg-cream p-6 text-center shadow-[var(--shadow-soft)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zavřít"
          onClick={() => setClosed(true)}
          className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        {settings.nadpis.trim() && (
          <h2 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {settings.nadpis}
          </h2>
        )}
        {settings.text.trim() && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {settings.text}
          </p>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={settings.nadpis || "Aktuální informace"}
            loading="lazy"
            className="mt-6 max-h-[45vh] w-full rounded-sm object-cover"
          />
        )}
        {settings.tlacitko_text.trim() && settings.tlacitko_odkaz.trim() && (
          <a
            href={settings.tlacitko_odkaz}
            target={/^https?:/.test(settings.tlacitko_odkaz) ? "_blank" : undefined}
            rel="noreferrer"
            className="btn-primary mt-7 inline-flex"
            onClick={() => setClosed(true)}
          >
            {settings.tlacitko_text}
          </a>
        )}
      </div>
    </div>
  );
}
