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
import { KNOWN_SECTION_IDS, FOOD_SECTIONS, DRINK_SECTIONS } from "@/data/menuSections";
import { Loader2, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";

const FOOD_SECTION_IDS = FOOD_SECTIONS.map((s) => s.id);
const DRINK_SECTION_IDS = DRINK_SECTIONS.map((s) => s.id);

const SECTION_FILTERS = [
  { id: "all", label: "Vše" },
  { id: "menu", label: "Menu" },
  { id: "napoje", label: "Nápoje" },
  { id: "tydenni", label: "Týdenní menu" },
  { id: "specialni", label: "Speciální menu" },
] as const;

type SectionFilterId = (typeof SECTION_FILTERS)[number]["id"];

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
};

type FormState = {
  id: string | null;
  sekce: string;
  nazev: string;
  popis: string;
  cena: string;
  obrazek: string;
  aktivni: boolean;
  poradi: string;
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
    <div className="min-h-[70vh] bg-background px-4 py-16">
      <Toaster />
      <div className="mx-auto w-full max-w-5xl space-y-12">
        {!session ? (
          <AuthCard />
        ) : !roleChecked ? (
          <CenteredSpinner />
        ) : isAdmin ? (
          <>
            <MenuAdmin email={session.user.email ?? ""} isOwner={isOwner} />
            {isOwner && <UsersAdmin />}
          </>
        ) : (
          <NoAccessCard email={session.user.email ?? ""} />
        )}
      </div>
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
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Správa uživatelů</h2>
        <p className="text-sm text-muted-foreground">
          Pouze vlastník může přidělovat a odebírat administrátorská oprávnění.
        </p>
      </div>
      {loading ? (
        <CenteredSpinner />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
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
  const [sectionFilter, setSectionFilter] = useState<SectionFilterId>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_polozky")
      .select("id, sekce, nazev, popis, cena, obrazek, aktivni, poradi")
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
    if (sectionFilter === "menu") {
      result = result.filter((r) => FOOD_SECTION_IDS.includes(r.sekce));
    } else if (sectionFilter === "napoje") {
      result = result.filter((r) => DRINK_SECTION_IDS.includes(r.sekce));
    } else if (sectionFilter === "tydenni") {
      result = result.filter((r) => r.sekce === "tydenni");
    } else if (sectionFilter === "specialni") {
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
  }, [rows, sectionFilter, filter]);


  async function save() {
    if (!form) return;
    if (!form.sekce.trim() || !form.nazev.trim()) {
      toast.error("Sekce a název jsou povinné.");
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Administrace menu</h1>
          <p className="text-sm text-muted-foreground">
            Přihlášen jako {email} ({isOwner ? "vlastník" : "administrátor"}) · {rows.length} položek
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setForm({ ...emptyForm })}>
            <Plus className="mr-2 h-4 w-4" /> Přidat položku
          </Button>
          <Button variant="outline" onClick={() => void supabase.auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Odhlásit
          </Button>
        </div>
      </div>

      {form && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{form.id ? "Upravit položku" : "Nová položka"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setForm(null)} aria-label="Zavřít">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
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
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="obrazek">Obrázek (URL)</Label>
              <Input
                id="obrazek"
                value={form.obrazek}
                onChange={(e) => setForm({ ...form, obrazek: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="aktivni"
                checked={form.aktivni}
                onCheckedChange={(v) => setForm({ ...form, aktivni: v })}
              />
              <Label htmlFor="aktivni">Aktivní (zobrazit na webu)</Label>
            </div>
            <div className="flex items-end justify-end gap-2 sm:col-span-2">
              <Button variant="outline" onClick={() => setForm(null)}>
                Zrušit
              </Button>
              <Button onClick={() => void save()} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Uložit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="max-w-sm flex-1">
          <Input
            placeholder="Hledat podle názvu nebo sekce…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setForm({ ...emptyForm, sekce: "tydenni" })}
          >
            <Plus className="mr-2 h-4 w-4" /> Položka do týdenního
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setForm({ ...emptyForm, sekce: "specialni" })}
          >
            <Plus className="mr-2 h-4 w-4" /> Položka do speciálního
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {SECTION_FILTERS.map((f) => (
          <Button
            key={f.id}
            variant={sectionFilter === f.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSectionFilter(f.id)}
          >
            {f.label}
          </Button>
        ))}
        {(sectionFilter !== "all" || filter.trim() !== "") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSectionFilter("all");
              setFilter("");
            }}
          >
            Zrušit filtr
          </Button>
        )}
      </div>

      {loading ? (
        <CenteredSpinner />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Sekce</th>
                <th className="p-3">Název</th>
                <th className="p-3">Cena</th>
                <th className="p-3">Pořadí</th>
                <th className="p-3">Aktivní</th>
                <th className="p-3 text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="p-3 text-muted-foreground">{row.sekce}</td>
                  <td className="p-3">
                    <div className="font-medium text-foreground">{row.nazev}</div>
                    {row.popis && <div className="text-xs text-muted-foreground">{row.popis}</div>}
                  </td>
                  <td className="p-3 whitespace-nowrap">{row.cena ?? "—"}</td>
                  <td className="p-3">{row.poradi}</td>
                  <td className="p-3">
                    <Switch
                      checked={row.aktivni}
                      onCheckedChange={() => void toggleActive(row)}
                      aria-label="Aktivní"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Upravit"
                        onClick={() =>
                          setForm({
                            id: row.id,
                            sekce: row.sekce,
                            nazev: row.nazev,
                            popis: row.popis ?? "",
                            cena: row.cena === null ? "" : String(row.cena),
                            obrazek: row.obrazek ?? "",
                            aktivni: row.aktivni,
                            poradi: String(row.poradi),
                          })
                        }
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
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    Žádné položky.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
