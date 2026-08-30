CREATE TABLE public.menu_nastaveni (
  klic text PRIMARY KEY,
  hodnota text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_nastaveni TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_nastaveni TO authenticated;
GRANT ALL ON public.menu_nastaveni TO service_role;

ALTER TABLE public.menu_nastaveni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nastaveni je verejne ke cteni" ON public.menu_nastaveni FOR SELECT USING (true);
CREATE POLICY "Staff can insert nastaveni" ON public.menu_nastaveni FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update nastaveni" ON public.menu_nastaveni FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete nastaveni" ON public.menu_nastaveni FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TRIGGER update_menu_nastaveni_updated_at BEFORE UPDATE ON public.menu_nastaveni FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.menu_nastaveni (klic, hodnota) VALUES ('tydenni_obdobi',''),('specialni_obdobi','');