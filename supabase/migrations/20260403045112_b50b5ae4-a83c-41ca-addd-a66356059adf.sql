-- Fix privilege escalation: restrict INSERT/UPDATE/DELETE on user_roles to admins only
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix mutable search_path on update_intakes_updated_at
CREATE OR REPLACE FUNCTION public.update_intakes_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$function$;

-- Add provider + admin roles to user
INSERT INTO public.user_roles (user_id, role)
VALUES ('e033200b-293d-454d-9888-b83925f9c44d', 'provider')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES ('e033200b-293d-454d-9888-b83925f9c44d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;