CREATE TABLE public.tydenni_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nazev text NOT NULL DEFAULT '',
  plati_od date,
  plati_do date,
  poznamka text NOT NULL DEFAULT '',
  zverejneno boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tydenni_menu_rozsah CHECK (plati_od IS NULL OR plati_do IS NULL OR plati_do >= plati_od),
  CONSTRAINT tydenni_menu_zverejneni_data CHECK (NOT zverejneno OR (plati_od IS NOT NULL AND plati_do IS NOT NULL))
);

GRANT SELECT ON public.tydenni_menu TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tydenni_menu TO authenticated;
GRANT ALL ON public.tydenni_menu TO service_role;

ALTER TABLE public.tydenni_menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Zverejnena tydenni menu jsou verejna" ON public.tydenni_menu
  FOR SELECT TO anon, authenticated USING (zverejneno = true);
CREATE POLICY "Staff can view all weekly menus" ON public.tydenni_menu
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert weekly menus" ON public.tydenni_menu
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update weekly menus" ON public.tydenni_menu
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete weekly menus" ON public.tydenni_menu
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TRIGGER update_tydenni_menu_updated_at
  BEFORE UPDATE ON public.tydenni_menu
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.check_tydenni_menu_overlap()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE other record;
BEGIN
  IF NEW.zverejneno AND NEW.plati_od IS NOT NULL AND NEW.plati_do IS NOT NULL THEN
    SELECT id, nazev, plati_od, plati_do INTO other FROM public.tydenni_menu
    WHERE id <> NEW.id AND zverejneno
      AND plati_od IS NOT NULL AND plati_do IS NOT NULL
      AND plati_od <= NEW.plati_do AND plati_do >= NEW.plati_od
    LIMIT 1;
    IF FOUND THEN
      RAISE EXCEPTION 'PREKRYV: Období se překrývá se zveřejněným menu „%“ (% – %).',
        COALESCE(NULLIF(other.nazev, ''), 'bez názvu'),
        to_char(other.plati_od, 'DD.MM.YYYY'), to_char(other.plati_do, 'DD.MM.YYYY');
    END IF;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER check_tydenni_menu_overlap
  BEFORE INSERT OR UPDATE ON public.tydenni_menu
  FOR EACH ROW EXECUTE FUNCTION public.check_tydenni_menu_overlap();

ALTER TABLE public.menu_polozky
  ADD COLUMN menu_id uuid NULL REFERENCES public.tydenni_menu(id) ON DELETE SET NULL;
CREATE INDEX menu_polozky_menu_id_idx ON public.menu_polozky(menu_id);

-- Zkopíruje aktivní jídla zdrojového dne do cílových dnů téhož menu.
-- Stávající aktivní jídla cílových dnů se deaktivují (nemažou).
CREATE OR REPLACE FUNCTION public.copy_weekly_day(_menu_id uuid, _from text, _to text[])
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target text; inserted integer := 0; n integer;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Nedostatečná oprávnění'; END IF;
  IF _from NOT IN ('po','ut','st','ct','pa') THEN RAISE EXCEPTION 'Neplatný den'; END IF;
  FOREACH target IN ARRAY _to LOOP
    IF target NOT IN ('po','ut','st','ct','pa') THEN RAISE EXCEPTION 'Neplatný den'; END IF;
    IF target = _from THEN CONTINUE; END IF;
    UPDATE public.menu_polozky SET aktivni = false
      WHERE menu_id = _menu_id AND sekce = 'tydenni' AND aktivni
        AND split_part(COALESCE(podskupina, ''), ':', 1) = target;
    INSERT INTO public.menu_polozky (sekce, nazev, popis, cena, obrazek, aktivni, poradi, podskupina, alergeny, menu_id)
      SELECT sekce, nazev, popis, cena, obrazek, true, poradi,
        target || CASE WHEN position(':' in podskupina) > 0 THEN ':' || split_part(podskupina, ':', 2) ELSE '' END,
        alergeny, menu_id
      FROM public.menu_polozky
      WHERE menu_id = _menu_id AND sekce = 'tydenni' AND aktivni
        AND split_part(COALESCE(podskupina, ''), ':', 1) = _from;
    GET DIAGNOSTICS n = ROW_COUNT;
    inserted := inserted + n;
  END LOOP;
  RETURN inserted;
END; $$;

-- Vytvoří nový nezveřejněný koncept jako kopii menu (jen aktivní jídla).
CREATE OR REPLACE FUNCTION public.duplicate_weekly_menu(_menu_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid; src record;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RAISE EXCEPTION 'Nedostatečná oprávnění'; END IF;
  SELECT * INTO src FROM public.tydenni_menu WHERE id = _menu_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Menu neexistuje'; END IF;
  INSERT INTO public.tydenni_menu (nazev, poznamka, zverejneno)
    VALUES (CASE WHEN src.nazev = '' THEN 'Kopie menu' ELSE 'Kopie – ' || src.nazev END, src.poznamka, false)
    RETURNING id INTO new_id;
  INSERT INTO public.menu_polozky (sekce, nazev, popis, cena, obrazek, aktivni, poradi, podskupina, alergeny, menu_id)
    SELECT sekce, nazev, popis, cena, obrazek, true, poradi, podskupina, alergeny, new_id
    FROM public.menu_polozky WHERE menu_id = _menu_id AND aktivni;
  RETURN new_id;
END; $$;

REVOKE ALL ON FUNCTION public.copy_weekly_day(uuid, text, text[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.duplicate_weekly_menu(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.copy_weekly_day(uuid, text, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.duplicate_weekly_menu(uuid) TO authenticated;