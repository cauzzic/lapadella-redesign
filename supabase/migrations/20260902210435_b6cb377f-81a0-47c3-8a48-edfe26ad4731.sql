CREATE TABLE public.popup_nastaveni (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  aktivni boolean NOT NULL DEFAULT false,
  datum_od date,
  datum_do date,
  nadpis text NOT NULL DEFAULT '',
  text text NOT NULL DEFAULT '',
  obrazek text,
  tlacitko_text text NOT NULL DEFAULT '',
  tlacitko_odkaz text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.popup_nastaveni TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.popup_nastaveni TO authenticated;
GRANT ALL ON public.popup_nastaveni TO service_role;

ALTER TABLE public.popup_nastaveni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popup je verejne ke cteni" ON public.popup_nastaveni FOR SELECT USING (true);
CREATE POLICY "Staff can insert popup" ON public.popup_nastaveni FOR INSERT TO authenticated WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff can update popup" ON public.popup_nastaveni FOR UPDATE TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE POLICY "Staff can delete popup" ON public.popup_nastaveni FOR DELETE TO authenticated USING (is_staff(auth.uid()));

CREATE TRIGGER update_popup_nastaveni_updated_at BEFORE UPDATE ON public.popup_nastaveni
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.popup_nastaveni (id) VALUES (1) ON CONFLICT DO NOTHING;