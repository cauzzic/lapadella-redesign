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
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-colors ${
              scrolled ? "text-muted-foreground hover:text-primary" : "text-cream/80 hover:text-cream"
            }`}
            activeProps={{ className: scrolled ? "text-primary" : "text-clay" }}
          >
            Domů
          </Link>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-colors ${
                menuActive
                  ? scrolled
                    ? "text-primary"
                    : "text-clay"
                  : scrolled
                    ? "text-muted-foreground hover:text-primary"
                    : "text-cream/80 hover:text-cream"
              }`}
            >
              Menu
              <ChevronDown
                className={`size-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-4 w-56 -translate-x-1/2 overflow-hidden rounded-sm border border-border bg-card py-2 shadow-[var(--shadow-card)]">
                {menuLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-2.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:bg-secondary/25 hover:text-primary"
                    activeProps={{ className: "text-primary" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
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
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              Domů
            </Link>

            <div>
              <p className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-primary">
                Menu
              </p>
              <div className="mt-2 flex flex-col gap-3 border-l border-border pl-4">
                {menuLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl text-foreground"
                    activeProps={{ className: "text-primary" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {links.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-foreground"
                activeProps={{ className: "text-primary" }}
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
