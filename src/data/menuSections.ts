import igPizza from "@/assets/menu/pizza.jpg";
import igPredkrmy from "@/assets/menu/predkrmy.jpg";
import igTestoviny from "@/assets/menu/testoviny.jpg";
import igMasaRyby from "@/assets/menu/masa-ryby.jpg";
import igSalaty from "@/assets/menu/salaty.jpg";
import igDeti from "@/assets/menu/deti.jpg";
import igPrilohy from "@/assets/menu/prilohy.jpg";
import menuDezerty from "@/assets/menu/home-dezerty.png";

/**
 * Metadata sekcí menu (pořadí, název, obrázek). Samotné položky se načítají
 * z databáze (tabulka menu_polozky), tato mapa určuje jen zobrazení sekcí.
 */
export type SectionMeta = {
  id: string;
  title: string;
  image?: string;
  /** "contain" = zobrazit celou fotku bez ořezu (výchozí je ořez object-cover) */
  imageFit?: "contain";
};

export const FOOD_SECTIONS: SectionMeta[] = [
  { id: "predkrmy", title: "Předkrmy", image: igPredkrmy },
  { id: "pizza", title: "Pizza", image: igPizza },
  {
    id: "testoviny",
    title: "Těstoviny a rizota",
    image: igTestoviny,
  },
  {
    id: "masa-ryby",
    title: "Masa a ryby",
    image: igMasaRyby,
    imageFit: "contain",
  },
  { id: "salaty", title: "Saláty", image: igSalaty },
  { id: "dezerty", title: "Dezerty", image: menuDezerty },
  { id: "deti", title: "Děti", image: igDeti },
  { id: "prilohy", title: "Přílohy", image: igPrilohy },
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

/** Dny týdenního menu – hodnota sloupce `podskupina` u sekce "tydenni". */
export const WEEKLY_DAYS: { id: string; title: string }[] = [
  { id: "po", title: "Pondělí" },
  { id: "ut", title: "Úterý" },
  { id: "st", title: "Středa" },
  { id: "ct", title: "Čtvrtek" },
  { id: "pa", title: "Pátek" },
];

/**
 * Části dne v týdenním menu. V databázi se ukládá do `podskupina` jako
 * `den:cast` (např. "po:polevka"). Starší záznamy mají jen `den` – tam se
 * první položka podle `poradi` chová jako polévka a zbytek jako hlavní jídla.
 */
export const WEEKLY_COURSES: { id: string; title: string }[] = [
  { id: "polevka", title: "Polévka" },
  { id: "hlavni", title: "Hlavní jídlo" },
];

export function buildWeeklySubgroup(day: string, course: string): string {
  if (!day) return "";
  return course ? `${day}:${course}` : day;
}

export function parseWeeklySubgroup(value: string | null): {
  day: string;
  course: string;
} {
  if (!value) return { day: "", course: "" };
  const [day, course] = value.split(":");
  return { day: day ?? "", course: course ?? "" };
}

/** Podkategorie vín – hodnota sloupce `podskupina` u sekce "vina". */
export const WINE_SUBGROUPS: { id: string; title: string }[] = [
  { id: "cervena", title: "Červená vína" },
  { id: "bila", title: "Bílá vína" },
  { id: "ruzova", title: "Růžová vína" },
  { id: "champagne", title: "Champagne" },
  { id: "sumiva", title: "Šumivá vína & Prosecco" },
];

/** Podkategorie speciálního menu – hodnota sloupce `podskupina` u sekce "specialni". */
export const SPECIAL_SUBGROUPS: { id: string; title: string }[] = [
  { id: "sefkuchar", title: "Speciality šéfkuchaře" },
  { id: "sezonni", title: "Sezónní nabídka" },
  { id: "degustace", title: "Degustační menu" },
  { id: "dezerty-special", title: "Speciální dezerty" },
];
