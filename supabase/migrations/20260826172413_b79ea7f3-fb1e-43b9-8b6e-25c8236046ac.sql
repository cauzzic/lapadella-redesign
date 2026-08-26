ALTER TABLE public.menu_polozky
  ADD COLUMN IF NOT EXISTS podskupina text,
  ADD COLUMN IF NOT EXISTS alergeny smallint[] NOT NULL DEFAULT '{}';