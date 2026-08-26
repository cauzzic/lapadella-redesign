import { ALLERGENS, type Allergen } from "@/data/allergens";

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
