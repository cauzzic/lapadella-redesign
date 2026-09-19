import { createFileRoute } from "@/lib/router-compat";
import { PageHero } from "@/components/site/PageHero";
import { MenuList } from "@/components/site/MenuList";
import { IMG } from "@/data/menu";
import { DRINK_SECTIONS } from "@/data/menuSections";
import { useMenuSections } from "@/hooks/useMenuSections";

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
  const { sections } = useMenuSections(DRINK_SECTIONS);

  return (
    <>
      <PageHero
        eyebrow="Nápojový lístek"
        title="Nápoje"
        image={IMG.oblique4}
        text="Vína pečlivě vybíráme z italských vinařských oblastí, aby dokonale ladila s naším menu."
      />
      <MenuList sections={sections} />
    </>
  );
}
