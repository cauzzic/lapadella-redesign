import {
  Wheat,
  Shrimp,
  Egg,
  Fish,
  Nut,
  Bean,
  Milk,
  Carrot,
  Droplets,
  Sprout,
  FlaskConical,
  Flower2,
  Shell,
  type LucideIcon,
} from "lucide-react";

export type Allergen = { n: number; icon: LucideIcon; cs: string; en: string; short: string };

export const ALLERGENS: Allergen[] = [
  {
    n: 1,
    icon: Wheat,
    short: "Lepek",
    cs: "Obiloviny obsahující lepek (pšenice, žito, ječmen, oves, špalda, kamut nebo jejich hybridní odrůdy) a výrobky z nich",
    en: "Cereals containing gluten (i.s. wheat, barley, oats, spelt, kamut or their hybridised)",
  },
  {
    n: 2,
    icon: Shrimp,
    short: "Korýši",
    cs: "Korýši a výrobky z nich",
    en: "Crustaceans and product derived there from",
  },
  { n: 3, icon: Egg, short: "Vejce", cs: "Vejce a výrobky z nich", en: "Eggs and products from them" },
  { n: 4, icon: Fish, short: "Ryby", cs: "Ryby a výrobky z nich", en: "Fish and product there of" },
  {
    n: 5,
    icon: Bean,
    short: "Arašídy",
    cs: "Podzemnice olejná (arašídy) a výrobky z nich",
    en: "Peanuts and products there of",
  },
  {
    n: 6,
    icon: Sprout,
    short: "Sója",
    cs: "Sójové boby (sója) a výrobky z nich",
    en: "Soy beans and products there of",
  },
  {
    n: 7,
    icon: Milk,
    short: "Mléko",
    cs: "Mléko a výrobky z něj včetně laktózy",
    en: "Milk and products of milk, including lactose",
  },
  {
    n: 8,
    icon: Nut,
    short: "Skořápkové plody",
    cs: "Skořápkové plody (mandle, lískové ořechy, vlašské ořechy, kešu ořechy, pekanové ořechy, para ořechy, pistácie, makadamové ořechy, queenslandské ořechy) a výrobky z nich",
    en: "Nuts, which are almonds, hazelnuts, walnuts, cashews, pecan nuts, pistachios, brazil nuts, macadamia nuts and products there of",
  },
  { n: 9, icon: Carrot, short: "Celer", cs: "Celer a výrobky z něj", en: "Celery and products there of" },
  {
    n: 10,
    icon: Droplets,
    short: "Hořčice",
    cs: "Hořčice a výrobky z ní",
    en: "Mustard and products there of",
  },
  {
    n: 11,
    icon: Sprout,
    short: "Sezam",
    cs: "Sezamová semínka (sezam) a výrobky z nich",
    en: "Sesame seeds and products thereof",
  },
  {
    n: 12,
    icon: FlaskConical,
    short: "Siřičitany",
    cs: "Oxid siřičitý a siřičitany v koncentracích vyšších než 10 mg/kg/l",
    en: "Sulphur dioxide and sulphites at concentrations higher than 10 mg/kg a 10 mg/l",
  },
  {
    n: 13,
    icon: Flower2,
    short: "Vlčí bob",
    cs: "Vlčí mák (bob) a výrobky z něj",
    en: "Lupin and products there of",
  },
  { n: 14, icon: Shell, short: "Měkkýši", cs: "Měkkýši a výrobky z nich", en: "Molluscs and products there of" },
];

export const ALLERGEN_BY_NUMBER = new Map(ALLERGENS.map((a) => [a.n, a]));
