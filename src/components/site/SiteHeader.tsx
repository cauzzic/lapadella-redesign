import { Link } from "@/lib/router-compat";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, Phone, ShoppingBag, ChevronDown } from "lucide-react";
import { CONTACT } from "@/data/menu";

const menuLinks = [
  { to: "/menu", label: "Menu" },
  { to: "/tydenni-menu", label: "Týdenní menu" },
  { to: "/specialni-menu", label: "Speciální menu" },
];

const links = [
  { to: "/", label: "Domů" },
  { to: "/napoje", label: "Nápoje" },
  { to: "/o-nas", label: "O nás" },
  { to: "/galerie", label: "Galerie" },
  { to: "/kontakt", label: "Kontakt" },
];


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const menuActive = menuLinks.some((l) => l.to === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);


  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 shadow-[var(--shadow-card)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span
            className={`font-display text-2xl tracking-tight md:text-3xl ${
              scrolled ? "text-foreground" : "text-cream"
            }`}
          >
            La Padella
          </span>
          <span
            className={`mt-0.5 text-[0.55rem] font-semibold tracking-[0.3em] uppercase ${
              scrolled ? "text-primary" : "text-clay"
            }`}
          >
            Ristorante &amp; Pizzeria
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-colors ${
                scrolled ? "text-muted-foreground hover:text-primary" : "text-cream/80 hover:text-cream"
              }`}
              activeProps={{ className: scrolled ? "text-primary" : "text-clay" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={CONTACT.phoneHref}
            className={`btn-ghost ${scrolled ? "text-foreground" : "text-cream"}`}
          >
            <Phone className="size-4" />
            Rezervace
          </a>
          <a href={CONTACT.orderUrl} target="_blank" rel="noreferrer" className="btn-primary">
            <ShoppingBag className="size-4" />
            Objednat
          </a>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden ${scrolled ? "text-foreground" : "text-cream"}`}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-foreground"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={CONTACT.orderUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 self-start"
            >
              <ShoppingBag className="size-4" /> Objednat online
            </a>
            <a href={CONTACT.phoneHref} className="btn-ghost self-start text-foreground">
              <Phone className="size-4" /> {CONTACT.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
