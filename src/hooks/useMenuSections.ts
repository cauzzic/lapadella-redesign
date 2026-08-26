import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MenuSection } from "@/data/menu";
import type { SectionMeta } from "@/data/menuSections";

type Row = {
  id: string;
  sekce: string;
  nazev: string;
  popis: string | null;
  cena: number | string | null;
  obrazek: string | null;
  poradi: number | null;
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

async function fetchMenuItems(sectionIds: string[]): Promise<Row[]> {
  const { data, error } = await supabase
    .from("menu_polozky")
    .select("id, sekce, nazev, popis, cena, obrazek, poradi, alergeny")
    .eq("aktivni", true)
    .in("sekce", sectionIds)
    .order("poradi", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Row[];
}

/** Načte položky z databáze a seskupí je do sekcí podle zadané metadaty. */
export function useMenuSections(meta: SectionMeta[]) {
  const sectionIds = meta.map((m) => m.id);

  const query = useQuery({
    queryKey: ["menu_polozky", sectionIds],
    queryFn: () => fetchMenuItems(sectionIds),
    staleTime: 5 * 60 * 1000,
  });

  const sections: MenuSection[] = meta
    .map((m) => {
      const items = (query.data ?? [])
        .filter((r) => r.sekce === m.id)
        .sort((a, b) => (a.poradi ?? 0) - (b.poradi ?? 0))
        .map((r) => ({
          name: r.nazev,
          price: formatPrice(r.cena),
          ...(r.popis ? { desc: r.popis } : {}),
          ...(r.alergeny && r.alergeny.length > 0
            ? { allergens: r.alergeny.map(Number) }
            : {}),
        }));
      return {
        id: m.id,
        title: m.title,
        ...(m.image ? { image: m.image } : {}),
        items,
      };
    })
    .filter((s) => s.items.length > 0);

  return { sections, isLoading: query.isLoading, error: query.error };
}
