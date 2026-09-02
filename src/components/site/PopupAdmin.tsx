import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  POPUP_BUCKET,
  isPopupVisible,
  resolvePopupImage,
  savePopupSettings,
  usePopupSettings,
} from "@/hooks/usePopup";

/** Administrace vyskakovacího okna – nastavení, obrázek a náhled. */
export function PopupAdmin() {
  const { settings, setSettings, loading, reload } = usePopupSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    void resolvePopupImage(settings.obrazek).then((url) => {
      if (active) setPreview(url);
    });
    return () => {
      active = false;
    };
  }, [settings.obrazek]);

  const set = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `popup-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(POPUP_BUCKET).upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast.error("Nahrání obrázku se nepodařilo.");
      return;
    }
    set("obrazek", path);
    toast.success("Obrázek nahrán. Nezapomeňte uložit změny.");
  }

  async function save() {
    setSaving(true);
    const { error } = await savePopupSettings({
      ...settings,
      nadpis: settings.nadpis.trim(),
      tlacitko_text: settings.tlacitko_text.trim(),
      tlacitko_odkaz: settings.tlacitko_odkaz.trim(),
      datum_od: settings.datum_od || null,
      datum_do: settings.datum_do || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Uložení se nepodařilo.");
      return;
    }
    toast.success("Nastavení popupu uloženo.");
    void reload();
  }

  const showsButton = !!settings.tlacitko_text.trim() && !!settings.tlacitko_odkaz.trim();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Vyskakovací okno</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div>
            <Label htmlFor="popup-aktivni">Aktivace</Label>
            <p className="text-xs text-muted-foreground">
              {settings.aktivni ? "Aktivní" : "Neaktivní"}
              {settings.aktivni && !isPopupVisible(settings) && " – mimo nastavené období nebo bez obsahu"}
            </p>
          </div>
          <Switch
            id="popup-aktivni"
            checked={settings.aktivni}
            disabled={loading}
            onCheckedChange={(v) => set("aktivni", v)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="popup-od">Zobrazovat od</Label>
            <Input
              id="popup-od"
              type="date"
              value={settings.datum_od ?? ""}
              disabled={loading}
              onChange={(e) => set("datum_od", e.target.value || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="popup-do">Zobrazovat do</Label>
            <Input
              id="popup-do"
              type="date"
              value={settings.datum_do ?? ""}
              disabled={loading}
              onChange={(e) => set("datum_do", e.target.value || null)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="popup-nadpis">Nadpis</Label>
          <Input
            id="popup-nadpis"
            value={settings.nadpis}
            placeholder="PODZIMNÍ MENU"
            disabled={loading}
            onChange={(e) => set("nadpis", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="popup-text">Text</Label>
          <Textarea
            id="popup-text"
            rows={5}
            value={settings.text}
            disabled={loading}
            onChange={(e) => set("text", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Obrázek</Label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
                e.target.value = "";
              }}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {settings.obrazek ? "Změnit obrázek" : "Nahrát obrázek"}
            </Button>
            {settings.obrazek && (
              <Button variant="ghost" onClick={() => set("obrazek", null)}>
                <Trash2 className="mr-2 h-4 w-4" /> Odstranit obrázek
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="popup-btn-text">Text tlačítka (volitelné)</Label>
            <Input
              id="popup-btn-text"
              value={settings.tlacitko_text}
              disabled={loading}
              onChange={(e) => set("tlacitko_text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="popup-btn-link">Odkaz tlačítka (volitelné)</Label>
            <Input
              id="popup-btn-link"
              value={settings.tlacitko_odkaz}
              placeholder="/menu nebo https://…"
              disabled={loading}
              onChange={(e) => set("tlacitko_odkaz", e.target.value)}
            />
          </div>
        </div>

        {/* NÁHLED */}
        <div className="space-y-3">
          <Label>Náhled</Label>
          <div className="flex justify-center rounded-md bg-ink/70 p-6">
            <div className="relative w-full max-w-sm rounded-xl bg-cream p-6 text-center">
              <span className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground">
                <X className="size-4" />
              </span>
              {settings.nadpis.trim() && (
                <h3 className="mt-2 font-display text-2xl text-foreground">{settings.nadpis}</h3>
              )}
              {settings.text.trim() && (
                <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{settings.text}</p>
              )}
              {preview && (
                <img
                  src={preview}
                  alt="Náhled obrázku popupu"
                  className="mt-4 max-h-52 w-full rounded-sm object-cover"
                />
              )}
              {showsButton && <span className="btn-primary mt-5 inline-flex">{settings.tlacitko_text}</span>}
              {!settings.nadpis.trim() && !settings.text.trim() && !preview && (
                <p className="text-sm text-muted-foreground">Popup zatím nemá žádný obsah.</p>
              )}
            </div>
          </div>
        </div>

        <Button onClick={() => void save()} disabled={saving || loading}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Uložit změny
        </Button>
      </CardContent>
    </Card>
  );
}
