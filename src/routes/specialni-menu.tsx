import { createFileRoute, Link } from "@/lib/router-compat";
import { PageHero } from "@/components/site/PageHero";
import { MenuList } from "@/components/site/MenuList";
import { AllergenInfo } from "@/components/site/AllergenInfo";
import { IMG } from "@/data/menu";
import { SPECIAL_MENU, SPECIAL_NOTE } from "@/data/special";
import { useNamedGroups } from "@/hooks/useSectionGroups";
import { SPECIAL_SUBGROUPS } from "@/data/menuSections";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/specialni-menu")({
  head: () => ({
    meta: [
      { title: "Speciální menu – speciality šéfkuchaře | La Padella" },
      {
        name: "description",
        content:
          "Speciální menu La Padella: lanýže, steaky, ryby a degustační menu s párovanými italskými víny ve Valašském Meziříčí.",
      },
      { property: "og:title", content: "Speciální menu – La Padella" },
      {
        property: "og:description",
        content: "Sezónní speciality šéfkuchaře a degustační menu s italskými víny.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.food4 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMG.food4 },
    ],
  }),
  component: SpecialMenuPage,
});

function SpecialMenuPage() {
  const { groups } = useNamedGroups("specialni", SPECIAL_SUBGROUPS);
  const list =
    groups.length > 0
      ? groups.map((g) => ({
          id: g.id,
          title: g.title,
          items: g.items.map((it) => ({
            name: it.name,
            price: g.id === "degustace" && it.price ? `${it.price} / os.` : it.price,
            ...(it.desc ? { desc: it.desc } : {}),
            ...(it.allergens ? { allergens: it.allergens } : {}),
          })),
        }))
      : SPECIAL_MENU;

  return (
    <>
      <PageHero
        eyebrow="Speciality šéfkuchaře"
        title="Speciální menu"
        image={IMG.food4}
        text={SPECIAL_NOTE}
      />
      <MenuList sections={list} />
      <AllergenInfo />
      <section className="bg-secondary/20 px-5 py-16 text-center md:px-8">
        <h2 className="font-display text-4xl text-foreground md:text-5xl">Rezervujte si stůl</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Degustační menu doporučujeme rezervovat alespoň den předem.
        </p>
        <Link to="/#rezervace" className="btn-primary mt-8">
          <Phone className="size-4" /> Rezervovat stůl
        </Link>
      </section>
    </>
  );
}
