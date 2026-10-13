import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pragueToday } from "@/lib/pragueDate";

export const POPUP_BUCKET = "popup";

export type PopupSettings = {
  aktivni: boolean;
  datum_od: string | null;
  datum_do: string | null;
  nadpis: string;
  text: string;
  obrazek: string | null;
  tlacitko_text: string;
  tlacitko_odkaz: string;
};

export const emptyPopup: PopupSettings = {
  aktivni: false,
  datum_od: null,
  datum_do: null,
  nadpis: "",
  text: "",
  obrazek: null,
  tlacitko_text: "",
  tlacitko_odkaz: "",
};

/** Vrátí zobrazitelnou URL obrázku – buď přímý odkaz, nebo podepsaný odkaz z úložiště. */
export async function resolvePopupImage(obrazek: string | null): Promise<string | null> {
  if (!obrazek) return null;
  if (/^(https?:|data:|\/)/.test(obrazek)) return obrazek;
  const { data } = await supabase.storage.from(POPUP_BUCKET).createSignedUrl(obrazek, 60 * 60 * 24);
  return data?.signedUrl ?? null;
}

/** Je popup aktivní a spadá dnešní datum do nastaveného období? */
export function isPopupVisible(p: PopupSettings, now = new Date()) {
  if (!p.aktivni) return false;
  if (!p.nadpis.trim() && !p.text.trim() && !p.obrazek) return false;
  const today = pragueToday(now);
  if (p.datum_od && today < p.datum_od) return false;
  if (p.datum_do && today > p.datum_do) return false;
  return true;
}

/** Načte jediné nastavení popupu z databáze. */
export function usePopupSettings() {
  const [settings, setSettings] = useState<PopupSettings>(emptyPopup);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("popup_nastaveni")
      .select("aktivni, datum_od, datum_do, nadpis, text, obrazek, tlacitko_text, tlacitko_odkaz")
      .eq("id", 1)
      .maybeSingle();
    if (error) console.error("[popup] Načtení nastavení selhalo:", error);
    if (data)
      setSettings({
        ...emptyPopup,
        ...data,
        nadpis: data.nadpis ?? "",
        text: data.text ?? "",
        tlacitko_text: data.tlacitko_text ?? "",
        tlacitko_odkaz: data.tlacitko_odkaz ?? "",
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { settings, setSettings, loading, reload };
}

/** Uloží nastavení popupu (povoleno jen personálu podle pravidel databáze). */
export async function savePopupSettings(values: PopupSettings) {
  return supabase.from("popup_nastaveni").upsert({ id: 1, ...values }, { onConflict: "id" });
}
