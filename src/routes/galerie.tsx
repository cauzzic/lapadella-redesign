import { createFileRoute } from "@/lib/router-compat";
import { PageHero } from "@/components/site/PageHero";
import { GALLERY, IMG } from "@/data/menu";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie – interiér a jídla | La Padella" },
      {
        name: "description",
        content:
          "Fotogalerie restaurace La Padella ve Valašském Meziříčí – interiér, neapolská pizza, italské speciality a zahrádka.",
      },
      { property: "og:title", content: "Galerie – La Padella" },
      { property: "og:description", content: "Podívejte se k nám: interiér, jídla a atmosféra Itálie." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: GALLERY[0] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: GALLERY[0] },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Fotogalerie"
        title="Galerie"
        image={IMG.contactBg}
        text="Kousek Itálie ve Valašském Meziříčí – prostor pro 120 hostů se zahrádkou."
      />
      <section className="section-pad">
        <div className="mx-auto max-w-7xl columns-1 gap-4 px-5 sm:columns-2 md:px-8 lg:columns-3">
          {GALLERY.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`La Padella – fotografie ${i + 1}`}
              loading="lazy"
              className="mb-4 w-full rounded-sm object-cover shadow-[var(--shadow-card)] transition-transform duration-500 hover:scale-[1.02]"
            />
          ))}
        </div>
      </section>
    </>
  );
}
