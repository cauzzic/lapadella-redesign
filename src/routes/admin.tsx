import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createFileRoute } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  KNOWN_SECTION_IDS,
  FOOD_SECTIONS,
  DRINK_SECTIONS,
  WEEKLY_DAYS,
  SPECIAL_SUBGROUPS,
  WEEKLY_COURSES,
  buildWeeklySubgroup,
  parseWeeklySubgroup,
} from "@/data/menuSections";
import { ALLERGENS } from "@/data/allergens";
import { MenuPeriodEditor } from "@/components/site/MenuPeriodEditor";
import { PopupAdmin } from "@/components/site/PopupAdmin";
import { SETTING_WEEKLY_PERIOD, SETTING_SPECIAL_PERIOD } from "@/hooks/useMenuSetting";
import { LayoutDashboard, Loader2, LogOut, Pencil, Plus, Search, Trash2, X } from "lucide-react";

const FOOD_SECTION_IDS = FOOD_SECTIONS.map((s) => s.id);
const DRINK_SECTION_IDS = DRINK_SECTIONS.map((s) => s.id);

/** Pořadí sekcí v administraci = stejné jako na veřejném webu. */
const SECTION_ORDER = KNOWN_SECTION_IDS;
const sectionRank = (id: string) => {
  const i = SECTION_ORDER.indexOf(id);
  return i === -1 ? SECTION_ORDER.length : i;
};


/** Záložky administrace – každá sekce má vlastní obsah a nastavení. */
const TABS = [
  { id: "menu", label: "Menu", hint: "Jídla podle kategorií" },
  { id: "napoje", label: "Nápoje", hint: "Nápojová karta" },
  { id: "tydenni", label: "Týdenní menu", hint: "Obědové menu Po–Pá" },
  { id: "specialni", label: "Speciální menu", hint: "Sezónní a speciální nabídka" },
  { id: "popup", label: "Vyskakovací okno", hint: "Oznámení na webu" },
  { id: "users", label: "Uživatelé", hint: "Role a oprávnění", ownerOnly: true },
] as const;

type TabId = (typeof TABS)[number]["id"];


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrace menu | La Padella" },
      { name: "description", content: "Zabezpečená administrace položek menu restaurace La Padella." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type MenuRow = {
  id: string;
  sekce: string;
  nazev: string;
  popis: string | null;
  cena: number | string | null;
  obrazek: string | null;
  aktivni: boolean;
  poradi: number;
  podskupina: string | null;
  alergeny: number[] | null;
};

/** Nabídka podskupin podle sekce (den u týdenního, podkategorie u speciálního menu). */
function subgroupOptions(sekce: string): { id: string; title: string }[] {
  if (sekce === "tydenni") return WEEKLY_DAYS;
  if (sekce === "specialni") return SPECIAL_SUBGROUPS;
  return [];
}

type FormState = {
  id: string | null;
  sekce: string;
  nazev: string;
  popis: string;
  cena: string;
  obrazek: string;
  aktivni: boolean;
  poradi: string;
  podskupina: string;
  cast: string;
  alergeny: number[];
};

const emptyForm: FormState = {
  id: null,
  sekce: "",
  nazev: "",
  popis: "",
  cena: "",
  obrazek: "",
  aktivni: true,
  poradi: "0",
  podskupina: "",
  cast: "",
  alergeny: [],
};

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthChecked(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkRole = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setIsAdmin(false);
      setIsOwner(false);
      setRoleChecked(true);
      return;
    }
    await supabase.rpc("ensure_user_role");
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const roles = (data ?? []).map((r) => r.role as string);
    setIsOwner(roles.includes("owner"));
    setIsAdmin(roles.includes("owner") || roles.includes("admin"));
    setRoleChecked(true);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!session) {
      setIsAdmin(false);
      setIsOwner(false);
      setRoleChecked(true);
      return;
    }
    setRoleChecked(false);
    void checkRole();
  }, [authChecked, session, checkRole]);

  if (!authChecked) return <CenteredSpinner />;

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster />
      {!session ? (
        <div className="px-4 py-16">
          <AuthCard />
        </div>
      ) : !roleChecked ? (
        <CenteredSpinner />
      ) : isAdmin ? (
        <MenuAdmin email={session.user.email ?? ""} isOwner={isOwner} />
      ) : (
        <div className="px-4 py-16">
          <NoAccessCard email={session.user.email ?? ""} />
        </div>
      )}
    </div>
  );
}



function CenteredSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function AuthCard() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo("Registrace přijata – potvrď prosím e-mail odkazem, který jsme poslali.");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Přihlášení se nepodařilo.";
      setInfo(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === "signin" ? "Přihlášení do administrace" : "Registrace administrátora"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Heslo</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {info && <p className="text-sm text-muted-foreground">{info}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Přihlásit se" : "Zaregistrovat"}
          </Button>
          <button
            type="button"
            className="w-full text-sm text-muted-foreground underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setInfo(null);
            }}
          >
            {mode === "signin" ? "Nemám účet – zaregistrovat" : "Už mám účet – přihlásit se"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

function NoAccessCard({ email }: { email: string }) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Nemáš přístup k administraci</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Přihlášen jako <strong>{email}</strong>. Tento účet má roli běžného uživatele – přístup do
          administrace ti může přidělit pouze vlastník webu.
        </p>
        <Button variant="outline" className="w-full" onClick={() => void supabase.auth.signOut()}>
          <LogOut className="mr-2 h-4 w-4" /> Odhlásit se
        </Button>
      </CardContent>
    </Card>
  );
}

type UserRow = { user_id: string; email: string; role: string };

function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_users");
    setLoading(false);
    if (error) {
      toast.error("Načtení uživatelů se nepodařilo.");
      return;
    }
    setUsers((data ?? []) as UserRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setAdmin(row: UserRow, isAdmin: boolean) {
    setBusyId(row.user_id);
    const { error } = await supabase.rpc("set_admin", { _user_id: row.user_id, _is_admin: isAdmin });
    setBusyId(null);
    if (error) {
      toast.error(`Změna role se nepodařila: ${error.message}`);
      return;
    }
    toast.success(isAdmin ? "Role admin přidělena." : "Role admin odebrána.");
    await load();
  }

  const roleLabel: Record<string, string> = {
    owner: "Vlastník",
    admin: "Administrátor",
    user: "Uživatel",
  };

  return (
    <Card>
      <CardHeader className="border-b border-border py-3">
        <CardTitle className="text-base">Uživatelé a role</CardTitle>
        <p className="text-xs text-muted-foreground">
          Pouze vlastník může přidělovat a odebírat administrátorská oprávnění.
        </p>
      </CardHeader>
      {loading ? (
        <CenteredSpinner />
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">E-mail</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="border-t border-border">
                  <td className="p-3 text-foreground">{u.email}</td>
                  <td className="p-3 text-muted-foreground">{roleLabel[u.role] ?? u.role}</td>
                  <td className="p-3">
                    <div className="flex justify-end">
                      {u.role === "owner" ? (
                        <span className="text-xs text-muted-foreground">Nelze změnit</span>
                      ) : u.role === "admin" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busyId === u.user_id}
                          onClick={() => void setAdmin(u, false)}
                        >
                          {busyId === u.user_id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Odebrat admina
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled={busyId === u.user_id}
                          onClick={() => void setAdmin(u, true)}
                        >
                          {busyId === u.user_id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Povýšit na admina
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MenuAdmin({ email, isOwner }: { email: string; isOwner: boolean }) {
  const [rows, setRows] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<TabId>("menu");


  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_polozky")
      .select("id, sekce, nazev, popis, cena, obrazek, aktivni, poradi, podskupina, alergeny")
      .order("sekce", { ascending: true })
      .order("poradi", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Načtení položek se nepodařilo.");
      return;
    }
    setRows((data ?? []) as MenuRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const sections = useMemo(() => {
    const all = Array.from(new Set([...KNOWN_SECTION_IDS, ...rows.map((r) => r.sekce)]));
    return all.sort((a, b) => sectionRank(a) - sectionRank(b));
  }, [rows]);

  const visible = useMemo(() => {
    let result = rows;
    if (tab === "menu") {
      result = result.filter((r) => FOOD_SECTION_IDS.includes(r.sekce));
    } else if (tab === "napoje") {
      result = result.filter((r) => DRINK_SECTION_IDS.includes(r.sekce));
    } else if (tab === "tydenni") {
      result = result.filter((r) => r.sekce === "tydenni");
    } else if (tab === "specialni") {
      result = result.filter((r) => r.sekce === "specialni");
    }

    const q = filter.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (r) => r.nazev.toLowerCase().includes(q) || r.sekce.toLowerCase().includes(q),
      );
    }
    return [...result].sort(
      (a, b) => sectionRank(a.sekce) - sectionRank(b.sekce) || (a.poradi ?? 0) - (b.poradi ?? 0),
    );
  }, [rows, tab, filter]);

  /** Položky rozdělené do skupin podle aktivní záložky (kategorie / den / podkategorie). */
  const groups = useMemo(() => {
    if (tab === "tydenni") {
      return WEEKLY_DAYS.map((d) => ({
        id: d.id,
        title: d.title,
        items: visible
          .filter((r) => parseWeeklySubgroup(r.podskupina).day === d.id)
          .sort(
            (a, b) =>
              (parseWeeklySubgroup(a.podskupina).course === "polevka" ? 0 : 1) -
                (parseWeeklySubgroup(b.podskupina).course === "polevka" ? 0 : 1) ||
              (a.poradi ?? 0) - (b.poradi ?? 0),
          ),
      })).concat([
        {
          id: "_none",
          title: "Bez dne",
          items: visible.filter(
            (r) => !WEEKLY_DAYS.some((d) => d.id === parseWeeklySubgroup(r.podskupina).day),
          ),
        },
      ]);
    }
    if (tab === "specialni") {
      return SPECIAL_SUBGROUPS.map((s) => ({
        id: s.id,
        title: s.title,
        items: visible.filter((r) => r.podskupina === s.id),
      })).concat([
        {
          id: "_none",
          title: "Bez podkategorie",
          items: visible.filter((r) => !SPECIAL_SUBGROUPS.some((s) => s.id === r.podskupina)),
        },
      ]);
    }
    const meta = tab === "napoje" ? DRINK_SECTIONS : FOOD_SECTIONS;
    return meta
      .map((s) => ({ id: s.id, title: s.title, items: visible.filter((r) => r.sekce === s.id) }))
      .concat([
        {
          id: "_other",
          title: "Ostatní",
          items: visible.filter((r) => !meta.some((s) => s.id === r.sekce)),
        },
      ]);
  }, [visible, tab]);

  const counts = useMemo(
    () => ({
      menu: rows.filter((r) => FOOD_SECTION_IDS.includes(r.sekce)).length,
      napoje: rows.filter((r) => DRINK_SECTION_IDS.includes(r.sekce)).length,
      tydenni: rows.filter((r) => r.sekce === "tydenni").length,
      specialni: rows.filter((r) => r.sekce === "specialni").length,
    }),
    [rows],
  );

  const isItemsTab = tab === "menu" || tab === "napoje" || tab === "tydenni" || tab === "specialni";

  function openNew() {
    if (tab === "tydenni") {
      setForm({
        ...emptyForm,
        sekce: "tydenni",
        podskupina: WEEKLY_DAYS[0]!.id,
        cast: WEEKLY_COURSES[1]!.id,
      });
      return;
    }
    if (tab === "specialni") {
      setForm({ ...emptyForm, sekce: "specialni", podskupina: SPECIAL_SUBGROUPS[0]!.id });
      return;
    }
    const first = tab === "napoje" ? DRINK_SECTIONS[0]!.id : FOOD_SECTIONS[0]!.id;
    setForm({ ...emptyForm, sekce: first });
  }

  function editRow(row: MenuRow) {
    setForm({
      id: row.id,
      sekce: row.sekce,
      nazev: row.nazev,
      popis: row.popis ?? "",
      cena: row.cena === null ? "" : String(row.cena),
      obrazek: row.obrazek ?? "",
      aktivni: row.aktivni,
      poradi: String(row.poradi),
      podskupina:
        row.sekce === "tydenni" ? parseWeeklySubgroup(row.podskupina).day : (row.podskupina ?? ""),
      cast: row.sekce === "tydenni" ? parseWeeklySubgroup(row.podskupina).course : "",
      alergeny: (row.alergeny ?? []).map(Number),
    });
  }



  async function save() {
    if (!form) return;
    if (!form.sekce.trim() || !form.nazev.trim()) {
      toast.error("Sekce a název jsou povinné.");
      return;
    }
    if (form.sekce.trim() === "tydenni" && (!form.podskupina || !form.cast)) {
      toast.error("U týdenního menu vyber den i typ položky.");
      return;
    }
    setSaving(true);
    const payload = {
      sekce: form.sekce.trim(),
      nazev: form.nazev.trim(),
      popis: form.popis.trim() ? form.popis.trim() : null,
      cena: form.cena.trim() ? Number(form.cena.replace(",", ".")) : null,
      obrazek: form.obrazek.trim() ? form.obrazek.trim() : null,
      aktivni: form.aktivni,
      poradi: Number(form.poradi) || 0,
      podskupina:
        form.sekce.trim() === "tydenni"
          ? buildWeeklySubgroup(form.podskupina, form.cast) || null
          : subgroupOptions(form.sekce.trim()).length > 0 && form.podskupina
            ? form.podskupina
            : null,
      alergeny: [...form.alergeny].sort((a, b) => a - b),
    };
    const { error } = form.id
      ? await supabase.from("menu_polozky").update(payload).eq("id", form.id)
      : await supabase.from("menu_polozky").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(`Uložení se nepodařilo: ${error.message}`);
      return;
    }
    toast.success(form.id ? "Položka upravena." : "Položka přidána.");
    setForm(null);
    await load();
  }

  async function remove(row: MenuRow) {
    if (!window.confirm(`Smazat položku „${row.nazev}“?`)) return;
    const { error } = await supabase.from("menu_polozky").delete().eq("id", row.id);
    if (error) {
      toast.error("Smazání se nepodařilo.");
      return;
    }
    toast.success("Položka smazána.");
    await load();
  }

  async function toggleActive(row: MenuRow) {
    const { error } = await supabase
      .from("menu_polozky")
      .update({ aktivni: !row.aktivni })
      .eq("id", row.id);
    if (error) {
      toast.error("Změna se nepodařila.");
      return;
    }
    await load();
  }

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="pb-16">
      {/* HLAVIČKA */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl leading-tight text-foreground">Administrace</h1>
              <p className="text-xs text-muted-foreground">La Padella</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm text-foreground">{email}</p>
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] uppercase tracking-wide text-secondary-foreground">
                {isOwner ? "Vlastník" : "Administrátor"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => void supabase.auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Odhlásit
            </Button>
          </div>
        </div>
        {/* ZÁLOŽKY */}
        <nav className="mx-auto w-full max-w-6xl overflow-x-auto px-4">
          <div className="flex gap-1 pb-1">
            {TABS.filter((t) => !("ownerOnly" in t && t.ownerOnly) || isOwner).map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setFilter("");
                  }}
                  className={`relative whitespace-nowrap rounded-t-md px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {t.id in counts && (
                    <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {counts[t.id as keyof typeof counts]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{activeTab.label}</h2>
            <p className="text-sm text-muted-foreground">{activeTab.hint}</p>
          </div>
          {isItemsTab && (
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Přidat položku
            </Button>
          )}
        </div>

        {tab === "tydenni" && (
          <MenuPeriodEditor
            settingKey={SETTING_WEEKLY_PERIOD}
            title="Období týdenního menu"
            placeholder="PONDĚLÍ 31.08.2026 - PÁTEK 04.09.2026"
          />
        )}
        {tab === "specialni" && (
          <MenuPeriodEditor
            settingKey={SETTING_SPECIAL_PERIOD}
            title="Období speciálního menu"
            placeholder="PLATÍ OD 01.09.2026 - DO 30.09.2026"
          />
        )}

        {tab === "popup" && <PopupAdmin />}
        {tab === "users" && isOwner && <UsersAdmin />}

        {isItemsTab && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative max-w-sm flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Hledat podle názvu…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              {filter.trim() !== "" && (
                <Button variant="ghost" size="sm" onClick={() => setFilter("")}>
                  Zrušit hledání
                </Button>
              )}
              <span className="text-sm text-muted-foreground">{visible.length} položek</span>
            </div>

            {loading ? (
              <CenteredSpinner />
            ) : visible.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                  Žádné položky.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {groups
                  .filter((g) => g.items.length > 0)
                  .map((g) => (
                    <Card key={g.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border bg-muted/40 py-3">
                        <CardTitle className="text-base">{g.title}</CardTitle>
                        <span className="text-xs text-muted-foreground">{g.items.length} položek</span>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ul className="divide-y divide-border">
                          {g.items.map((row) => {
                            const course =
                              tab === "tydenni"
                                ? WEEKLY_COURSES.find(
                                    (c) => c.id === parseWeeklySubgroup(row.podskupina).course,
                                  )?.title
                                : null;
                            return (
                              <li
                                key={row.id}
                                className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-muted/30"
                              >
                                <span className="w-10 shrink-0 text-xs text-muted-foreground">
                                  #{row.poradi}
                                </span>
                                <div className="min-w-[12rem] flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium text-foreground">{row.nazev}</span>
                                    {course && (
                                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                                        {course}
                                      </span>
                                    )}
                                    {(row.alergeny ?? []).length > 0 && (
                                      <span className="text-[11px] text-muted-foreground">
                                        alergeny: {(row.alergeny ?? []).join(", ")}
                                      </span>
                                    )}
                                  </div>
                                  {row.popis && (
                                    <p className="text-xs text-muted-foreground">{row.popis}</p>
                                  )}
                                </div>
                                <span className="w-20 shrink-0 whitespace-nowrap text-sm text-foreground">
                                  {row.cena === null ? "—" : `${row.cena} Kč`}
                                </span>
                                <div className="flex shrink-0 items-center gap-2">
                                  <Switch
                                    checked={row.aktivni}
                                    onCheckedChange={() => void toggleActive(row)}
                                    aria-label="Aktivní"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Upravit"
                                    onClick={() => editRow(row)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Smazat"
                                    onClick={() => void remove(row)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* FORMULÁŘ POLOŽKY */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 py-10">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border">
              <CardTitle>{form.id ? "Upravit položku" : "Nová položka"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setForm(null)} aria-label="Zavřít">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sekce">Sekce</Label>
                <Input
                  id="sekce"
                  list="sekce-list"
                  value={form.sekce}
                  onChange={(e) => setForm({ ...form, sekce: e.target.value })}
                />
                <datalist id="sekce-list">
                  {sections.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nazev">Název</Label>
                <Input
                  id="nazev"
                  value={form.nazev}
                  onChange={(e) => setForm({ ...form, nazev: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="popis">Popis</Label>
                <Textarea
                  id="popis"
                  rows={2}
                  value={form.popis}
                  onChange={(e) => setForm({ ...form, popis: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cena">Cena (Kč)</Label>
                <Input
                  id="cena"
                  inputMode="decimal"
                  value={form.cena}
                  onChange={(e) => setForm({ ...form, cena: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poradi">Pořadí</Label>
                <Input
                  id="poradi"
                  type="number"
                  value={form.poradi}
                  onChange={(e) => setForm({ ...form, poradi: e.target.value })}
                />
              </div>
              {subgroupOptions(form.sekce.trim()).length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="podskupina">
                    {form.sekce.trim() === "tydenni" ? "Den" : "Podkategorie"}
                  </Label>
                  <select
                    id="podskupina"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.podskupina}
                    onChange={(e) => setForm({ ...form, podskupina: e.target.value })}
                  >
                    <option value="">— nevybráno —</option>
                    {subgroupOptions(form.sekce.trim()).map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {form.sekce.trim() === "tydenni" && (
                <div className="space-y-2">
                  <Label htmlFor="cast">Typ položky</Label>
                  <select
                    id="cast"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.cast}
                    onChange={(e) => setForm({ ...form, cast: e.target.value })}
                  >
                    <option value="">— nevybráno —</option>
                    {WEEKLY_COURSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-2 sm:col-span-2">
                <Label>Alergeny</Label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map((a) => {
                    const Icon = a.icon;
                    const active = form.alergeny.includes(a.n);
                    return (
                      <button
                        key={a.n}
                        type="button"
                        title={a.cs}
                        aria-pressed={active}
                        onClick={() =>
                          setForm({
                            ...form,
                            alergeny: active
                              ? form.alergeny.filter((n) => n !== a.n)
                              : [...form.alergeny, a.n],
                          })
                        }
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input text-muted-foreground hover:border-primary"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {a.n} · {a.short}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="obrazek">Obrázek (URL)</Label>
                <Input
                  id="obrazek"
                  value={form.obrazek}
                  onChange={(e) => setForm({ ...form, obrazek: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Switch
                  id="aktivni"
                  checked={form.aktivni}
                  onCheckedChange={(v) => setForm({ ...form, aktivni: v })}
                />
                <Label htmlFor="aktivni">Aktivní (zobrazit na webu)</Label>
              </div>
              <div className="flex items-end justify-end gap-2 border-t border-border pt-4 sm:col-span-2">
                <Button variant="outline" onClick={() => setForm(null)}>
                  Zrušit
                </Button>
                <Button onClick={() => void save()} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Uložit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
