import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Copy, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WEEKLY_DAYS, parseWeeklySubgroup } from "@/data/menuSections";
import { formatCzDate, menuStatus, pragueToday, type MenuStatus } from "@/lib/pragueDate";

export type WeeklyItemRow = {
  id: string;
  nazev: string;
  popis: string | null;
  cena: number | string | null;
  aktivni: boolean;
  poradi: number;
  podskupina: string | null;
  alergeny: number[] | null;
  menu_id: string | null;
};

type WeeklyMenu = {
  id: string;
  nazev: string;
  plati_od: string | null;
  plati_do: string | null;
  poznamka: string;
  zverejneno: boolean;
};

const LEGACY = "__legacy";

const STATUS_LABEL: Record<MenuStatus, string> = {
  aktualni: "Aktuální",
  naplanovane: "Naplánované",
  koncept: "Koncept",
  archiv: "Archiv",
};
const STATUS_CLASS: Record<MenuStatus, string> = {
  aktualni: "bg-primary text-primary-foreground",
  naplanovane: "bg-secondary text-secondary-foreground",
  koncept: "bg-muted text-muted-foreground",
  archiv: "border border-border text-muted-foreground",
};

export function WeeklyMenuAdmin({
  rows,
  onEdit,
  onNew,
  onToggle,
  onRemove,
  reloadItems,
}: {
  rows: WeeklyItemRow[];
  onEdit: (row: WeeklyItemRow) => void;
  onNew: (day: string, course: string, menuId: string | null) => void;
  onToggle: (row: WeeklyItemRow) => void;
  onRemove: (row: WeeklyItemRow) => void;
  reloadItems: () => Promise<void>;
}) {
  const [menus, setMenus] = useState<WeeklyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const today = pragueToday();

  const loadMenus = useCallback(async () => {
    const { data, error } = await supabase
      .from("tydenni_menu")
      .select("id, nazev, plati_od, plati_do, poznamka, zverejneno")
      .order("plati_od", { ascending: false, nullsFirst: true });
    setLoading(false);
    if (error) {
      toast.error("Načtení týdenních menu se nepodařilo.");
      return;
    }
    setMenus((data ?? []) as WeeklyMenu[]);
  }, []);

  useEffect(() => {
    void loadMenus();
  }, [loadMenus]);

  const legacyCount = rows.filter((r) => r.menu_id === null).length;

  async function createMenu() {
    const { data, error } = await supabase
      .from("tydenni_menu")
      .insert({ nazev: "", zverejneno: false })
      .select("id")
      .single();
    if (error || !data) {
      toast.error("Vytvoření menu se nepodařilo.");
      return;
    }
    await loadMenus();
    setSelected(data.id);
  }

  async function duplicate(menu: WeeklyMenu) {
    const { data, error } = await supabase.rpc("duplicate_weekly_menu", { _menu_id: menu.id });
    if (error || !data) {
      toast.error("Kopírování menu se nepodařilo.");
      return;
    }
    toast.success("Vytvořen nový koncept z vybraného menu. Nastav mu data platnosti.");
    await Promise.all([loadMenus(), reloadItems()]);
    setSelected(data as string);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (selected) {
    const menu = menus.find((m) => m.id === selected) ?? null;
    const menuRows = rows.filter((r) =>
      selected === LEGACY ? r.menu_id === null : r.menu_id === selected,
    );
    return (
      <MenuDetail
        key={selected}
        menu={menu}
        rows={menuRows}
        today={today}
        onBack={() => setSelected(null)}
        onSaved={loadMenus}
        onEdit={onEdit}
        onNew={(day, course) => onNew(day, course, menu?.id ?? null)}
        onToggle={onToggle}
        onRemove={onRemove}
        reloadItems={reloadItems}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => void createMenu()}>
          <Plus className="mr-2 h-4 w-4" /> Nové menu
        </Button>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/40 py-3">
          <CardTitle className="text-base">Týdenní menu</CardTitle>
          <p className="text-xs text-muted-foreground">
            Na webu se zobrazí jen zveřejněné menu v době své platnosti (čas Europe/Prague). Stará
            menu zůstávají v archivu.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {legacyCount > 0 && (
              <li className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-[12rem] flex-1">
                  <p className="font-medium text-foreground">Původní jídla (bez přiřazeného menu)</p>
                  <p className="text-xs text-muted-foreground">
                    {legacyCount} jídel · na webu se zobrazují, dokud neplatí žádné nové menu
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelected(LEGACY)}>
                  <Pencil className="mr-2 h-4 w-4" /> Otevřít
                </Button>
              </li>
            )}
            {menus.length === 0 && legacyCount === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                Zatím žádné menu.
              </li>
            )}
            {menus.map((m) => {
              const st = menuStatus(m, today);
              const count = rows.filter((r) => r.menu_id === m.id && r.aktivni).length;
              return (
                <li key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide ${STATUS_CLASS[st]}`}
                  >
                    {STATUS_LABEL[st]}
                  </span>
                  <div className="min-w-[12rem] flex-1">
                    <p className="font-medium text-foreground">{m.nazev || "Týdenní menu"}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCzDate(m.plati_od)} – {formatCzDate(m.plati_do)} · {count} jídel
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void duplicate(m)}>
                    <Copy className="mr-2 h-4 w-4" /> Použít jako nové
                  </Button>
                  <Button size="sm" onClick={() => setSelected(m.id)}>
                    <Pencil className="mr-2 h-4 w-4" /> Upravit
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function MenuDetail({
  menu,
  rows,
  today,
  onBack,
  onSaved,
  onEdit,
  onNew,
  onToggle,
  onRemove,
  reloadItems,
}: {
  menu: WeeklyMenu | null;
  rows: WeeklyItemRow[];
  today: string;
  onBack: () => void;
  onSaved: () => Promise<void>;
  onEdit: (row: WeeklyItemRow) => void;
  onNew: (day: string, course: string) => void;
  onToggle: (row: WeeklyItemRow) => void;
  onRemove: (row: WeeklyItemRow) => void;
  reloadItems: () => Promise<void>;
}) {
  const [draft, setDraft] = useState<WeeklyMenu | null>(menu);
  const [saving, setSaving] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [copyFrom, setCopyFrom] = useState<string | null>(null);

  async function save() {
    if (!draft) return;
    if (draft.plati_od && draft.plati_do && draft.plati_do < draft.plati_od) {
      toast.error("Datum DO nesmí být před datem OD.");
      return;
    }
    if (draft.zverejneno && (!draft.plati_od || !draft.plati_do)) {
      toast.error("Pro zveřejnění vyplň datum OD i DO.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("tydenni_menu")
      .update({
        nazev: draft.nazev.trim(),
        plati_od: draft.plati_od || null,
        plati_do: draft.plati_do || null,
        poznamka: draft.poznamka.trim(),
        zverejneno: draft.zverejneno,
      })
      .eq("id", draft.id);
    setSaving(false);
    if (error) {
      const msg = error.message.includes("PREKRYV")
        ? error.message.replace(/^.*PREKRYV:\s*/, "")
        : "Uložení se nepodařilo.";
      toast.error(msg);
      return;
    }
    toast.success("Menu uloženo.");
    await onSaved();
  }

  const status = draft ? menuStatus(draft, today) : null;

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Zpět na seznam
      </Button>

      {draft ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border py-3">
            <CardTitle className="text-base">Nastavení menu</CardTitle>
            {status && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide ${STATUS_CLASS[status]}`}
              >
                {STATUS_LABEL[status]}
              </span>
            )}
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="wm-nazev">Název (volitelný)</Label>
              <Input
                id="wm-nazev"
                value={draft.nazev}
                placeholder="Týdenní menu 12.–16. 10. 2026"
                onChange={(e) => setDraft({ ...draft, nazev: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wm-od">Platí od *</Label>
              <Input
                id="wm-od"
                type="date"
                value={draft.plati_od ?? ""}
                onChange={(e) => setDraft({ ...draft, plati_od: e.target.value || null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wm-do">Platí do *</Label>
              <Input
                id="wm-do"
                type="date"
                value={draft.plati_do ?? ""}
                onChange={(e) => setDraft({ ...draft, plati_do: e.target.value || null })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="wm-pozn">Poznámka (zobrazí se nad jídly)</Label>
              <Textarea
                id="wm-pozn"
                rows={2}
                value={draft.poznamka}
                placeholder="Když zůstane prázdná, zobrazí se „Platí od … do …“"
                onChange={(e) => setDraft({ ...draft, poznamka: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between gap-3 sm:col-span-2">
              <Label htmlFor="wm-pub">Zveřejnit (na webu se zobrazí jen v době platnosti)</Label>
              <Switch
                id="wm-pub"
                checked={draft.zverejneno}
                onCheckedChange={(v) => setDraft({ ...draft, zverejneno: v })}
              />
            </div>
            <div className="flex justify-end sm:col-span-2">
              <Button onClick={() => void save()} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Uložit menu
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4 text-sm text-muted-foreground">
            Původní jídla bez přiřazeného menu. Na webu se zobrazují jen tehdy, když neplatí žádné
            zveřejněné menu.
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-end gap-2">
        <Switch id="wm-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
        <Label htmlFor="wm-inactive" className="text-sm text-muted-foreground">
          Zobrazit neaktivní jídla
        </Label>
      </div>

      {WEEKLY_DAYS.map((d) => {
        const dayRows = rows.filter((r) => parseWeeklySubgroup(r.podskupina).day === d.id);
        const visible = dayRows.filter((r) => showInactive || r.aktivni);
        const soups = visible
          .filter((r) => parseWeeklySubgroup(r.podskupina).course === "polevka")
          .sort((a, b) => a.poradi - b.poradi);
        const mains = visible
          .filter((r) => parseWeeklySubgroup(r.podskupina).course !== "polevka")
          .sort((a, b) => a.poradi - b.poradi);
        const activeCount = dayRows.filter((r) => r.aktivni).length;
        return (
          <Card key={d.id} className="overflow-hidden">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 py-3">
              <CardTitle className="font-display text-lg">{d.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onNew(d.id, "polevka")}>
                  <Plus className="mr-1 h-4 w-4" /> Polévka
                </Button>
                <Button variant="outline" size="sm" onClick={() => onNew(d.id, "hlavni")}>
                  <Plus className="mr-1 h-4 w-4" /> Hlavní jídlo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeCount === 0 || !menu}
                  title={!menu ? "Kopírování je dostupné v menu s nastaveným obdobím" : undefined}
                  onClick={() => setCopyFrom(d.id)}
                >
                  <Copy className="mr-1 h-4 w-4" /> Kopírovat den…
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-0 pb-2">
              {soups.length === 0 && mains.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">Žádná jídla.</p>
              ) : (
                <>
                  <CourseList title="Polévka" items={soups} {...{ onEdit, onToggle, onRemove }} />
                  <CourseList title="Hlavní jídla" items={mains} {...{ onEdit, onToggle, onRemove }} />
                </>
              )}
            </CardContent>
          </Card>
        );
      })}

      {copyFrom && menu && (
        <CopyDayDialog
          menuId={menu.id}
          from={copyFrom}
          rows={rows}
          onClose={() => setCopyFrom(null)}
          onDone={reloadItems}
        />
      )}
    </div>
  );
}

function CourseList({
  title,
  items,
  onEdit,
  onToggle,
  onRemove,
}: {
  title: string;
  items: WeeklyItemRow[];
  onEdit: (row: WeeklyItemRow) => void;
  onToggle: (row: WeeklyItemRow) => void;
  onRemove: (row: WeeklyItemRow) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
        {title}
      </p>
      <ul className="divide-y divide-border">
        {items.map((row) => (
          <li
            key={row.id}
            className={`flex flex-wrap items-center gap-3 px-4 py-2.5 ${row.aktivni ? "" : "opacity-50"}`}
          >
            <div className="min-w-[12rem] flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{row.nazev}</span>
                {(row.alergeny ?? []).length > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    alergeny: {(row.alergeny ?? []).join(", ")}
                  </span>
                )}
              </div>
              {row.popis && <p className="text-xs text-muted-foreground">{row.popis}</p>}
            </div>
            <span className="w-20 shrink-0 whitespace-nowrap text-sm text-foreground">
              {row.cena === null ? "—" : `${row.cena} Kč`}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <Switch
                checked={row.aktivni}
                onCheckedChange={() => onToggle(row)}
                aria-label="Aktivní"
              />
              <Button variant="outline" size="icon" aria-label="Upravit" onClick={() => onEdit(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Smazat" onClick={() => onRemove(row)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CopyDayDialog({
  menuId,
  from,
  rows,
  onClose,
  onDone,
}: {
  menuId: string;
  from: string;
  rows: WeeklyItemRow[];
  onClose: () => void;
  onDone: () => Promise<void>;
}) {
  const others = WEEKLY_DAYS.filter((d) => d.id !== from);
  const [targets, setTargets] = useState<string[]>(others.map((d) => d.id));
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const fromTitle = WEEKLY_DAYS.find((d) => d.id === from)?.title ?? from;

  const occupied = useMemo(
    () =>
      targets.filter((t) =>
        rows.some((r) => r.aktivni && parseWeeklySubgroup(r.podskupina).day === t),
      ),
    [targets, rows],
  );

  async function run() {
    setBusy(true);
    const { data, error } = await supabase.rpc("copy_weekly_day", {
      _menu_id: menuId,
      _from: from,
      _to: targets,
    });
    setBusy(false);
    if (error) {
      toast.error("Kopírování se nepodařilo.");
      return;
    }
    toast.success(`Zkopírováno ${data ?? 0} jídel.`);
    await onDone();
    onClose();
  }

  function submit() {
    if (targets.length === 0) {
      toast.error("Vyber alespoň jeden cílový den.");
      return;
    }
    if (occupied.length > 0) setConfirming(true);
    else void run();
  }

  const title = (id: string) => WEEKLY_DAYS.find((d) => d.id === id)?.title ?? id;

  return (
    <AlertDialog open onOpenChange={(o) => !o && !busy && onClose()}>
      <AlertDialogContent>
        {!confirming ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Kopírovat {fromTitle.toLowerCase()}</AlertDialogTitle>
              <AlertDialogDescription>
                Zkopírují se všechna aktivní jídla včetně popisu, ceny, alergenů a pořadí. Kopie
                budou nezávislé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTargets(others.map((d) => d.id))}
                >
                  Všechny ostatní dny
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setTargets([])}>
                  Zrušit výběr
                </Button>
              </div>
              {others.map((d) => (
                <label key={d.id} className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={targets.includes(d.id)}
                    onCheckedChange={(v) =>
                      setTargets(
                        v ? [...targets, d.id] : targets.filter((t) => t !== d.id),
                      )
                    }
                  />
                  {d.title}
                  {rows.some((r) => r.aktivni && parseWeeklySubgroup(r.podskupina).day === d.id) && (
                    <span className="text-xs text-muted-foreground">(obsahuje jídla)</span>
                  )}
                </label>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Zrušit</AlertDialogCancel>
              <Button onClick={submit} disabled={busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kopírovat
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Nahradit stávající jídla?</AlertDialogTitle>
              <AlertDialogDescription>
                Tyto dny už obsahují jídla: {occupied.map(title).join(", ")}. Stávající jídla se
                deaktivují (nesmažou se) a nahradí je kopie z dne {fromTitle.toLowerCase()}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Zrušit</AlertDialogCancel>
              <AlertDialogAction
                disabled={busy}
                onClick={(e) => {
                  e.preventDefault();
                  void run();
                }}
              >
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Nahradit
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
