import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Klíče textových nastavení v tabulce menu_nastaveni. */
export const SETTING_WEEKLY_PERIOD = "tydenni_obdobi";
export const SETTING_SPECIAL_PERIOD = "specialni_obdobi";

/** Načte textové nastavení podle klíče (veřejně čitelné). */
export function useMenuSetting(klic: string) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data } = await supabase
      .from("menu_nastaveni")
      .select("hodnota")
      .eq("klic", klic)
      .maybeSingle();
    setValue(data?.hodnota ?? "");
    setLoading(false);
  }, [klic]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { value, loading, reload, setValue };
}

/** Uloží textové nastavení (povoleno jen personálu podle RLS). */
export async function saveMenuSetting(klic: string, hodnota: string) {
  return supabase.from("menu_nastaveni").upsert({ klic, hodnota }, { onConflict: "klic" });
}
