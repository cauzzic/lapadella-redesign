import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { CONTACT, HOURS } from "@/data/menu";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3 md:px-8 md:py-20">
        <div>
          <p className="font-display text-3xl">La Padella</p>
          <p className="mt-1 text-[0.6rem] font-semibold tracking-[0.3em] text-clay uppercase">
            Italská restaurace &amp; pizzerie
          </p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">
            Pravá neapolská pizza, těstoviny a italská vína ve Valašském Meziříčí. Rodinné recepty
            přímo z Neapole.
          </p>
        </div>

        <div className="space-y-4 text-sm text-cream/80">
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-clay" />
            <span>
              {CONTACT.street}
              <br />
              {CONTACT.city}
            </span>
          </p>
          <p className="flex items-center gap-3">
            <Phone className="size-4 shrink-0 text-clay" />
            <a href={CONTACT.phoneHref} className="hover:text-clay">
              {CONTACT.phone}
            </a>
          </p>
          <p className="flex items-center gap-3">
            <Mail className="size-4 shrink-0 text-clay" />
            <a href={`mailto:${CONTACT.email}`} className="hover:text-clay">
              {CONTACT.email}
            </a>
          </p>
          <div className="flex gap-6 pt-2 text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
            <Link to="/menu" className="hover:text-clay">
              Menu
            </Link>
            <Link to="/galerie" className="hover:text-clay">
              Galerie
            </Link>
            <Link to="/kontakt" className="hover:text-clay">
              Kontakt
            </Link>
            <a
              href={CONTACT.orderUrl}
              target="_blank"
              rel="noreferrer"
              className="text-clay hover:text-cream"
            >
              Objednat
            </a>
          </div>
        </div>

        <div>
          <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.22em] text-clay uppercase">
            <Clock className="size-4" /> Otevírací doba
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            {HOURS.map((h) => (
              <li key={h.day} className="flex justify-between gap-4 border-b border-cream/10 pb-2">
                <span className="text-cream/70">{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-5 py-6 text-center text-xs text-cream/50 md:px-8">
        © {new Date().getFullYear()} LA PADELLA · Odpovědný vedoucí {CONTACT.manager} · IČO{" "}
        {CONTACT.ico}
      </div>
    </footer>
  );
}
