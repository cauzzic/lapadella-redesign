/** Kalendářní datum (YYYY-MM-DD) v časovém pásmu Europe/Prague. */
export function pragueToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export type WeeklyMenuPeriod = {
  id: string;
  plati_od: string | null;
  plati_do: string | null;
  zverejneno: boolean;
};

/** Menu je platné, je-li zveřejněné a dnešek leží v intervalu OD–DO (oba dny včetně). */
export function isMenuValid(menu: WeeklyMenuPeriod, today: string): boolean {
  if (!menu.zverejneno || !menu.plati_od || !menu.plati_do) return false;
  return menu.plati_od <= today && today <= menu.plati_do;
}

/** Vybere aktuálně platné menu; při překryvu vyhrává nejpozdější datum OD. */
export function pickCurrentMenu<T extends WeeklyMenuPeriod>(menus: T[], today: string): T | null {
  const valid = menus.filter((m) => isMenuValid(m, today));
  valid.sort((a, b) => (b.plati_od! < a.plati_od! ? -1 : b.plati_od! > a.plati_od! ? 1 : 0));
  return valid[0] ?? null;
}

export type MenuStatus = "aktualni" | "naplanovane" | "koncept" | "archiv";

export function menuStatus(menu: WeeklyMenuPeriod, today: string): MenuStatus {
  if (menu.plati_do && menu.plati_do < today) return "archiv";
  if (!menu.zverejneno) return "koncept";
  if (isMenuValid(menu, today)) return "aktualni";
  return "naplanovane";
}

/** "2026-10-13" → "13. 10. 2026" bez převodu přes Date (žádný posun pásma). */
export function formatCzDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${Number(d)}. ${Number(m)}. ${y}`;
}
