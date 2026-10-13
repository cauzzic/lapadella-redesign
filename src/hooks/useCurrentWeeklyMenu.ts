import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { pickCurrentMenu, pragueToday } from "@/lib/pragueDate";

export type PublicWeeklyMenu = {
  id: string;
  nazev: string;
  plati_od: string | null;
  plati_do: string | null;
  poznamka: string;
  zverejneno: boolean;
};

export type WeeklyRow = {
  nazev: string;
  popis: string | null;
  cena: number | string | null;
  poradi: number | null;
  podskupina: string | null;
  alergeny: number[] | null;
};

/**
 * Aktuálně platné týdenní menu (zveřejněné, dnešek v Praze v intervalu OD–DO).
 * Kompatibilita: dokud existují aktivní jídla bez přiřazeného menu a žádné menu
 * neplatí, zobrazí se tato starší jídla (mode = "legacy").
 */
export function useCurrentWeeklyMenu() {
  return useQuery({
    queryKey: ["tydenni_menu", "current", pragueToday()],
    queryFn: async () => {
      const { data: menus, error } = await supabase
        .from("tydenni_menu")
        .select("id, nazev, plati_od, plati_do, poznamka, zverejneno")
        .eq("zverejneno", true);
      if (error) throw error;
      const menu = pickCurrentMenu((menus ?? []) as PublicWeeklyMenu[], pragueToday());

      let q = supabase
        .from("menu_polozky")
        .select("nazev, popis, cena, poradi, podskupina, alergeny")
        .eq("aktivni", true)
        .eq("sekce", "tydenni")
        .order("poradi", { ascending: true });
      q = menu ? q.eq("menu_id", menu.id) : q.is("menu_id", null);
      const { data: rows, error: rowsError } = await q;
      if (rowsError) throw rowsError;

      const list = (rows ?? []) as WeeklyRow[];
      const mode: "menu" | "legacy" | "none" = menu ? "menu" : list.length > 0 ? "legacy" : "none";
      return { menu, rows: list, mode };
    },
    staleTime: 60 * 1000,
  });
}
