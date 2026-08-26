import type { MenuSection } from "@/data/menu";
import { AllergenIcons } from "@/components/site/AllergenIcons";

export function MenuList({ sections }: { sections: MenuSection[] }) {
  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <nav className="flex flex-wrap justify-center gap-2 py-10">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-border px-4 py-2 text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="space-y-20 pb-24">
        {sections.map((section, i) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <div className="flex items-center gap-5">
              <h2 className="text-3xl md:text-4xl">{section.title}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div
              className={`mt-8 grid gap-10 ${section.image ? "lg:grid-cols-[1.6fr_1fr]" : ""} ${
                i % 2 === 1 ? "lg:[&>figure]:order-first" : ""
              }`}
            >
              <ul className="divide-y divide-border">
                {section.items.map((item) => (
                  <li key={item.name} className="flex gap-6 py-5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tracking-[0.08em] uppercase">
                        {item.name}
                        <AllergenIcons numbers={item.allergens} />
                      </p>
                      {item.desc && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      )}
                    </div>
                    <span className="ml-auto shrink-0 font-display text-xl text-primary">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>

              {section.image && (
                <figure className="hidden lg:block">
                  <img
                    src={section.image}
                    alt={section.title}
                    loading="lazy"
                    className="sticky top-28 h-[420px] w-full rounded-sm object-cover shadow-[var(--shadow-soft)]"
                  />
                </figure>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
