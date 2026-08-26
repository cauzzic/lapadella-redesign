/**
 * Metadata sekcí menu (pořadí, název, obrázek). Samotné položky se načítají
 * z databáze (tabulka menu_polozky), tato mapa určuje jen zobrazení sekcí.
 */
export type SectionMeta = { id: string; title: string; image?: string };

export const FOOD_SECTIONS: SectionMeta[] = [
  { id: "predkrmy", title: "Předkrmy", image: "https://www.lapadella.cz/data/P%C5%98EDKRMY.jpeg" },
  { id: "pizza", title: "Pizza", image: "https://www.lapadella.cz/data/Pizza.jpeg" },
  {
    id: "testoviny",
    title: "Těstoviny a rizota",
    image: "https://www.lapadella.cz/data/PASTA%20A%20RIZOTA.jpeg",
  },
  {
    id: "masa-ryby",
    title: "Masa a ryby",
    image: "https://www.lapadella.cz/data/MO%C5%98E%20A%20ZEM%C4%9A.jpeg",
  },
  { id: "salaty", title: "Saláty", image: "https://www.lapadella.cz/data/SAL%C3%81TY.jpeg" },
  { id: "dezerty", title: "Dezerty", image: "https://www.lapadella.cz/data/DEZERTY.jpeg" },
  { id: "deti", title: "Děti", image: "https://www.lapadella.cz/data/D%C4%9ATI.jpeg" },
  { id: "prilohy", title: "Přílohy" },
];

export const DRINK_SECTIONS: SectionMeta[] = [
  { id: "aperitivy", title: "Aperitivy" },
  { id: "nealko", title: "Nealkoholické nápoje" },
  { id: "teple", title: "Teplé nápoje" },
  { id: "pivo", title: "Pivo" },
  { id: "likery", title: "Likéry" },
  { id: "destilaty", title: "Destiláty" },
  { id: "cognac", title: "Cognac & Brandy" },
  { id: "whiskey", title: "Whiskey" },
  { id: "rumy", title: "Rumy" },
  { id: "vina", title: "Vína" },
  { id: "michane", title: "Cocktails" },
];


/** Sekce pro Týdenní menu (databázová hodnota sekce = "tydenni"). */
export const WEEKLY_SECTIONS: SectionMeta[] = [{ id: "tydenni", title: "Týdenní menu" }];

/** Sekce pro Speciální menu (databázová hodnota sekce = "specialni"). */
export const SPECIAL_SECTIONS: SectionMeta[] = [{ id: "specialni", title: "Speciální menu" }];

/** Všechny známé hodnoty sloupce sekce – používá se v administraci. */
export const KNOWN_SECTION_IDS: string[] = [
  ...FOOD_SECTIONS.map((s) => s.id),
  ...DRINK_SECTIONS.map((s) => s.id),
  "tydenni",
  "specialni",
];
