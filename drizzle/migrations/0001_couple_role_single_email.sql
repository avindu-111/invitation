CREATE OR REPLACE FUNCTION public.grant_couple_role_by_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'acsena1100@gmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'couple') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created_couple ON auth.users;
CREATE TRIGGER on_auth_user_created_couple AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_couple_role_by_email();
DELETE FROM public.user_roles WHERE role = 'couple' AND user_id NOT IN (SELECT id FROM auth.users WHERE lower(email) = 'acsena1100@gmail.com');