-- internal helper functions must not be callable through the API
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.is_owner(uuid) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_owner_role() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.list_users() FROM anon, public;
REVOKE ALL ON FUNCTION public.set_admin(uuid, boolean) FROM anon, public;
REVOKE ALL ON FUNCTION public.ensure_user_role() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_admin(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_role() TO authenticated;