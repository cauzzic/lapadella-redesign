import { createFileRoute } from "@/lib/router-compat";
import { PageHero } from "@/components/site/PageHero";
import { MenuList } from "@/components/site/MenuList";
import { AllergenInfo } from "@/components/site/AllergenInfo";
import { CONTACT, IMG } from "@/data/menu";
import { FOOD_SECTIONS } from "@/data/menuSections";
import { useMenuSections } from "@/hooks/useMenuSections";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu – neapolská pizza a pasta | La Padella" },
      {
        name: "description",
        content:
          "Stálé menu La Padella: předkrmy, pravá neapolská pizza, těstoviny, rizota, ryby, saláty a dezerty. Valašské Meziříčí.",
      },
      { property: "og:title", content: "Menu – La Padella" },
      {
        property: "og:description",
        content: "Neapolská pizza, domácí pasta, ryby a dezerty podle rodinných receptů z Neapole.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.menuBanner },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMG.menuBanner },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { sections } = useMenuSections(FOOD_SECTIONS);

  return (
    <>
      <PageHero
        eyebrow="Stálé menu"
        title="Menu"
        image={IMG.menuBanner}
        text="Čerstvé suroviny, těsto kynuté minimálně 24 hodin a suroviny dovážené přímo z Itálie."
      />
      <MenuList sections={sections} />
      <AllergenInfo />
      <section className="bg-secondary/20 px-5 py-16 text-center md:px-8">
        <h2 className="font-display text-4xl text-foreground md:text-5xl">Máte hlad hned teď?</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Objednejte si naše jídlo online s vyzvednutím nebo rozvozem.
        </p>
        <a
          href={CONTACT.orderUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-8"
        >
          <ShoppingBag className="size-4" /> Objednat online
        </a>
      </section>
    </>
  );
}
