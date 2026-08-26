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

type Allergen = { n: number; icon: LucideIcon; cs: string; en: string };

const ALLERGENS: Allergen[] = [
  {
    n: 1,
    icon: Wheat,
    cs: "Obiloviny obsahující lepek (pšenice, žito, ječmen, oves, špalda, kamut nebo jejich hybridní odrůdy) a výrobky z nich",
    en: "Cereals containing gluten (i.s. wheat, barley, oats, spelt, kamut or their hybridised)",
  },
  { n: 2, icon: Shrimp, cs: "Korýši a výrobky z nich", en: "Crustaceans and product derived there from" },
  { n: 3, icon: Egg, cs: "Vejce a výrobky z nich", en: "Eggs and products from them" },
  { n: 4, icon: Fish, cs: "Ryby a výrobky z nich", en: "Fish and product there of" },
  {
    n: 5,
    icon: Bean,
    cs: "Podzemnice olejná (arašídy) a výrobky z nich",
    en: "Peanuts and products there of",
  },
  { n: 6, icon: Sprout, cs: "Sójové boby (sója) a výrobky z nich", en: "Soy beans and products there of" },
  {
    n: 7,
    icon: Milk,
    cs: "Mléko a výrobky z něj včetně laktózy",
    en: "Milk and products of milk, including lactose",
  },
  {
    n: 8,
    icon: Nut,
    cs: "Skořápkové plody (mandle, lískové ořechy, vlašské ořechy, kešu ořechy, pekanové ořechy, para ořechy, pistácie, makadamové ořechy, queenslandské ořechy) a výrobky z nich",
    en: "Nuts, which are almonds, hazelnuts, walnuts, cashews, pecan nuts, pistachios, brazil nuts, macadamia nuts and products there of",
  },
  { n: 9, icon: Carrot, cs: "Celer a výrobky z něj", en: "Celery and products there of" },
  { n: 10, icon: Droplets, cs: "Hořčice a výrobky z ní", en: "Mustard and products there of" },
  { n: 11, icon: Sprout, cs: "Sezamová semínka (sezam) a výrobky z nich", en: "Sesame seeds and products thereof" },
  {
    n: 12,
    icon: FlaskConical,
    cs: "Oxid siřičitý a siřičitany v koncentracích vyšších než 10 mg/kg/l",
    en: "Sulphur dioxide and sulphites at concentrations higher than 10 mg/kg a 10 mg/l",
  },
  { n: 13, icon: Flower2, cs: "Vlčí mák (bob) a výrobky z něj", en: "Lupin and products there of" },
  { n: 14, icon: Shell, cs: "Měkkýši a výrobky z nich", en: "Molluscs and products there of" },
];

function AllergenRow({ a }: { a: Allergen }) {
  const Icon = a.icon;
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary">
        <Icon className="size-5" strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">{a.n} –</span> {a.cs}
        </p>
        <p className="mt-0.5 text-[0.78rem] leading-relaxed italic text-muted-foreground">/ {a.en}</p>
      </div>
    </li>
  );
}

export function AllergenInfo() {
  return (
    <section
      aria-labelledby="alergeny"
      className="border-t border-border bg-secondary/10 px-5 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="alergeny"
          className="text-center text-xl font-bold tracking-[0.08em] uppercase text-sage-deep md:text-2xl"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Seznam a označení alergenů / Allergens
        </h2>

        <div className="mt-10 grid gap-x-12 gap-y-7 md:grid-cols-2">
          <ul className="space-y-7">
            {ALLERGENS.slice(0, 7).map((a) => (
              <AllergenRow key={a.n} a={a} />
            ))}
          </ul>
          <ul className="space-y-7">
            {ALLERGENS.slice(7).map((a) => (
              <AllergenRow key={a.n} a={a} />
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-3 text-center">
          <p className="text-sm leading-relaxed text-foreground">
            Poloviční a dětské porce účtujeme 70&nbsp;% z celkové ceny.
          </p>
          <p className="text-[0.78rem] leading-relaxed italic text-muted-foreground">
            Mezze porzioni 70% del costo. / Half portions charged 70% of the total price.
          </p>
          <p className="pt-2 text-sm font-semibold leading-relaxed text-foreground">
            Naše pokrmy jsou vyrobeny pouze z originálních italských surovin od italských dodavatelů,
            včetně ryb.
          </p>
        </div>
      </div>
    </section>
  );
}
