import { createFileRoute } from "@/lib/router-compat";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CONTACT, HOURS, IMG } from "@/data/menu";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt a rezervace | La Padella Valašské Meziříčí" },
      {
        name: "description",
        content:
          "Rezervace na +420 723 232 376 nebo info@lapadella.cz. La Padella, Smetanova 807, Valašské Meziříčí. Otevřeno denně.",
      },
      { property: "og:title", content: "Kontakt a rezervace – La Padella" },
      { property: "og:description", content: "Zavolejte nám a rezervujte si stůl v italské restauraci La Padella." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: IMG.contactBg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: IMG.contactBg },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Rezervace"
        title="Kontakt"
        image={IMG.contactBg}
        text="Máme pro Vás připravit stůl? Zavolejte nám nebo napište, rádi se o vás postaráme."
      />

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Kontaktní informace</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Ozvěte se nám</h2>

            <div className="mt-10 space-y-6">
              <a
                href={CONTACT.phoneHref}
                className="flex items-start gap-4 border-b border-border pb-6 transition-colors hover:text-primary"
              >
                <Phone className="mt-1 size-5 text-primary" />
                <span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Telefon
                  </span>
                  <span className="font-display text-2xl">{CONTACT.phone}</span>
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-start gap-4 border-b border-border pb-6 transition-colors hover:text-primary"
              >
                <Mail className="mt-1 size-5 text-primary" />
                <span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    E-mail
                  </span>
                  <span className="font-display text-2xl">{CONTACT.email}</span>
                </span>
              </a>
              <div className="flex items-start gap-4 border-b border-border pb-6">
                <MapPin className="mt-1 size-5 text-primary" />
                <span>
                  <span className="block text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    Adresa
                  </span>
                  <span className="font-display text-2xl">
                    {CONTACT.street}, {CONTACT.city}
                  </span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Odpovědný vedoucí: {CONTACT.manager}
                <br />
                IČO: {CONTACT.ico}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-sm bg-card p-8 shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-primary">
                <Clock className="size-4" /> Otevírací doba
              </p>
              <ul className="mt-6 space-y-3">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between border-b border-border pb-3 text-sm">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-semibold">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-sm shadow-[var(--shadow-card)]">
              <iframe
                title="Mapa – La Padella"
                src="https://maps.google.com/maps?q=La%20Padella%20Smetanova%20807%20Valask%C3%A9%20Mezi%C5%99%C3%AD%C4%8D%C3%AD&z=16&output=embed"
                className="h-80 w-full border-0"
                loading="lazy"
              />
            </div>
            <a href={CONTACT.mapUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              Otevřít v mapách
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
