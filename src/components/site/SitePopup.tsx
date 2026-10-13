import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { isPopupVisible, resolvePopupImage, usePopupSettings } from "@/hooks/usePopup";

const SESSION_KEY = "padella-popup-shown";

/** Vyskakovací okno na veřejném webu – zobrazí se jednou za relaci v daném období. */
export function SitePopup() {
  const { settings, loading } = usePopupSettings();
  // Přečteno jen jednou při načtení stránky – pozdější zápis už popup neskryje.
  const [alreadyShown] = useState(() => {
    try {
      return !!sessionStorage.getItem(SESSION_KEY);
    } catch {
      return false;
    }
  });
  const [closed, setClosed] = useState(false);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const navigate = useNavigate();

  const eligible = !loading && !alreadyShown && isPopupVisible(settings);

  // Vyřešit URL obrázku a předem ho načíst.
  useEffect(() => {
    if (!eligible) return undefined;
    let active = true;
    setImageReady(false);
    if (!settings.obrazek) {
      setImageUrl(null);
      setImageReady(true);
      return undefined;
    }
    void resolvePopupImage(settings.obrazek).then((url) => {
      if (!active) return;
      if (!url) {
        console.error("[popup] Nepodařilo se získat odkaz na obrázek:", settings.obrazek);
        setImageUrl(null);
        setImageReady(true);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (!active) return;
        setImageUrl(url);
        setImageReady(true);
      };
      img.onerror = () => {
        if (!active) return;
        console.error("[popup] Obrázek se nepodařilo načíst:", url);
        setImageUrl(null);
        setImageReady(true);
      };
      img.src = url;
    });
    return () => {
      active = false;
    };
  }, [eligible, settings.obrazek]);

  // Otevřít s krátkým zpožděním po načtení dat a obrázku.
  useEffect(() => {
    if (!eligible || !imageReady || closed) return undefined;
    const hasContent = !!imageUrl || !!settings.nadpis.trim() || !!settings.text.trim();
    if (!hasContent) return undefined;
    const t = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 1000);
    return () => window.clearTimeout(t);
  }, [eligible, imageReady, imageUrl, closed, settings.nadpis, settings.text]);

  const visible = open && !closed;

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  if (!visible) return null;

  const isInternal = /^\/(?!\/)/.test(settings.tlacitko_odkaz);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setClosed(true);
    if (isInternal) {
      navigate(settings.tlacitko_odkaz);
    } else {
      window.open(settings.tlacitko_odkaz, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={settings.nadpis || "Informace"}
      onClick={() => setClosed(true)}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-cream p-4 text-center shadow-[var(--shadow-soft)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zavřít"
          onClick={() => setClosed(true)}
          className="absolute right-2 top-2 z-10 rounded-full bg-cream/90 p-2 text-foreground shadow transition-colors hover:bg-muted"
        >
          <X className="size-5" />
        </button>

        {settings.nadpis.trim() && (
          <h2 className="mt-6 font-display text-3xl leading-tight text-foreground sm:text-4xl">
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
            className={`mx-auto block h-auto max-h-[75vh] w-auto max-w-full rounded-sm object-contain ${
              settings.nadpis.trim() || settings.text.trim() ? "mt-6" : "mt-8"
            }`}
          />
        )}
        {settings.tlacitko_text.trim() && settings.tlacitko_odkaz.trim() && (
          <a
            href={settings.tlacitko_odkaz}
            onClick={handleButtonClick}
            rel="noreferrer"
            className="btn-primary mt-6 inline-flex"
          >
            {settings.tlacitko_text}
          </a>
        )}
      </div>
    </div>
  );
}
