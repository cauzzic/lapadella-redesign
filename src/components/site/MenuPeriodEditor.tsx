import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenuSetting, saveMenuSetting } from "@/hooks/useMenuSetting";

export function MenuPeriodEditor({
  settingKey,
  title,
  placeholder,
}: {
  settingKey: string;
  title: string;
  placeholder: string;
}) {
  const { value, setValue, loading } = useMenuSetting(settingKey);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await saveMenuSetting(settingKey, value.trim());
    setSaving(false);
    if (error) {
      toast.error("Uložení se nepodařilo.");
      return;
    }
    toast.success("Text období uložen.");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <div className="min-w-[16rem] flex-1 space-y-2">
          <Label htmlFor={`period-${settingKey}`}>Text zobrazený nad seznamem jídel</Label>
          <Input
            id={`period-${settingKey}`}
            value={value}
            placeholder={placeholder}
            disabled={loading}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button onClick={() => void save()} disabled={saving || loading}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Uložit
        </Button>
      </CardContent>
    </Card>
  );
}
