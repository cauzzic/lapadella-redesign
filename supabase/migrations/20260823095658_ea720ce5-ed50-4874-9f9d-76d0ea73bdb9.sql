-- Owner/admin/user role system, enforced in the database

-- helpers
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'owner')
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('owner','admin'))
$$;

-- exactly one owner
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_single_owner ON public.user_roles ((role)) WHERE role = 'owner';

-- promote the existing administrator account to owner
INSERT INTO public.user_roles (user_id, role)
SELECT '4cbdda84-6fb8-407e-a4c9-27f7aa3cdd3a'::uuid, 'owner'
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner');

-- protect owner rows from any direct modification
CREATE OR REPLACE FUNCTION public.protect_owner_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'owner' THEN RAISE EXCEPTION 'Owner role cannot be removed'; END IF;
    RETURN OLD;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'owner' OR NEW.role = 'owner' THEN RAISE EXCEPTION 'Owner role cannot be changed'; END IF;
    RETURN NEW;
  END IF;
  IF NEW.role = 'owner' AND EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner') THEN
    RAISE EXCEPTION 'Owner already exists';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_owner_role ON public.user_roles;
CREATE TRIGGER protect_owner_role BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_owner_role();

-- RLS: reads only; all writes go through owner-only RPCs
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_owner(auth.uid()));

-- remove the self-service admin claim
DROP FUNCTION IF EXISTS public.claim_admin();

-- every signed-in account without a role gets the plain 'user' role (self only)
CREATE OR REPLACE FUNCTION public.ensure_user_role()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = uid) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'user') ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- owner-only user management
CREATE OR REPLACE FUNCTION public.list_users()
RETURNS TABLE (user_id uuid, email text, role text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_owner(auth.uid()) THEN RAISE EXCEPTION 'Only the owner can list users'; END IF;
  RETURN QUERY
  SELECT u.id, u.email::text,
    COALESCE((SELECT r.role::text FROM public.user_roles r WHERE r.user_id = u.id
              ORDER BY CASE r.role WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END LIMIT 1), 'user')
  FROM auth.users u
  ORDER BY u.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_admin(_user_id uuid, _is_admin boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_owner(auth.uid()) THEN RAISE EXCEPTION 'Only the owner can change roles'; END IF;
  IF public.is_owner(_user_id) THEN RAISE EXCEPTION 'Owner role cannot be changed'; END IF;
  IF _is_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin') ON CONFLICT DO NOTHING;
    DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'user';
  ELSE
    DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'user') ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.list_users() FROM anon;
REVOKE ALL ON FUNCTION public.set_admin(uuid, boolean) FROM anon;
REVOKE ALL ON FUNCTION public.ensure_user_role() FROM anon;
GRANT EXECUTE ON FUNCTION public.list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_admin(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_role() TO authenticated;

-- menu CRUD: owner or admin
DROP POLICY IF EXISTS "Admins can view all menu items" ON public.menu_polozky;
DROP POLICY IF EXISTS "Admins can insert menu items" ON public.menu_polozky;
DROP POLICY IF EXISTS "Admins can update menu items" ON public.menu_polozky;
DROP POLICY IF EXISTS "Admins can delete menu items" ON public.menu_polozky;

CREATE POLICY "Staff can view all menu items" ON public.menu_polozky
FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert menu items" ON public.menu_polozky
FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update menu items" ON public.menu_polozky
FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete menu items" ON public.menu_polozky
FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));