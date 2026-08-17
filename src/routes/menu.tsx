import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { MenuList } from "@/components/site/MenuList";
import { FOOD_MENU, IMG } from "@/data/menu";

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
  return (
    <>
      <PageHero
        eyebrow="Stálé menu"
        title="Menu"
        image={IMG.menuBanner}
        text="Čerstvé suroviny, těsto kynuté minimálně 24 hodin a suroviny dovážené přímo z Itálie."
      />
      <MenuList sections={FOOD_MENU} />
    </>
  );
}
