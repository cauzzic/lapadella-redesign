import { createFileRoute } from "@/lib/router-compat";
import { PageHero } from "@/components/site/PageHero";
import { CONTACT, HOURS, IMG } from "@/data/menu";
import { AllergenInfo } from "@/components/site/AllergenInfo";
import { AllergenIcons } from "@/components/site/AllergenIcons";
import { WEEKLY_MENU, WEEKLY_NOTE } from "@/data/weekly";
import { useWeeklyDayGroups } from "@/hooks/useSectionGroups";
import { WEEKLY_DAYS } from "@/data/menuSections";
import { Clock, Phone, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/tydenni-menu")({
  head: () => ({
    meta: [
      { title: "Týdenní menu – denní obědy | La Padella" },
      {
        name: "description",
        content:
          "Týdenní menu La Padella ve Valašském Meziříčí: polévka a tři hlavní jídla každý den od pondělí do pátku, 11:00 – 14:00.",
      },
      { property: "og:title", content: "Týdenní menu – La Padella" },
      {
        property: "og:description",
        content: "Denní obědové menu od pondělí do pátku – pasta, pizza, ryby i masa z italské kuchyně.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.food1 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMG.food1 },
    ],
  }),
  component: WeeklyMenuPage,
});

function WeeklyMenuPage() {
  const { groups } = useWeeklyDayGroups(WEEKLY_DAYS);
  const days =
    groups.length > 0
      ? groups.map((g) => ({
          day: g.day,
          soups: g.soups,
          mains: g.mains,
        }))
      : WEEKLY_MENU.map((d) => ({ day: d.day, soups: [d.soup], mains: d.mains }));

  return (
    <>
      <PageHero
        eyebrow="Obědové menu"
        title="Týdenní menu"
        image={IMG.food1}
        text={WEEKLY_NOTE}
      />

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {days.map((d) => (
            <article
              key={d.day}
              className="rounded-sm border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8"
            >
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-3xl text-foreground md:text-4xl">{d.day}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>

              {d.soups.length > 0 && (
                <>
                  <p className="mt-5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-primary">
                    Polévka
                  </p>
                  {d.soups.map((s) => (
                    <div key={s.name} className="mt-2 flex gap-6">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {s.name}
                        <AllergenIcons numbers={(s as { allergens?: number[] }).allergens} />
                      </p>
                      <span className="ml-auto shrink-0 font-display text-lg text-primary">
                        {s.price}
                      </span>
                    </div>
                  ))}
                </>
              )}

              <p className="mt-6 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-primary">
                Hlavní jídla
              </p>
              <ul className="mt-2 divide-y divide-border">
                {d.mains.map((m) => (
                  <li key={m.name} className="flex gap-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tracking-[0.06em] uppercase">
                        {m.name}
                        <AllergenIcons numbers={(m as { allergens?: number[] }).allergens} />
                      </p>
                      {m.desc && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
                      )}
                    </div>
                    <span className="ml-auto shrink-0 font-display text-xl text-primary">
                      {m.price}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <aside className="rounded-sm border border-border bg-secondary/20 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-primary" />
              <h2 className="font-display text-2xl text-foreground">Otevírací doba</h2>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {HOURS.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 text-muted-foreground">
                  <span>{h.day}</span>
                  <span className="text-foreground">{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={CONTACT.orderUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <ShoppingBag className="size-4" /> Objednat online
              </a>
              <a href={CONTACT.phoneHref} className="btn-ghost text-foreground">
                <Phone className="size-4" /> {CONTACT.phone}
              </a>
            </div>
          </aside>
        </div>
      </div>
      <AllergenInfo />
    </>

  );
}
