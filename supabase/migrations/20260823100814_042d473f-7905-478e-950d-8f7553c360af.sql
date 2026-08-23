GRANT EXECUTE ON FUNCTION public.ensure_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_admin(uuid, boolean) TO authenticated;