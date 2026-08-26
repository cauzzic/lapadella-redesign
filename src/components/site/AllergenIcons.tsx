import { ALLERGEN_BY_NUMBER } from "@/data/allergens";

/** Malé ikonky alergenů zobrazené bezprostředně za názvem jídla. */
export function AllergenIcons({ numbers }: { numbers?: number[] | null | undefined }) {
  const list = (numbers ?? [])
    .map((n) => ALLERGEN_BY_NUMBER.get(Number(n)))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  if (list.length === 0) return null;

  return (
    <span className="ml-2 inline-flex translate-y-[1px] items-center gap-1 align-middle">
      {list.map((a) => {
        const Icon = a.icon;
        return (
          <span
            key={a.n}
            title={`${a.n} – ${a.cs}`}
            aria-label={`Alergen ${a.n}: ${a.short}`}
            className="inline-flex size-4 items-center justify-center rounded-full border border-primary/60 text-primary"
          >
            <Icon className="size-2.5" strokeWidth={1.8} />
          </span>
        );
      })}
    </span>
  );
}
