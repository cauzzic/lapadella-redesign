import { createFileRoute, Link } from "@/lib/router-compat";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CONTACT, IMG, GALLERY } from "@/data/menu";
import { ReserveLink } from "@/components/site/ReserveLink";
import { DishWidget } from "@/components/site/DishWidget";
import mainHeroImg from "@/assets/main-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "La Padella – italská restaurace a pizzerie, Valašské Meziříčí" },
      {
        name: "description",
        content:
          "Pravá neapolská pizza, domácí pasta a italská vína ve Valašském Meziříčí. Rodinné recepty z Neapole, italští kuchaři. Rezervace: +420 723 232 376.",
      },
      { property: "og:title", content: "La Padella – italská restaurace & pizzerie" },
      {
        property: "og:description",
        content: "Neapolská pizza, domácí těstoviny a italská vína v srdci Valašského Meziříčí.",
      },
      { property: "og:type", content: "website" },
{ property: "og:image", content: mainHeroImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: mainHeroImg },
    ],
  }),
  component: Index,
});

const categories = [
  { title: "Předkrmy", img: IMG.food1, href: "/menu#predkrmy" },
  { title: "Hlavní chody", img: IMG.food4, href: "/menu#pizza" },
  { title: "Dezerty", img: IMG.oblique3, href: "/menu#dezerty" },
  { title: "Nápoje", img: IMG.oblique4, href: "/napoje" },
] as const;

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
<img
          src={mainHeroImg}
          alt="Italský kuchař připravuje neapolskou pizzu v La Padella"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/50 to-ink/90" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-16 md:px-8">
          <p className="eyebrow text-clay">Valašské Meziříčí · Cucina Napoletana</p>
          <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] text-cream sm:text-6xl md:text-8xl">
            Kousek Neapole, <span className="text-clay">jen pár kroků od vás</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            Dovolte nám vzít vás přímo do srdce Itálie – do míst, kde se vůně čerstvé pizzy a
            výjimečných pokrmů snoubí s tradicemi neapolské kuchyně.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={CONTACT.orderUrl} target="_blank" rel="noreferrer" className="btn-primary">
              <ShoppingBag className="size-4" /> Objednat online
            </a>
            <ReserveLink className="btn-ghost text-cream" />
            <Link to="/menu" className="btn-ghost text-cream">
              Naše menu <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div className="relative">
            <img
              src={IMG.kitchen}
              alt="Interiér a kuchyně restaurace La Padella"
              loading="lazy"
              className="w-full rounded-sm object-cover shadow-[var(--shadow-soft)]"
            />
            <div className="absolute -bottom-8 -right-4 hidden bg-sage-deep px-8 py-6 text-cream md:block">
              <p className="font-display text-4xl">2024</p>
              <p className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase">
                Rodinná tradice
              </p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Vítejte v</p>
            <h2 className="mt-3 text-4xl md:text-5xl">restauraci La Padella</h2>
            <p className="mt-6 font-display text-2xl leading-snug text-sage-deep md:text-[1.75rem]">
              „Přesně takovou atmosféru jsme pro vás vytvořili tady u nás, v La Padelle.“
            </p>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Jídla pro vás připravujeme podle našich originálních rodinných receptů, které pocházejí
              přímo z Neapole. Přijďte si odpočinout a vychutnat Itálii tak, jak ji milujeme a známe
              my.
            </p>
            <Link to="/o-nas" className="btn-ghost mt-8 text-foreground">
              Více o nás <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-muted section-pad">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Naše</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Menu</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Čerstvé suroviny, autentické těsto a voňavé bylinky jsou tou nejlepší kombinací, která
              vám připomene atmosféru Itálie a neodolatelné vůně tamních trattorií.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="group relative block h-72 overflow-hidden rounded-sm"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-ink/10" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-cream">
                  <span className="font-display text-2xl">{c.title}</span>
                  <ArrowRight className="size-5 text-clay transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* STORY / HARMONIE */}
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl">Harmonie chutí</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Představte si tu harmonii chutí – čerstvá bazalka, šťavnatá rajčata San Marzano, vláčná
              buvolí mozzarella a k tomu delikátní mořské plody nebo křehké maso, vše připravené s
              láskou a mistrovstvím italských kuchařů.
            </p>
            <p className="mt-6 font-display text-3xl text-primary">
              Tak co, máme pro Vás připravit stůl?
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={CONTACT.orderUrl} target="_blank" rel="noreferrer" className="btn-primary">
                <ShoppingBag className="size-4" /> Objednat online
              </a>
              <Link to="/menu" className="btn-ghost text-foreground">
                Podívat se na menu
              </Link>
              <ReserveLink className="btn-ghost text-foreground" />
            </div>
          </div>
          <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            {GALLERY.slice(0, 4).map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Speciality La Padella ${i + 1}`}
                loading="lazy"
                className={`h-48 w-full rounded-sm object-cover shadow-[var(--shadow-card)] md:h-60 ${
                  i % 3 === 0 ? "translate-y-4" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* REZERVACE */}
      <section id="rezervace" className="scroll-mt-24 bg-sage-deep section-pad">
        <div className="mx-auto max-w-3xl px-5 text-center text-cream md:px-8">
          <p className="eyebrow text-clay">Rezervace</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Rezervujte si stůl</h2>
          <p className="mx-auto mt-6 max-w-xl text-cream/80">
            Chcete si vychutnat autentickou italskou kuchyni v příjemném prostředí? Rezervujte si
            stůl snadno online.
          </p>
          <div
            id="dish-widget"
            className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-sm bg-cream px-3 py-4 text-left text-foreground sm:px-6 sm:py-6"
          >
            <DishWidget className="w-full" />
          </div>
        </div>
      </section>

      {/* HOURS + ADDRESS */}
      <section className="relative overflow-hidden">
        <img src={IMG.aboutBg} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 text-cream md:px-8 md:py-28">
          <div>
            <p className="eyebrow text-clay">Kde nás najdete</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Adresa</h2>
            <p className="mt-6 text-lg text-cream/80">
              LA PADELLA Italská restaurace &amp; pizzerie
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </p>
            <a href={CONTACT.mapUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-8 text-cream">
              Zobrazit na mapě
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
