CREATE TABLE public.menu_polozky (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sekce text NOT NULL,
  nazev text NOT NULL,
  popis text,
  cena numeric(10,2),
  obrazek text,
  aktivni boolean NOT NULL DEFAULT true,
  poradi integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_polozky TO anon;
GRANT SELECT ON public.menu_polozky TO authenticated;
GRANT ALL ON public.menu_polozky TO service_role;

ALTER TABLE public.menu_polozky ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aktivni polozky menu jsou verejne ke cteni"
ON public.menu_polozky FOR SELECT
USING (aktivni = true);

CREATE INDEX menu_polozky_sekce_poradi_idx ON public.menu_polozky (sekce, poradi);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_menu_polozky_updated_at
BEFORE UPDATE ON public.menu_polozky
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();