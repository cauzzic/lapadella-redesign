import { createFileRoute, Link } from "@/lib/router-compat";
import { PageHero } from "@/components/site/PageHero";
import { IMG } from "@/data/menu";

export const Route = createFileRoute("/o-nas")({
  head: () => ({
    meta: [
      { title: "O nás – rodinná neapolská tradice | La Padella" },
      {
        name: "description",
        content:
          "Rodinné recepty z Neapole, těsto kynuté 24 hodin, italští kuchaři a suroviny z Itálie. Poznejte La Padella ve Valašském Meziříčí.",
      },
      { property: "og:title", content: "O nás – La Padella" },
      {
        property: "og:description",
        content: "Pravá neapolská pizza a rodinná tradice předávaná z generace na generaci.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.aboutBg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMG.aboutBg },
    ],
  }),
  component: AboutPage,
});

const paragraphs = [
  "Vaření a kvalitní jídlo jsou naší vášní, kterou s vámi chceme sdílet. La Padella není jen místem, kde se připravují lahodná jídla; je to místo, kde se setkává rodinná tradice s uměním neapolské kuchyně, předávaným z generace na generaci. Staré rodinné recepty, uchovávané po celá desetiletí, nesou autentickou chuť Neapole, která se odráží v každém soustu.",
  "Přijďte k nám ochutnat neapolskou pizzu – jedinou svého druhu v okolí. Věděli jste, že původní neapolský recept je chráněný a jen málo míst na světě jej skutečně dodržuje? U nás neděláme kompromisy. Připálené nadýchané okraje, tenké těsto a vybrané ingredience, to je pravá neapolská pizza. Každé těsto kyne minimálně 24 hodin, aby dosáhlo dokonalé struktury, a všechny suroviny, od mouky až po rajčata San Marzano, si buď sami dovážíme z Itálie, nebo nakupujeme od italských dodavatelů.",
  "Naše kuchyně a pizzerie jsou domovem italských kuchařů, kteří žijí a dýchají uměním neapolské gastronomie. Ryby a mořské plody jsou ihned po výlovu zamrazovány na moři, aby si zachovaly svou kvalitu, čerstvost a chuť. Stejně jako jídlo i naše vína pečlivě vybíráme z italských vinařských oblastí, aby dokonale ladila s naším menu.",
  "I když nás mnozí odrazovali od myšlenky začít s gastronomií, nevzdali jsme se a s touhou připravovat prvotřídní pokrmy jsme otevřeli. Interiér naší restaurace vás přenese do samého srdce Itálie – ať už díky vůni pečící se pizzy nebo jedinečné atmosféře, která vám učaruje. Věříme, že skutečné kouzlo se skrývá v původních recepturách a lásce k řemeslu, a proto naše cesta za autenticitou nemá žádné hranice.",
  "Jak se říká – Napoletáncem se musíte narodit, tím se člověk nestane. U nás ale můžete ochutnat tu pravou chuť neapolského života. Těšíme se na vás!",
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Restaurace La Padella"
        title="O nás"
        image={IMG.aboutBg}
        text="„Zavřete oči a představte si: pravá italská atmosféra, křupavé těsto pizzy a dokonalé chutě, které se rozplývají na jazyku.“"
      />

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6 text-[1.02rem] leading-relaxed text-muted-foreground">
            <p className="font-display text-3xl leading-snug text-foreground md:text-4xl">
              Pro zážitek pravé Itálie už nemusíte jezdit za hranice – kousek této nádherné země jsme
              přivezli přímo k vám.
            </p>
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <Link to="/menu" className="btn-primary mt-4">
              Podívat se na menu
            </Link>
          </div>

          <div className="space-y-5">
            <img
              src={IMG.team}
              alt="Tým restaurace La Padella"
              loading="lazy"
              className="w-full rounded-sm object-cover shadow-[var(--shadow-soft)]"
            />
            <img
              src={IMG.kitchen}
              alt="Kuchyně La Padella"
              loading="lazy"
              className="w-full rounded-sm object-cover shadow-[var(--shadow-soft)]"
            />
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8 md:py-20">
          {[
            { n: "24 h", t: "Kynutí těsta", d: "Minimálně, pro dokonalou strukturu neapolské pizzy." },
            { n: "100 %", t: "Italské suroviny", d: "Mouka, rajčata San Marzano i mozzarella z Itálie." },
            { n: "120", t: "Míst k sezení", d: "Prostor pro rodiny, firemní akce i páry, se zahrádkou." },
          ].map((s) => (
            <div key={s.t}>
              <p className="font-display text-5xl text-clay">{s.n}</p>
              <p className="mt-3 text-sm font-semibold tracking-[0.18em] uppercase">{s.t}</p>
              <p className="mt-2 text-sm text-cream/70">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
