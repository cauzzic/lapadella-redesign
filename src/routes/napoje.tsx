import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { MenuList } from "@/components/site/MenuList";
import { DRINK_MENU, IMG } from "@/data/menu";

export const Route = createFileRoute("/napoje")({
  head: () => ({
    meta: [
      { title: "Nápojový lístek – italská vína a drinky | La Padella" },
      {
        name: "description",
        content:
          "Nápojový lístek La Padella: italská vína, prosecco, spritz, káva a nealko. Restaurace ve Valašském Meziříčí.",
      },
      { property: "og:title", content: "Nápojový lístek – La Padella" },
      {
        property: "og:description",
        content: "Italská vína, aperitivy, spritz koktejly a pravá italská káva.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.oblique4 },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMG.oblique4 },
    ],
  }),
  component: DrinksPage,
});

function DrinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Nápojový lístek"
        title="Nápoje"
        image={IMG.oblique4}
        text="Vína pečlivě vybíráme z italských vinařských oblastí, aby dokonale ladila s naším menu."
      />
      <MenuList sections={DRINK_MENU} />
    </>
  );
}
