import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GroupedItem = {
  name: string;
  desc?: string;
  price: string;
  poradi: number;
  allergens?: number[];
};

export type NamedGroup = { id: string; title: string; items: GroupedItem[] };

type Row = {
  nazev: string;
  popis: string | null;
  cena: number | string | null;
  poradi: number | null;
  podskupina: string | null;
  alergeny: number[] | null;
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

function toItem(row: Row): GroupedItem {
  return {
    name: row.nazev,
    price: formatPrice(row.cena),
    poradi: row.poradi ?? 0,
    ...(row.popis ? { desc: row.popis } : {}),
    ...(row.alergeny && row.alergeny.length > 0 ? { allergens: row.alergeny.map(Number) } : {}),
  };
}

function useRows(sekce: string) {
  return useQuery({
    queryKey: ["menu_polozky", "groups", sekce],
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("menu_polozky")
        .select("nazev, popis, cena, poradi, podskupina, alergeny")
        .eq("aktivni", true)
        .eq("sekce", sekce)
        .order("poradi", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Načte aktivní položky jedné sekce (např. "tydenni" nebo "specialni") a rozdělí je
 * do podskupin podle sloupce `podskupina`; pro položky bez podskupiny se použije
 * dřívější konvence podle stovek ve sloupci `poradi`.
 */
export function useSectionGroups(sekce: string) {
  const query = useRows(sekce);

  const groups: GroupedItem[][] = [];
  for (const row of query.data ?? []) {
    const groupIndex = Math.floor((row.poradi ?? 0) / 100);
    groups[groupIndex] ??= [];
    groups[groupIndex]!.push(toItem(row));
  }

  return {
    groups: groups.filter((g) => g && g.length > 0),
    isLoading: query.isLoading,
    error: query.error,
  };
}

/** Rozdělí položky sekce do pojmenovaných podskupin v zadaném pořadí. */
export function useNamedGroups(sekce: string, defs: { id: string; title: string }[]) {
  const query = useRows(sekce);
  const rows = query.data ?? [];

  const named: NamedGroup[] = defs
    .map((def, i) => ({
      id: def.id,
      title: def.title,
      items: rows
        .filter((r) =>
          r.podskupina ? r.podskupina === def.id : Math.floor((r.poradi ?? 0) / 100) === i,
        )
        .sort((a, b) => (a.poradi ?? 0) - (b.poradi ?? 0))
        .map(toItem),
    }))
    .filter((g) => g.items.length > 0);

  return { groups: named, isLoading: query.isLoading, error: query.error };
}

export type WeeklyDayGroup = {
  id: string;
  day: string;
  soup?: GroupedItem;
  soups: GroupedItem[];
  mains: GroupedItem[];
};

/**
 * Týdenní menu rozdělené na dny a v rámci dne na Polévku / Hlavní jídla.
 * Podporuje nový zápis `podskupina = "po:polevka" | "po:hlavni"` i starší
 * zápis `podskupina = "po"` (první položka dne = polévka).
 */
export function useWeeklyDayGroups(days: { id: string; title: string }[]) {
  const query = useRows("tydenni");
  const rows = query.data ?? [];

  const groups: WeeklyDayGroup[] = days
    .map((def, i) => {
      const dayRows = rows
        .filter((r) => {
          if (r.podskupina) return r.podskupina.split(":")[0] === def.id;
          return Math.floor((r.poradi ?? 0) / 100) === i;
        })
        .sort((a, b) => (a.poradi ?? 0) - (b.poradi ?? 0));

      const soups: GroupedItem[] = [];
      const mains: GroupedItem[] = [];
      let legacySoupTaken = false;

      for (const r of dayRows) {
        const course = r.podskupina?.includes(":")
          ? r.podskupina.split(":")[1]
          : undefined;
        if (course === "polevka") {
          soups.push(toItem(r));
        } else if (course === "hlavni") {
          mains.push(toItem(r));
        } else if (!legacySoupTaken) {
          legacySoupTaken = true;
          soups.push(toItem(r));
        } else {
          mains.push(toItem(r));
        }
      }

      return {
        id: def.id,
        day: def.title,
        ...(soups[0] ? { soup: soups[0] } : {}),
        soups,
        mains,
      };
    })
    .filter((g) => g.soups.length > 0 || g.mains.length > 0);

  return { groups, isLoading: query.isLoading, error: query.error };
}
