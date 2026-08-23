import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GroupedItem = { name: string; desc?: string; price: string; poradi: number };

type Row = {
  nazev: string;
  popis: string | null;
  cena: number | string | null;
  poradi: number | null;
};

function formatPrice(cena: Row["cena"]): string {
  if (cena === null || cena === undefined) return "";
  const value = typeof cena === "string" ? Number(cena) : cena;
  if (Number.isNaN(value)) return "";
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(".", ",");
  return `${text} Kč`;
}

/**
 * Načte aktivní položky jedné sekce (např. "tydenni" nebo "specialni") a rozdělí je
 * do podskupin podle stovek ve sloupci `poradi` (0–99 = 1. skupina, 100–199 = 2. …).
 */
export function useSectionGroups(sekce: string) {
  const query = useQuery({
    queryKey: ["menu_polozky", "groups", sekce],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("menu_polozky")
        .select("nazev, popis, cena, poradi")
        .eq("aktivni", true)
        .eq("sekce", sekce)
        .order("poradi", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const groups: GroupedItem[][] = [];
  for (const row of query.data ?? []) {
    const poradi = row.poradi ?? 0;
    const groupIndex = Math.floor(poradi / 100);
    groups[groupIndex] ??= [];
    groups[groupIndex]!.push({
      name: row.nazev,
      price: formatPrice(row.cena),
      poradi,
      ...(row.popis ? { desc: row.popis } : {}),
    });
  }

  return {
    groups: groups.filter((g) => g && g.length > 0),
    isLoading: query.isLoading,
    error: query.error,
  };
}
